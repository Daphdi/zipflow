// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clouddrive_db',
  port: parseInt(process.env.DB_PORT || '3306')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    const users = rows as any[]
    await connection.end()
    
    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Email tidak ditemukan" })
    }
    
    const user = users[0]
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: "Password salah" })
    }
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email } 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem" })
  }
}