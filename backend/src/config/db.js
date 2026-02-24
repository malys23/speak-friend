import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 10,
    idleTimeoutMillis: 3600000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', (client)=>{
    client.query(`SET search_path TO ${process.env.DB_SCHEMA}`);
});

pool.connect((err, client, release) =>{
    if(err){
        console.error('Error connecting to database:', err.stack);
    } else {
        console.log('Successfully connected to PostgreSQL');
        release();
    }
});

export default pool;
