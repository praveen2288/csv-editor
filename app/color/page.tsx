'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

function hexToRgb(hex: string): RGB | null {
  let cleaned = hex.replace('#', '')
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('')
  }
  if (!/^([0-9a-fA-F]{6})$/.test(cleaned)) return null
  const num = parseInt(cleaned, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  let rNorm = r / 255
  let gNorm = g / 255
  let bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)
        break
      case gNorm:
        h = (bNorm - rNorm) / d + 2
        break
      default:
        h = (rNorm - gNorm) / d + 4
        break
    }
    h *= 60
  }

  return { h, s: s * 100, l: l * 100 }
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h = h % 360
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

export default function ColorTool() {
  const [color, setColor] = useState<RGB>({ r: 255, g: 0, b: 0 })
  const [hexInput, setHexInput] = useState('')
  const [rgbInput, setRgbInput] = useState('')
  const [hslInput, setHslInput] = useState('')

  useEffect(() => {
    const hex = rgbToHex(color)
    const hsl = rgbToHsl(color)
    setHexInput(hex)
    setRgbInput(`${color.r}, ${color.g}, ${color.b}`)
    setHslInput(`${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`)
  }, [color])

  const handleHexChange = (value: string) => {
    setHexInput(value)
    const rgb = hexToRgb(value)
    if (rgb) {
      setColor(rgb)
    }
  }

  const handleRgbChange = (value: string) => {
    setRgbInput(value)
    const parts = value.split(',').map(p => parseInt(p.trim(), 10))
    if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
      setColor({ r: parts[0], g: parts[1], b: parts[2] })
    }
  }

  const handleHslChange = (value: string) => {
    setHslInput(value)
    const cleaned = value.replace(/%/g, '')
    const parts = cleaned.split(',').map(p => parseFloat(p.trim()))
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      const [h, s, l] = parts
      if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        setColor(hslToRgb(h, s, l))
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card className="w-full max-w-md m-auto">
        <CardHeader>
          <CardTitle>Color Picker / Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="color"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-full h-12 p-0 border rounded"
          />
          <div className="space-y-2">
            <Label htmlFor="hex">HEX</Label>
            <Input
              id="hex"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rgb">RGB</Label>
            <Input
              id="rgb"
              value={rgbInput}
              onChange={(e) => handleRgbChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hsl">HSL</Label>
            <Input
              id="hsl"
              value={hslInput}
              onChange={(e) => handleHslChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
