import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rewardItemId = params.id

    const rewardItem = await prisma.rewardItem.findUnique({
      where: { id: rewardItemId },
    })

    if (!rewardItem) {
      return NextResponse.json(
        { error: 'Reward item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rewardItem)
  } catch (error) {
    console.error('Error fetching reward item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reward item' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rewardItemId = params.id
    const body = await request.json()
    
    const { title, description, imageUrl, price, stock } = body

    // Get current reward item to check if it exists
    const currentRewardItem = await prisma.rewardItem.findUnique({
      where: { id: rewardItemId },
    })

    if (!currentRewardItem) {
      return NextResponse.json(
        { error: 'Reward item not found' },
        { status: 404 }
      )
    }

    // Prepare update data (only include fields that are provided)
    const updateData: Partial<{
      title: string
      description: string | null
      imageUrl: string | null
      price: number
      stock: number
    }> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (price !== undefined) updateData.price = parseInt(price)
    if (stock !== undefined) updateData.stock = parseInt(stock)

    const updatedRewardItem = await prisma.rewardItem.update({
      where: { id: rewardItemId },
      data: updateData,
    })

    return NextResponse.json(updatedRewardItem)
  } catch (error) {
    console.error('Error updating reward item:', error)
    return NextResponse.json(
      { error: 'Failed to update reward item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rewardItemId = params.id

    // Check if reward item exists
    const currentRewardItem = await prisma.rewardItem.findUnique({
      where: { id: rewardItemId },
    })

    if (!currentRewardItem) {
      return NextResponse.json(
        { error: 'Reward item not found' },
        { status: 404 }
      )
    }

    await prisma.rewardItem.delete({
      where: { id: rewardItemId },
    })

    return NextResponse.json({ message: 'Reward item deleted successfully' })
  } catch (error) {
    console.error('Error deleting reward item:', error)
    return NextResponse.json(
      { error: 'Failed to delete reward item' },
      { status: 500 }
    )
  }
}
