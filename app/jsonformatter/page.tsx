'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
    } catch (err) {
      setError('Invalid JSON')
      setOutput('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link
        href="/"
        className="fixed top-4 left-4 text-blue-600 hover:underline"
      >
        Back to Home
      </Link>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>JSON Formatter / Validator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here"
            rows={10}
            className="font-mono"
          />
          <Button onClick={handleFormat} className="w-full">
            Format JSON
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {output && (
            <Textarea
              value={output}
              readOnly
              rows={10}
              className="font-mono"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
