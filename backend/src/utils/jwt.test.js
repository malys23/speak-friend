import { describe, test, expect } from 'vitest';
import { generateToken, verifyToken } from '../utils/jwt.js';

describe('generateToken', ()=>{
    test('should generate a valid token', () =>{
        const token = generateToken({ user_id: 1, username: 'Gandalf' });
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
    });

    test('verifyToken should decode a valid token', () =>{
        const token = generateToken({ user_id: 1, username: 'Gandalf' });
        const decoded = verifyToken(token);
        expect(decoded.user_id).toBe(1);
        expect(decoded.username).toBe('Gandalf');
    });

    test('verifyToken should throw an invalid token', () =>{
        expect(()=>verifyToken('invalidtoken')).toThrow();
    });
});