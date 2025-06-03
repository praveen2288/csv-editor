'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function QRCodeGenerator() {
  const [text, setText] = useState('')
  const [qrUrl, setQrUrl] = useState('')

  const handleGenerate = async () => {
    if (!text) return
    try {
      const QRCode = await import('qrcode')
      const url = await QRCode.toDataURL(text)
      setQrUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownload = () => {
    if (!qrUrl) return
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = 'qrcode.png'
    link.click()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link
        href="/"
        className="fixed top-4 left-4 text-blue-600 hover:underline"
      >
        Back to Home
      </Link>
      <Card className="w-full max-w-md m-auto">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Enter text or URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={handleGenerate} disabled={!text}>
              Generate
            </Button>
            {qrUrl && (
              <div className="flex flex-col items-center space-y-2">
                <img src={qrUrl} alt="QR Code" className="h-40 w-40" />
                <Button variant="outline" onClick={handleDownload}>
                  Download
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
