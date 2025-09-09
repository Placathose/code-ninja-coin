import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received reward item data:', body)
    
    const { title, description, imageUrl, price, stock } = body

    // Validate required fields
    if (!title || !price) {
      console.log('Validation failed:', { title, price })
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      )
    }

    // Create reward item
    const rewardItemData = {
      title,
      description: description || null,
      imageUrl: imageUrl || null,
      price: parseInt(price),
      stock: stock ? parseInt(stock) : 0,
    }
    
    console.log('Creating reward item with data:', rewardItemData)
    
    const rewardItem = await prisma.rewardItem.create({
      data: rewardItemData,
    })

    console.log('Reward item created successfully:', rewardItem)
    return NextResponse.json(rewardItem, { status: 201 })
  } catch (error) {
    console.error('Error creating reward item:', error)
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create reward item' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const rewardItems = await prisma.rewardItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(rewardItems)
  } catch (error) {
    console.error('Error fetching reward items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reward items' },
      { status: 500 }
    )
  }
}
