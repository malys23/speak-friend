import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        restoreMocks: true,
        environment: 'node',
        globals: true,
        env: {
            JWT_SECRET: 'test-secret',
            JWT_EXPIRES_IN: '1h',
            CLIENT_URL: 'http://localhost:5173',
            DB_SCHEMA: 'speak_friend_app',
        },
    }
});