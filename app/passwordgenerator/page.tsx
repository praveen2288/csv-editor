'use client'

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy } from 'lucide-react'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [animatedPassword, setAnimatedPassword] = useState('')

  const generatePassword = () => {
    let charset = ''
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      // You could add a toast notification here
      console.log('Password copied to clipboard')
    }).catch(err => {
      console.error('Failed to copy password: ', err)
    })
  }

  useEffect(() => {
    if (password) {
      let i = 0
      const intervalId = setInterval(() => {
        if (i <= password.length) {
          setAnimatedPassword(password.slice(0, i))
          i++
        } else {
          clearInterval(intervalId)
        }
      }, 50)
      return () => clearInterval(intervalId)
    }
  }, [password])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Password Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center relative">
            <div className="text-3xl font-mono bg-gray-200 dark:bg-gray-800 p-4 rounded-md overflow-hidden">
              {animatedPassword}
              <span className="animate-pulse">|</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={copyToClipboard}
              disabled={!password}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy password</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Password Length: {length}</Label>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={6}
              max={30}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Include Lowercase</Label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Include Uppercase</Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Include Numbers</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Include Symbols</Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>
          </div>
          <Button onClick={generatePassword} className="w-full">
            Generate Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}