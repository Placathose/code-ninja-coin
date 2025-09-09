'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

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
        <div className="bg-base-100">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          {/* <div className="flex-1">
          </div> */}

          <div className="flex flex-row items-center card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
              <h2 className="card-title">Check out the list of Students</h2>
              <Link href="/allStudents" className="btn btn-primary w-[130px]">All Students</Link>
            </div>
          </div>

          <div className="flex flex-row items-center card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
              <h2 className="card-title">Check out the list of Reward Items</h2>
              <Link href="/rewardItems" className="btn btn-primary w-[130px]">All Rewards</Link>
            </div>
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