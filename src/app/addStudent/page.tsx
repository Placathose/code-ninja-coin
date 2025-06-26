'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Belt = 'WHITE' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'BLUE' | 'PURPLE' | 'BROWN' | 'RED' | 'BLACK'

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    belt: 'WHITE' as Belt,
    coins: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          coins: parseInt(formData.coins.toString()) || 0,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add student')
      }

      setSuccess('Student added successfully!')
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        belt: 'WHITE',
        coins: 0
      })
      
      // Redirect to all students page after 2 seconds
      setTimeout(() => {
        router.push('/allStudents')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Student</h1>
      
      <div className="bg-base-100 shadow-lg rounded-lg p-6 max-w-2xl">
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name *</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered"
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name *</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered"
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="input input-bordered"
                min="1"
                max="120"
                placeholder="Enter age (optional)"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Belt *</span>
              </label>
              <select
                name="belt"
                value={formData.belt}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                <option value="WHITE">White</option>
                <option value="YELLOW">Yellow</option>
                <option value="ORANGE">Orange</option>
                <option value="GREEN">Green</option>
                <option value="BLUE">Blue</option>
                <option value="PURPLE">Purple</option>
                <option value="BROWN">Brown</option>
                <option value="RED">Red</option>
                <option value="BLACK">Black</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Initial Coins</span>
            </label>
            <input
              type="number"
              name="coins"
              value={formData.coins}
              onChange={handleChange}
              className="input input-bordered"
              min="0"
              placeholder="Enter initial coins (default: 0)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding Student...
                </>
              ) : (
                'Add Student'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/allStudents')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 