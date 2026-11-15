/**
 * How an existing record is changed by `update`, or by an `upsert` on `insert`.
 * Mirrors `UpdateType` in the Java FlowVault SDK and `UpsertType` in Python.
 */
export enum UpdateType {
  /** Merge the supplied columns into the record; other columns keep their values. */
  UPDATE = 'UPDATE',
  /** Overwrite the whole record with the supplied columns. */
  REPLACE = 'REPLACE',
}

export default UpdateType;
