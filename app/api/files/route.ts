import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
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

export async function GET(request: NextRequest) {
  let connection;
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Get files for the current user
    const [rows] = await connection.execute(
      'SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC',
      [session.user.id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch files', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

export async function DELETE(request: NextRequest) {
  let connection;
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Connect to MySQL database
    connection = await mysql.createConnection(dbConfig);

    // Delete file only if it belongs to the current user
    const [result] = await connection.execute(
      'DELETE FROM files WHERE id = ? AND user_id = ?',
      [fileId, session.user.id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'File not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ 
      error: 'Failed to delete file', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
} 