import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import authMiddleware from '../middleware/auth.middleware.js';
import { generateToken } from '../utils/jwt.js';

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(()=>{
        req={ headers: {} };
        res={
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        next = vi.fn();
    });

    afterEach(()=>{
        vi.clearAllMocks();
    });

    test('should return 401 if no authorization header is provided', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    test.each([
        ['no scheme', 'InvalidFormat'],
        ['wrong sheme', 'Basic abc123'],
        ['Bearer with no token', 'Bearer'],
    ])('returns 401 for a malformed header (%s)'), (_label, header) => {
        req.headers.authorization = header;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token format' });
        expect(next).not.toHaveBeenCalled();
    };

    test('calls next and sets req.user for a valid token', () => {
        const token = generateToken({user_id:1, username: 'Gandalf'});
        req.headers.authorization = `Bearer ${token}`;

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.user.user_id).toBe(1);
        expect(req.user.username).toBe('Gandalf');
        expect(res.status).not.toHaveBeenCalled();
    });

    test('returns 401 for garbage token', ()=>{
        req.headers.authorization = `Bearer invalidToken`;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });
});