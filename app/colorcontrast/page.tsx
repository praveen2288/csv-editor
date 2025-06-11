'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

function hexToRgb(hex: string) {
  let cleaned = hex.replace('#', '')
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('')
  }
  const num = parseInt(cleaned, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

function contrastRatio(c1: string, c2: string) {
  const rgb1 = hexToRgb(c1)
  const rgb2 = hexToRgb(c2)
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')

  const ratio = contrastRatio(foreground, background)
  const passesAA = ratio >= 4.5
  const passesAAA = ratio >= 7

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Color Contrast Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium" htmlFor="foreground">Foreground</label>
              <Input id="foreground" type="color" value={foreground} onChange={e => setForeground(e.target.value)} />
            </div>
            <div className="space-y-2 flex-1">
              <label className="block text-sm font-medium" htmlFor="background">Background</label>
              <Input id="background" type="color" value={background} onChange={e => setBackground(e.target.value)} />
            </div>
          </div>
          <div className="h-20 flex items-center justify-center rounded" style={{background, color: foreground}}>
            Sample Text
          </div>
          <p>Contrast Ratio: {ratio.toFixed(2)}</p>
          <p className={passesAA ? 'text-green-600' : 'text-red-600'}>AA: {passesAA ? 'Pass' : 'Fail'}</p>
          <p className={passesAAA ? 'text-green-600' : 'text-red-600'}>AAA: {passesAAA ? 'Pass' : 'Fail'}</p>
        </CardContent>
      </Card>
    </div>
  )
}
