'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import zxcvbn from 'zxcvbn'
import Link from 'next/link'

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']

export default function PasswordStrengthMeter() {
  const [password, setPassword] = useState('')
  const result = zxcvbn(password)
  const score = result.score
  const feedback = result.feedback.suggestions.join(' ')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Strength Meter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <div className="h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${score <= 1 ? 'bg-red-500' : score === 2 ? 'bg-yellow-500' : score === 3 ? 'bg-blue-500' : 'bg-green-600'}`}
              style={{ width: `${((score + 1) / 5) * 100}%` }}
            />
          </div>
          <p>{strengthLabels[score]}</p>
          {feedback && <p className="text-sm text-gray-500">{feedback}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
