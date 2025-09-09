'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type RewardItem = {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  stock: number
  quantity: number
}

export default function RewardItemsPage() {
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRewardItems()
  }, [])

  const fetchRewardItems = async () => {
    try {
      const response = await fetch('/api/rewardItems')
      if (!response.ok) {
        throw new Error('Failed to fetch reward items')
      }
      const data = await response.json()
      setRewardItems(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Filter reward items based on search term
  const filteredRewardItems = rewardItems.filter(item => {
    const fullName = item.title.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Reward Items</h1>
        <Link href="/addrewardItem" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">Search Items</span>
          </label>
          <input
            type="text"
            placeholder="Search by item title..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRewardItems.length === 0 ? (
        <div className="bg-base-100 shadow-lg rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? 'No item Found' : 'No item Found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No item found matching "${searchTerm}"`
              : 'Start by adding your first item.'
            }
          </p>
          {!searchTerm && (
            <Link href="/addrewardItem" className="btn btn-primary">
              Add First Item
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[15px]">
          {filteredRewardItems.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-lg">
              {item.imageUrl && (
                <figure className="p-8 pt-6">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title}
                    width={250}
                    height={250}
                    className="rounded-lg w-full h-48 object-cover "
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">{item.title}</h2>
                {item.description && (
                  <p className="text-gray-600">{item.description}</p>
                )}
                <div className="card-actions justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">{item.price} coins</span>
                    <span className="badge badge-outline">Stock: {item.stock}</span>
                  </div>
                  <button className="btn btn-sm btn-primary">
                    Exchange
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
