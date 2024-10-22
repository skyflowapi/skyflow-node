import jwt_decode from 'jwt-decode'; 
import { isTokenValid } from '../../../../src/utils/jwt-utils';

jest.mock('jwt-decode');

describe('isTokenValid Tests', () => {
    const mockDecodedPayload = { sub: '12345', name: 'John Doe', exp: 1609459200 };

    beforeEach(() => {
        jwt_decode.mockReturnValue(mockDecodedPayload);
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

