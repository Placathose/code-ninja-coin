'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <div>
            
          </div>
        </div>

        <div className=" flex flex-row items-center card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h2 className="card-title">Welcome, {user.email}!</h2>
            <p>You are now signed in to your account.</p>
          </div>
          <button
            onClick={() => signOut()}
            className="btn btn-ghost"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
} 