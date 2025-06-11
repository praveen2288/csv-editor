'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Papa from 'papaparse'
import Link from 'next/link'

export default function CsvJsonConverter() {
  const [csvInput, setCsvInput] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')

  const csvToJson = () => {
    try {
      const result = Papa.parse(csvInput.trim(), { header: true })
      setJsonInput(JSON.stringify(result.data, null, 2))
      setError('')
    } catch (err) {
      setError('Invalid CSV input')
    }
  }

  const jsonToCsv = () => {
    try {
      const data = JSON.parse(jsonInput)
      const csv = Papa.unparse(data)
      setCsvInput(csv)
      setError('')
    } catch (err) {
      setError('Invalid JSON input')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>CSV ↔ JSON Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="CSV"
            rows={6}
            className="font-mono"
          />
          <Button onClick={csvToJson} disabled={!csvInput} className="w-full">
            Convert to JSON
          </Button>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="JSON"
            rows={6}
            className="font-mono"
          />
          <Button onClick={jsonToCsv} disabled={!jsonInput} className="w-full">
            Convert to CSV
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
