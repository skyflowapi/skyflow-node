/* eslint-disable camelcase */
import jwt_decode from 'jwt-decode'; 
import { isTokenValid, isExpired } from '../../../../src/utils/jwt-utils';

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

    test('should return false in catch', () => {
        jwt_decode.mockImplementation(() => {
            throw new Error("Invalid Token");
        });
        const isValid = isTokenValid("TOKEN");
        expect(isValid).toBe(false);
    });

    test('should return false in catch for isExpired', () => {
        jwt_decode.mockImplementation(() => {
            throw new Error("Invalid Token");
        });
        const isValid = isExpired("TOKEN");
        expect(isValid).toBe(true);
    });
});

