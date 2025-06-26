'use client'

import AuthLayout from '@/components/auth/AuthLayout'
import AuthForm from '@/components/auth/AuthForm'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()

  return (
    <AuthLayout>
      <AuthForm type="login" onSubmit={signIn} />
    </AuthLayout>
  )
} 