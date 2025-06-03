'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link'

type CalculationType = 'standard' | 'length' | 'weight' | 'temperature'

const useKeyboardSupport = (handleInput: (value: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (/^[0-9+\-*/.=]$/.test(key) || key === 'Backspace' || key === 'Enter') {
        event.preventDefault()
        handleInput(key === 'Enter' ? '=' : key)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleInput])
}

const useUnitConverter = () => {
  const convertLength = (value: number, fromUnit: string, toUnit: string) => {
    const rates: { [key: string]: number } = { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34 }
    return (value * rates[fromUnit]) / rates[toUnit]
  }

  const convertWeight = (value: number, fromUnit: string, toUnit: string) => {
    const rates: { [key: string]: number } = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 }
    return (value * rates[fromUnit]) / rates[toUnit]
  }

  const convertTemperature = (value: number, fromUnit: string, toUnit: string) => {
    if (fromUnit === 'C' && toUnit === 'F') return (value * 9) / 5 + 32
    if (fromUnit === 'F' && toUnit === 'C') return ((value - 32) * 5) / 9
    if (fromUnit === 'C' && toUnit === 'K') return value + 273.15
    if (fromUnit === 'K' && toUnit === 'C') return value - 273.15
    if (fromUnit === 'F' && toUnit === 'K') return ((value - 32) * 5) / 9 + 273.15
    if (fromUnit === 'K' && toUnit === 'F') return ((value - 273.15) * 9) / 5 + 32
    return value
  }

  return { convertLength, convertWeight, convertTemperature }
}

export default function AdvancedCalculator() {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<CalculationType>('standard')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [convertedValue, setConvertedValue] = useState('')

  const { convertLength, convertWeight, convertTemperature } = useUnitConverter()

  const clearAll = () => {
    setDisplay('0')
    setMemory(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const inputOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display)

    if (memory === null) {
      setMemory(inputValue)
    } else if (operator) {
      const currentValue = memory || 0
      const newValue = performCalculation[operator](currentValue, inputValue)

      setMemory(newValue)
      setDisplay(String(newValue))
      setHistory([...history, `${currentValue} ${operator} ${inputValue} = ${newValue}`])
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation: { [key: string]: (prevValue: number, nextValue: number) => number } = {
    '/': (prevValue, nextValue) => prevValue / nextValue,
    '*': (prevValue, nextValue) => prevValue * nextValue,
    '+': (prevValue, nextValue) => prevValue + nextValue,
    '-': (prevValue, nextValue) => prevValue - nextValue,
    '=': (prevValue, nextValue) => nextValue,
  }

  const handleEqual = () => {
    if (!operator || memory === null) return

    const inputValue = parseFloat(display)
    const currentValue = memory
    const newValue = performCalculation[operator](currentValue, inputValue)

    setMemory(null)
    setOperator(null)
    setDisplay(String(newValue))
    setWaitingForOperand(true)
    setHistory([...history, `${currentValue} ${operator} ${inputValue} = ${newValue}`])
  }

  const handleInput = useCallback((value: string) => {
    if (value === 'Backspace') {
      setDisplay(display.slice(0, -1) || '0')
    } else if (value === '=') {
      handleEqual()
    } else if (/^[+\-*/]$/.test(value)) {
      inputOperator(value)
    } else if (value === '.') {
      inputDecimal()
    } else if (/^[0-9]$/.test(value)) {
      inputDigit(value)
    }
  }, [display, handleEqual, inputOperator, inputDecimal, inputDigit])

  useKeyboardSupport(handleInput)

  const handleConvert = () => {
    const value = parseFloat(display)
    if (isNaN(value)) return

    let result: number
    switch (activeTab) {
      case 'length':
        result = convertLength(value, fromUnit, toUnit)
        break
      case 'weight':
        result = convertWeight(value, fromUnit, toUnit)
        break
      case 'temperature':
        result = convertTemperature(value, fromUnit, toUnit)
        break
      default:
        return
    }
    setConvertedValue(result.toFixed(4))
    setHistory([...history, `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`])
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-background rounded-lg shadow-lg">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CalculationType)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temp</TabsTrigger>
        </TabsList>
        <TabsContent value="standard" className="mt-0">
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={display} readOnly />
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
              <Button
                key={btn}
                onClick={() => {
                  if (btn === '=') handleEqual()
                  else if (/^[+\-*/]$/.test(btn)) inputOperator(btn)
                  else if (btn === '.') inputDecimal()
                  else inputDigit(btn)
                }}
                variant={/^[+\-*/=]$/.test(btn) ? 'default' : 'outline'}
              >
                {btn}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button onClick={clearAll} variant="destructive">AC</Button>
            <Button onClick={clearEntry} variant="destructive">CE</Button>
          </div>
        </TabsContent>
        <TabsContent value="length" className="mt-0">
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={display} readOnly />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'].map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'].map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleConvert} className="w-full mb-4">Convert</Button>
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={convertedValue} readOnly />
        </TabsContent>
        <TabsContent value="weight" className="mt-0">
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={display} readOnly />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {['kg', 'g', 'mg', 'lb', 'oz'].map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {['kg', 'g', 'mg', 'lb', 'oz'].map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleConvert} className="w-full mb-4">Convert</Button>
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={convertedValue} readOnly />
        </TabsContent>
        <TabsContent value="temperature" className="mt-0">
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={display} readOnly />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {['C', 'F', 'K'].map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {['C', 'F', 'K'].map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleConvert} className="w-full mb-4">Convert</Button>
          <Input className="w-full text-right text-2xl mb-4 bg-muted" value={convertedValue} readOnly />
        </TabsContent>
      </Tabs>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">History</h3>
        <ScrollArea className="h-40 rounded-md border p-2">
          {history.map((item, index) => (
            <div key={index} className="text-sm mb-1">{item}</div>
          ))}
        </ScrollArea>
      </div>
      <div className="text-center mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}