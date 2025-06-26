import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id

    // Get current student to check if they exist
    const currentStudent = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!currentStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Update student's coins (increment by 1)
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        coins: {
          increment: 1
        }
      },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Error adding coin to student:', error)
    return NextResponse.json(
      { error: 'Failed to add coin to student' },
      { status: 500 }
    )
  }
} 