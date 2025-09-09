'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { uploadToCloudinary, validateImage } from '@/lib/cloudinary'

export default function AddRewardItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImage(file)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setSelectedFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = ''

      // Upload image if file is selected
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile)
      }

      const response = await fetch('/api/rewardItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create reward item')
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        stock: ''
      })
      setSelectedFile(null)
      setImagePreview('')

      // Redirect to reward items list
      router.push('/rewardItems')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Reward Item</h1>
        <Link href="/rewardItems" className="btn btn-outline">
          Back to Items
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title *</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter item title"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter item description"
            className="textarea textarea-bordered w-full h-24"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <div className="label">
            <span className="label-text-alt">Supports JPEG, PNG, WebP, GIF (max 20MB)</span>
          </div>
          {imagePreview && (
            <div className="mt-4">
              <Image 
                src={imagePreview} 
                alt="Preview" 
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Price (coins) *</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price in coins"
            className="input input-bordered w-full"
            min="1"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Stock Quantity</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            className="input input-bordered w-full"
            min="0"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              'Create Reward Item'
            )}
          </button>
          <Link href="/rewardItems" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
