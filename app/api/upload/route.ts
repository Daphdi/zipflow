import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";

// Database connection configuration
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
    // Log cookies yang diterima server
    const cookies = request.headers.get('cookie');
    console.log('DEBUG SERVER COOKIES:', cookies);
    // Get the current user session
    const session = await getServerSession(authOptions);
    console.log('DEBUG SESSION SERVER:', session);
    if (!session?.user?.id) {
      console.error('Unauthorized: No valid session found');
      return NextResponse.json({ error: 'Unauthorized - Please login to upload files' }, { status: 401 });
    }

    console.log('Starting file upload process for user:', session.user.id);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (100MB limit)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size);
      return NextResponse.json({ 
        error: 'File too large', 
        details: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Read file content
    console.log('Reading file content...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString('base64');
    console.log('File content converted to base64');

    // Connect to MySQL database
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established');

    // Insert file metadata and content into the database with user_id
    console.log('Inserting file into database...');
    const [result] = await connection.execute(
      'INSERT INTO files (name, size, type, content, user_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [file.name, file.size, file.type, base64Content, session.user.id]
    );
    console.log('File inserted successfully');

    // Get the inserted file data
    console.log('Fetching inserted file data...');
    const [rows] = await connection.execute(
      'SELECT * FROM files WHERE id = ?',
      [(result as any).insertId]
    );
    console.log('File data fetched successfully');

    const fileRow = Array.isArray(rows) && rows.length > 0 ? (rows[0] as RowDataPacket & { content?: string }) : null;
    if (!fileRow) {
      return NextResponse.json({ error: 'File not found after insert' }, { status: 500 });
    }
    // Pastikan field content selalu ada
    if (!fileRow.content) fileRow.content = base64Content;

    return NextResponse.json({ 
      success: true, 
      file: fileRow
    });
  } catch (error) {
    let details = error instanceof Error ? error.message : 'Unknown error';
    console.error('Upload error:', details);
    return NextResponse.json({ error: 'Upload failed', details }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
} 