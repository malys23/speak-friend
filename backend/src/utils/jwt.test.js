import { describe, test, expect } from 'vitest';
import { generateToken, verifyToken } from '../utils/jwt.js';

const payload = { user_id: 1, username: 'Gandalf' };

describe('generateToken', ()=>{
    test('generates a three-part JWT string', () =>{
        const token = generateToken(payload);
        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3);
    });

    test('includes an expirty claim', () => {
        const decoded = verifyToken(generateToken(payload));
        expect(decoded.exp).toBeTypeOf('number');
        expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() /1000));
    });
});

describe('verifyToken', () => {
    test('decodes a valid token', () => {
        const decoded = verifyToken(generateToken(payload));
        expect(decoded.user_id).toBe(1);
        expect(decoded.username).toBe('Gandalf');
    });

    test('throws for a malformed token', () => {
        expect(() => verifyToken('invalidToken')).toThrow('jwt malformed');
    });

    test('throws for a token signed with a different secret', () => {
        const forged = jwt.sign(payload, 'some-other-secret');
        expect(() => verifyToken(forged)).toThrow('invalid signature');
    });

    test('throws for a tampered payload', () => {
        const [header, , signature] = generateToken(payload).split('.');
        const fakePayload = Buffer.from(JSON.stringify({ user_id: 999 })).toString('base64url');
        expect(() => verifyToken(`${header}.${fakePayload}.${signature}`)).toThrow('invalid signature');
    });

    test('throws TokenExpiredError for an expired token', () => {
        const expired = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: -10 });
        expect(() => verifyToken(expired)).toThrow('jwt expired');
    });
});