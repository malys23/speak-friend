import { describe, test, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';

describe('hashPassword', ()=>{
    test('should hash a password', async () => {
        const hash = await hashPassword('mypassword');
        expect(hash).not.toBe('mypassword');
        expect(hash).toMatch(/^\$2b\$/);
    });

    test('comparePassword returns true for correct password', async () => {
        const hash = await hashPassword('mypassword');
        const result = await comparePassword('mypassword', hash);
        expect(result).toBe(true);
    });

    test('comparePassword returns false for wrong password', async ()=>{
        const hash = await hashPassword('mypassword');
        const result = await comparePassword('wrongpassword', hash);
        expect(result).toBe(false);
    });
});