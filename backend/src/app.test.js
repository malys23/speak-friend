import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('./config/db.js', () => ({
    default: { query: vi.fn(), connect: vi.fn(), on: vi.fn() },
}));

import pool from './config/db.js';
import app from './app.js';

const pgError = (code, constraint) => Object.assign(new Error('db error'), { code, constraint });

const newUser = { username: 'gandalf', email: 'g@example.com', dob: null, password: 'Passw0rd!' };

describe('error handling over HTTP', () => {
    beforeEach(() => {
        pool.query.mockReset();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    test('unknown route returns a JSON 404', async () => {
        const res = await request(app).get('/api/nope');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Not found' });
    });

    test('malformed JSON returns 400', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send('{bad json}');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid JSON in request body' });
    });

    test('duplicate email on register returns 409', async () => {
        pool.query.mockRejectedValueOnce(pgError('23505', 'users_email_key'));
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: 'Email already in use' });
    });

    test('duplicate username on register returns 409', async () => {
        pool.query.mockRejectedValueOnce(pgError('23505', 'users_username_key'));
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.status).toBe(409);
        expect(res.body).toEqual({ message: 'Username already taken' });
    });

    test('invalid date of birth returns 400', async () => {
        pool.query.mockRejectedValueOnce(pgError('22007'));
        const res = await request(app).post('/api/auth/register').send({...newUser, dob:'abc'});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid input format' });
    });

    test('login with an unknown email returns 401', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nobody@example.com', password: 'whatever' });
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: 'Invalid email or password' });
    });

    test('a protected route without a token returns 401', async () => {
        const res = await request(app).get('/api/friends');
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: 'No token provided' });
    });

    test('an unexpected failure returns a generic 500 with no details leaked', async () => {
        pool.query.mockRejectedValueOnce(new Error('connection to server at "localhost" failed'));
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Something went wrong' });
        expect(JSON.stringify(res.body)).not.toContain('localhost');
    })
});