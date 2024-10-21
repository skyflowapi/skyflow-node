import { jwtDecode } from 'jwt-decode'; 
import { isTokenValid } from '../../../../src/utils/jwt-utils';

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}));

describe('isTokenValid Tests', () => {
    const mockDecodedPayload = { sub: '12345', name: 'John Doe', exp: 1609459200 };

    beforeEach(() => {
        jwtDecode.mockReturnValue(mockDecodedPayload);
    });

    test('should return false for an invalid token', () => {
        const isValid = isTokenValid("token");
        expect(isValid).toBe(false);
    });

    test('should return false for an empty token', () => {
        const isValid = isTokenValid("");
        expect(isValid).toBe(false);
    });
});

