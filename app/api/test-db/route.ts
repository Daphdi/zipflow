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

export async function GET(request: NextRequest) {
  try {
    // Log environment variables (without sensitive data)
    const envInfo = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      DB_HOST: process.env.DB_HOST || 'NOT_SET',
      DB_USER: process.env.DB_USER || 'NOT_SET',
      DB_NAME: process.env.DB_NAME || 'NOT_SET',
      DB_PORT: process.env.DB_PORT || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
    };
    
    console.log('Environment Info:', envInfo);
    
    const dbConfig = getDbConfig();
    console.log('Database Config (without password):', { ...dbConfig, password: '[HIDDEN]' });
    
    // Test database connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Test query result:', rows);
    
    // Check if users table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    console.log('Users table check:', tables);
    
    await connection.end();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      envInfo,
      dbConfig: { ...dbConfig, password: '[HIDDEN]' },
      testQuery: rows,
      usersTableExists: (tables as any[]).length > 0
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      envInfo: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        DB_HOST: process.env.DB_HOST || 'NOT_SET',
        DB_USER: process.env.DB_USER || 'NOT_SET',
        DB_NAME: process.env.DB_NAME || 'NOT_SET',
        DB_PORT: process.env.DB_PORT || 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
      }
    }, { status: 500 });
  }
} 