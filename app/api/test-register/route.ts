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
    console.log('=== TEST REGISTER START ===');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json({ 
        error: 'All fields are required',
        received: { name: !!name, email: !!email, password: !!password }
      }, { status: 400 });
    }
    
    console.log('All fields present, proceeding with database connection...');
    
    const dbConfig = getDbConfig();
    console.log('Database config (without password):', { ...dbConfig, password: '[HIDDEN]' });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully');
    
    // Check if users table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    console.log('Users table check result:', tables);
    
    if ((tables as any[]).length === 0) {
      console.log('Users table does not exist, creating it...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL,
          email_verified DATETIME,
          image VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table created successfully');
    } else {
      console.log('Users table already exists');
    }
    
    // Cek apakah email sudah terdaftar
    console.log('Checking if email already exists:', email);
    const [rows] = await connection.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    console.log('Email check result:', rows);
    
    if ((rows as any[]).length > 0) {
      console.log('Email already exists');
      await connection.end();
      return NextResponse.json({ 
        error: 'Email sudah terdaftar', 
        debug: rows 
      }, { status: 400 });
    }
    
    // Simpan user baru
    const userId = Date.now().toString();
    console.log('Creating new user with ID:', userId);
    
    await connection.execute(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [userId, name, email, password]
    );
    console.log('User created successfully');
    
    await connection.end();
    console.log('=== TEST REGISTER SUCCESS ===');
    
    return NextResponse.json({ 
      success: true,
      message: 'User registered successfully',
      userId: userId
    });
    
  } catch (error) {
    console.error('=== TEST REGISTER ERROR ===');
    console.error('Error details:', error);
    
    return NextResponse.json({ 
      error: 'Register failed', 
      details: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    if (connection) {
      try { 
        await connection.end(); 
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
  }
} 