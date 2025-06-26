'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Student = {
  id: string
  firstName: string
  lastName: string
  age: number | null
  belt: 'WHITE' | 'YELLOW' | 'ORANGE' | 'GREEN' | 'BLUE' | 'PURPLE' | 'BROWN' | 'RED' | 'BLACK'
  coins: number
  createdAt: string
  updatedAt: string
}

const beltColors = {
  WHITE: 'border-l-white',
  YELLOW: 'border-l-yellow-400',
  ORANGE: 'border-l-orange-500',
  GREEN: 'border-l-green-500',
  BLUE: 'border-l-blue-500',
  PURPLE: 'border-l-purple-500',
  BROWN: 'border-l-amber-700',
  RED: 'border-l-red-500',
  BLACK: 'border-l-gray-900'
}

const beltLabels = {
  WHITE: 'White',
  YELLOW: 'Yellow',
  ORANGE: 'Orange',
  GREEN: 'Green',
  BLUE: 'Blue',
  PURPLE: 'Purple',
  BROWN: 'Brown',
  RED: 'Red',
  BLACK: 'Black'
}

export default function AllStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [addingCoin, setAddingCoin] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  const handleAddCoin = (student: Student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const confirmAddCoin = async () => {
    if (!selectedStudent) return

    setAddingCoin(true)
    try {
      const response = await fetch(`/api/students/${selectedStudent.id}/add-coin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to add coin')
      }

      // Show success toast
      setToastMessage(`Successfully added coin to ${selectedStudent.firstName} ${selectedStudent.lastName}`)
      setShowToast(true)

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false)
      }, 3000)

      // Reload students list
      await fetchStudents()

      // Close modal
      setShowModal(false)
      setSelectedStudent(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add coin')
    } finally {
      setAddingCoin(false)
    }
  }

  const cancelAddCoin = () => {
    setShowModal(false)
    setSelectedStudent(null)
  }

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
    <div className="container mx-auto p-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedStudent && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add Coin</h3>
            <p className="mb-6">
              Should {selectedStudent.firstName} {selectedStudent.lastName} receive a new coin?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={confirmAddCoin}
                disabled={addingCoin}
              >
                {addingCoin ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding...
                  </>
                ) : (
                  'Add Coin'
                )}
              </button>
              <button
                className="btn btn-ghost"
                onClick={cancelAddCoin}
                disabled={addingCoin}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Students</h1>
        <Link href="/addStudent" className="btn btn-primary">
          Add New Student
        </Link>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="form-control w-full max-w-md">
          <label className="label">
            <span className="label-text">Search Students</span>
          </label>
          <input
            type="text"
            placeholder="Search by student name..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="bg-base-100 shadow-lg rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? 'No Students Found' : 'No Students Found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No students found matching "${searchTerm}"`
              : 'Start by adding your first student.'
            }
          </p>
          {!searchTerm && (
            <Link href="/addStudent" className="btn btn-primary">
              Add First Student
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`bg-base-100 shadow-lg rounded-lg p-6 border-l-4 ${beltColors[student.belt]} mb-4`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {student.firstName} {student.lastName}
                  </h3>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Age: </span>
                  <span className="font-medium">
                    {student.age ? `${student.age} years` : 'Not specified'}
                  </span>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Belt: </span>
                  <div className="inline-flex items-center gap-2">
                    <span className="font-medium">{beltLabels[student.belt]}</span>
                    <div className={`w-4 h-4 rounded-full ${beltColors[student.belt].replace('border-l-', 'bg-')}`}></div>
                  </div>
                </div>

                <div>
                  {/* <p className="text-sm text-gray-600">Coins</p> */}
                  <p className="font-medium text-yellow-600">
                    {student.coins} {student.coins === 1 ? 'coin' : 'coins'}
                  </p>
                </div>
                <button
                    onClick={() => handleAddCoin(student)}
                    className="btn btn-sm btn-outline btn-primary mt-2 w-22"
                  >
                    Add Coins
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredStudents.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          {searchTerm ? (
            <div>
              <p>Showing {filteredStudents.length} of {students.length} students</p>
              <p>Search results for: &quot;{searchTerm}&quot;</p>
            </div>
          ) : (
            <p>Total Students: {students.length}</p>
          )}
        </div>
      )}
    </div>
  )
} 