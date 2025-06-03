'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('')
  }
  const int = parseInt(hex, 16)
  if (Number.isNaN(int)) return null
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  s /= 100
  l /= 100
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#ff0000')
  const [rgb, setRgb] = useState('255, 0, 0')
  const [hsl, setHsl] = useState('0, 100%, 50%')

  const updateFromHex = (value: string) => {
    if (!value) return
    if (!value.startsWith('#')) value = '#' + value
    const rgbVal = hexToRgb(value)
    if (!rgbVal) return
    setHex(value)
    setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`)
    const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b)
    setHsl(`${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%`)
  }

  const updateFromRgb = (value: string) => {
    setRgb(value)
    const parts = value.split(/[,\s]+/).filter(Boolean).map(Number)
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return
    const [r, g, b] = parts
    if ([r, g, b].some((n) => n < 0 || n > 255)) return
    setHex(rgbToHex(r, g, b))
    const hslVal = rgbToHsl(r, g, b)
    setHsl(`${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%`)
  }

  const updateFromHsl = (value: string) => {
    setHsl(value)
    const parts = value
      .replace(/%/g, '')
      .split(/[,\s]+/)
      .filter(Boolean)
      .map(Number)
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return
    const [h, s, l] = parts
    if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return
    const rgbVal = hslToRgb(h, s, l)
    setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`)
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Color Picker / Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded border"
              style={{ backgroundColor: hex }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color-input">Pick Color</Label>
            <Input
              id="color-input"
              type="color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hex">HEX</Label>
            <Input id="hex" value={hex} onChange={(e) => updateFromHex(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rgb">RGB</Label>
            <Input
              id="rgb"
              value={rgb}
              placeholder="255, 0, 0"
              onChange={(e) => updateFromRgb(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hsl">HSL</Label>
            <Input
              id="hsl"
              value={hsl}
              placeholder="0, 100%, 50%"
              onChange={(e) => updateFromHsl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
