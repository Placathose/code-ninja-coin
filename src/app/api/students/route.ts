import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received student data:', body)
    
    const { firstName, lastName, age, belt, coins } = body

    // Validate required fields
    if (!firstName || !lastName || !belt) {
      console.log('Validation failed:', { firstName, lastName, belt })
      return NextResponse.json(
        { error: 'First name, last name, and belt are required' },
        { status: 400 }
      )
    }

    // Create student
    const studentData = {
      firstName,
      lastName,
      age: age ? parseInt(age) : null,
      belt,
      coins: coins || 0,
    }
    
    console.log('Creating student with data:', studentData)
    
    const student = await prisma.student.create({
      data: studentData,
    })

    console.log('Student created successfully:', student)
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
} 