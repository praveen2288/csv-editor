'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import yaml from 'js-yaml'
import Link from 'next/link'

export default function JsonYamlConverter() {
  const [jsonInput, setJsonInput] = useState('')
  const [yamlInput, setYamlInput] = useState('')
  const [error, setError] = useState('')

  const jsonToYaml = () => {
    try {
      const obj = JSON.parse(jsonInput)
      setYamlInput(yaml.dump(obj))
      setError('')
    } catch {
      setError('Invalid JSON input')
    }
  }

  const yamlToJson = () => {
    try {
      const obj = yaml.load(yamlInput)
      setJsonInput(JSON.stringify(obj, null, 2))
      setError('')
    } catch {
      setError('Invalid YAML input')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>JSON ↔ YAML Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="JSON"
            rows={6}
            className="font-mono"
          />
          <Button onClick={jsonToYaml} disabled={!jsonInput} className="w-full">
            Convert to YAML
          </Button>
          <Textarea
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            placeholder="YAML"
            rows={6}
            className="font-mono"
          />
          <Button onClick={yamlToJson} disabled={!yamlInput} className="w-full">
            Convert to JSON
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
