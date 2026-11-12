jest.mock('fs/promises', () => ({ readFile: jest.fn() }));

import * as fsPromises from 'fs/promises';
import { UploadFilesRequest, UploadFilesResponse } from '../../src';
import VaultController from '../../src/controller/vault';
import {
  makeFakeClient,
  resourceMethod,
  rejectingMethod,
  rawResponseNoHeaders,
  REQUEST_ID,
  silenceConsole,
} from '../helpers';

silenceConsole();

const readFileMock = fsPromises.readFile as unknown as jest.Mock;

/** Minimal File-like with arrayBuffer() + name, as the controller consumes. */
function fakeFile(bytes: number[], name: string): File {
  return {
    name,
    arrayBuffer: async () => new Uint8Array(bytes).buffer,
  } as unknown as File;
}

describe('VaultController.uploadFiles', () => {
  let originalFetch: typeof global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    originalFetch = (global as { fetch: typeof global.fetch }).fetch;
    fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    (global as unknown as { fetch: unknown }).fetch = fetchMock;
    readFileMock.mockReset();
  });

  afterEach(() => {
    (global as unknown as { fetch: unknown }).fetch = originalFetch;
  });

  it('filePath source: reads bytes, infers fileName + Content-Type, PUTs with no Authorization', async () => {
    readFileMock.mockResolvedValue(Buffer.from('file-bytes'));
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 'onboarding', data: { doc: 'https://signed/doc' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const req = new UploadFilesRequest([
      { tableName: 'onboarding', skyflowId: 'row1', columns: [{ column: 'doc', filePath: '/tmp/report.png' }] },
    ]);
    const resp = await controller.uploadFiles(req);

    expect(resp).toBeInstanceOf(UploadFilesResponse);
    expect(uploadFiles).toHaveBeenCalledTimes(1);

    // Phase A request: skyflowID + columns (fileName inferred from the path).
    const [genReq] = uploadFiles.mock.calls[0];
    expect(genReq.vaultID).toBe('vault123');
    expect(genReq.records[0].skyflowID).toBe('row1');
    expect(genReq.records[0].columns).toEqual([{ column: 'doc', fileName: 'report.png' }]);

    // Phase B PUT to the signed URL.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://signed/doc');
    expect(init.method).toBe('PUT');
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.headers['Content-Type']).toBe('image/png');
    expect(Buffer.from(init.body).toString()).toBe('file-bytes');

    const col = resp.records[0].columns[0];
    expect(col.column).toBe('doc');
    expect(col.fileName).toBe('report.png');
    expect(col.uploadStatus).toBe('UPLOADED');
    expect(resp.records[0].skyflowId).toBe('id1');
    expect(resp.records[0].httpCode).toBe(200);
    expect(resp.records[0].error).toBeNull();
  });

  it('base64 source: uses provided fileName, decodes bytes, infers Content-Type', async () => {
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { resume: 'https://signed/resume' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const req = new UploadFilesRequest([
      { tableName: 't', columns: [{ column: 'resume', base64: Buffer.from('hello').toString('base64'), fileName: 'resume.pdf' }] },
    ]);
    const resp = await controller.uploadFiles(req);

    // No skyflowId provided -> omitted from the generated record.
    const [genReq] = uploadFiles.mock.calls[0];
    expect(genReq.records[0].skyflowID).toBeUndefined();
    expect(genReq.records[0].columns).toEqual([{ column: 'resume', fileName: 'resume.pdf' }]);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['Content-Type']).toBe('application/pdf');
    expect(Buffer.from(init.body).toString()).toBe('hello');
    expect(resp.records[0].columns[0].uploadStatus).toBe('UPLOADED');
  });

  it('file source: reads arrayBuffer, infers fileName from file.name', async () => {
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { pic: 'https://signed/pic' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const req = new UploadFilesRequest([
      { tableName: 't', columns: [{ column: 'pic', file: fakeFile([1, 2, 3], 'photo.jpg') }] },
    ]);
    const resp = await controller.uploadFiles(req);

    const [genReq] = uploadFiles.mock.calls[0];
    expect(genReq.records[0].columns).toEqual([{ column: 'pic', fileName: 'photo.jpg' }]);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['Content-Type']).toBe('image/jpeg');
    expect(Array.from(init.body as Uint8Array)).toEqual([1, 2, 3]);
    expect(resp.records[0].columns[0].fileName).toBe('photo.jpg');
    expect(resp.records[0].columns[0].uploadStatus).toBe('UPLOADED');
  });

  it('unknown extension falls back to application/octet-stream', async () => {
    readFileMock.mockResolvedValue(Buffer.from('zipbytes'));
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { archive: 'https://signed/archive' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'archive', filePath: '/tmp/a.zip' }] }]),
    );
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['Content-Type']).toBe('application/octet-stream');
  });

  it('FAILED when the signed-URL PUT responds not-ok', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { resume: 'https://signed/resume' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );

    const col = resp.records[0].columns[0];
    expect(col.uploadStatus).toBe('FAILED');
    expect(col.error).toBe('Upload failed with status 500.');
  });

  it('FAILED (with thrown message) when the signed-URL PUT throws', async () => {
    fetchMock.mockRejectedValue(new Error('conn reset'));
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { resume: 'https://signed/resume' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );

    const col = resp.records[0].columns[0];
    expect(col.uploadStatus).toBe('FAILED');
    expect(col.error).toBe('conn reset');
  });

  it('SKIPPED (with record error) when the response record itself errored; requestId from header', async () => {
    const uploadFiles = resourceMethod({
      records: [{ tableName: 't', httpCode: 400, error: 'row rejected' }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(resp.records[0].error).toBe('row rejected');
    expect(resp.records[0].requestId).toBe(REQUEST_ID);
    const col = resp.records[0].columns[0];
    expect(col.uploadStatus).toBe('SKIPPED');
    expect(col.error).toBe('row rejected');
  });

  it('SKIPPED (no error) when no signed URL is returned for a column', async () => {
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: {}, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    const col = resp.records[0].columns[0];
    expect(col.uploadStatus).toBe('SKIPPED');
    expect(col.error).toBeUndefined();
  });

  it('handles multiple columns in one record (UPLOADED + SKIPPED aligned by column name)', async () => {
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { a: 'https://signed/a' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([
        {
          tableName: 't',
          columns: [
            { column: 'a', base64: 'aGk=', fileName: 'a.pdf' },
            { column: 'b', base64: 'aGk=', fileName: 'b.pdf' },
          ],
        },
      ]),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const cols = resp.records[0].columns;
    expect(cols.find((c) => c.column === 'a')?.uploadStatus).toBe('UPLOADED');
    expect(cols.find((c) => c.column === 'b')?.uploadStatus).toBe('SKIPPED');
  });

  it('FAILED (stringified) when the signed-URL PUT rejects with a non-Error', async () => {
    fetchMock.mockRejectedValue('socket hang up'); // a thrown string, not an Error
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { resume: 'https://signed/resume' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );

    const col = resp.records[0].columns[0];
    expect(col.uploadStatus).toBe('FAILED');
    expect(col.error).toBe('socket hang up');
  });

  it('infers octet-stream for a file with no name and for a trailing-dot name', async () => {
    const uploadFiles = resourceMethod({
      records: [{ skyflowID: 'id1', tableName: 't', data: { a: 'https://signed/a', b: 'https://signed/b' }, httpCode: 200 }],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    await controller.uploadFiles(
      new UploadFilesRequest([
        {
          tableName: 't',
          columns: [
            // File-like with an undefined name and no explicit fileName -> fileName stays undefined.
            { column: 'a', file: fakeFile([1], undefined as unknown as string) },
            // A trailing-dot name -> extension resolves to '' -> octet-stream.
            { column: 'b', base64: 'aGk=', fileName: 'weird.' },
          ],
        },
      ]),
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls) {
      expect(init.headers['Content-Type']).toBe('application/octet-stream');
    }
  });

  it('tolerates a response record with no matching prepared columns (prepared index absent)', async () => {
    // Server returns MORE records than were sent -> prepared[1] is undefined -> [].
    const uploadFiles = resourceMethod({
      records: [
        { skyflowID: 'id1', tableName: 't', data: {}, httpCode: 200 },
        { skyflowID: 'id2', tableName: 't', data: {}, httpCode: 200 },
      ],
    });
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));

    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );

    expect(resp.records).toHaveLength(2);
    expect(resp.records[1].columns).toEqual([]); // no prepared columns for the extra record
  });

  it('returns an empty records array when the response has none', async () => {
    const uploadFiles = resourceMethod({});
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));
    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );
    expect(resp.records).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sets requestId to null on an errored record when the raw response has no headers', async () => {
    const uploadFiles = resourceMethod({ records: [{ tableName: 't', httpCode: 400, error: 'row rejected' }] }, rawResponseNoHeaders);
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));
    const resp = await controller.uploadFiles(
      new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
    );
    expect(resp.records[0].error).toBe('row rejected');
    expect(resp.records[0].requestId).toBeNull();
  });

  it('rejects when the generated uploadFiles method throws', async () => {
    const uploadFiles = rejectingMethod(new Error('boom-upload'));
    const controller = new VaultController(makeFakeClient({ files: { uploadFiles } }));
    await expect(
      controller.uploadFiles(
        new UploadFilesRequest([{ tableName: 't', columns: [{ column: 'resume', base64: 'aGk=', fileName: 'r.pdf' }] }]),
      ),
    ).rejects.toThrow('boom-upload');
  });
});
