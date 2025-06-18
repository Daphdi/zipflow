import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clouddrive_db',
  port: parseInt(process.env.DB_PORT || '3306'),
};

export async function POST(request: NextRequest) {
  let connection;
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
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