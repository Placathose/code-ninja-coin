'use client'

import AuthLayout from '@/components/auth/AuthLayout'
import AuthForm from '@/components/auth/AuthForm'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const { signUp } = useAuth()

  return (
    <AuthLayout>
      <AuthForm type="signup" onSubmit={signUp} />
    </AuthLayout>
  )
} 