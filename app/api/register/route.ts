import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Parse DATABASE_URL if available, otherwise use individual env vars
const getDbConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // Parse DATABASE_URL format: mysql://username:password@host:port/database_name
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      port: parseInt(url.port || '3306'),
    };
  }
  
  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clouddrive_db',
    port: parseInt(process.env.DB_PORT || '3306'),
  };
};

export async function POST(request: NextRequest) {
  let connection;
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    const dbConfig = getDbConfig();
    console.log('DEBUG: Database config (without password):', { ...dbConfig, password: '[HIDDEN]' });
    
    connection = await mysql.createConnection(dbConfig);
    
    // Cek apakah email sudah terdaftar
    const [rows] = await connection.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    console.log('DEBUG: Query result for email', email, rows);
    
    if ((rows as any[]).length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'Email sudah terdaftar', debug: rows }, { status: 400 });
    }
    
    // Simpan user baru
    await connection.execute(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [Date.now().toString(), name, email, password]
    );
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return NextResponse.json({ error: 'Register failed', details: error instanceof Error ? error.message : error }, { status: 500 });
  } finally {
    if (connection) {
      try { await connection.end(); } catch {}
    }
  }
} 