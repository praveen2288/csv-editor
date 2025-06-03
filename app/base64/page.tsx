'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Base64Tool() {
  const [text, setText] = useState('')
  const [base64, setBase64] = useState('')
  const [error, setError] = useState('')

  const encode = () => {
    try {
      setBase64(btoa(text))
      setError('')
    } catch {
      setError('Unable to encode input')
    }
  }

  const decode = () => {
    try {
      setText(atob(base64))
      setError('')
    } catch {
      setError('Invalid Base64 string')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Base64 Encoder / Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text"
            rows={5}
            className="font-mono"
          />
          <Button onClick={encode} disabled={!text} className="w-full">
            Encode
          </Button>
          <Textarea
            value={base64}
            onChange={(e) => setBase64(e.target.value)}
            placeholder="Base64"
            rows={5}
            className="font-mono"
          />
          <Button onClick={decode} disabled={!base64} className="w-full">
            Decode
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
