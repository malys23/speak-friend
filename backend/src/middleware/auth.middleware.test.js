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

    test('should return 401 if no token provided', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next if valid token provided', () => {
        req.headers.authorization = 'InvalidFormat';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next if valid token provided', () => {
        const token = generateToken({user_id:1, username: 'Gandalf'});
        req.headers.authorization = `Bearer ${token}`;

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user.user_id).toBe(1);
        expect(req.user.username).toBe('Gandalf');
    });

    test('should return 401 if token is invalid', ()=>{
        req.headers.authorization = `Bearer invalidToken`;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});