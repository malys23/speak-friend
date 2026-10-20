import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { errorHandler, notFound } from '../middleware/error.middleware.js';
import AppError from '../utils/AppError.js';

describe('errorHandler', () => {
    let req, res, next;

    beforeEach(() => {
        req={};
        res={
            headersSent: false,
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        next = vi.fn();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('uses the status and message of an AppError', () => {
        errorHandler(new AppError(404, 'User not found'), req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test.each([
        ['users_email_key', 'Email already in use'],
        ['users_username_key', 'Username already taken'],
        ['some_other_constraint', 'Resource already exists'],
    ])('maps unique violation on %s to 409', (constraint, message) => {
        const err = Object.assign(new Error('dup'), { code: '23505', constraint });
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message });
    });

    test.each([
        ['23503', 409],
        ['23514', 400],
        ['22P02', 400],
        ['22007', 400],
    ])('maps Postgres code %s to %i', (code, status) => {
        errorHandler(Object.assign(new Error('x'), {code}), req, res, next);
        expect(res.status).toHaveBeenCalledWith(status);
    });

    test('maps a body-parser JSON error to 400', () => {
        errorHandler(Object.assign(new Error('bad'), { type: 'entity.parse.failed' }), req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid JSON in request body' });
    });

    test('hides the details of unexpected errors and logs them', () => {
        errorHandler(new Error('secret SQL details'), req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
        expect(console.error).toHaveBeenCalled();
    });

    test('passes the error on if the response has already started', () =>{
        res.headersSent = true;
        const err = new Error('late');
        errorHandler(err, req, res, next);
        expect(next).toHaveBeenCalledWith(err);
        expect(res.status).not.toHaveBeenCalled();
    });

    describe('notFound', () => {
        test('returns a JSON 404', () => {
            const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
            notFound({}, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
        });
    });
})