jest.mock('../../src/ _generated_/rest/api/resources/authentication/client/Client', () => ({
  Authentication: jest.fn().mockImplementation((config) => ({ config })),
}));

const Client = require('../../src/service-account/client').default;
const {
  Authentication,
} = require('../../src/ _generated_/rest/api/resources/authentication/client/Client');

describe('Service Account Client', () => {
  beforeEach(() => {
    Authentication.mockClear();
  });

  test('initializes Authentication with the token URI as baseUrl', () => {
    const tokenUri = 'https://example.com/oauth/token';
    const client = new Client(tokenUri);

    expect(Authentication).toHaveBeenCalledWith({
      baseUrl: tokenUri,
      token: '',
    });
    expect(client.authApi).toBeDefined();
    expect(client.authApi.config.baseUrl).toBe(tokenUri);
  });
});
