"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

export default function Component() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [birthTime, setBirthTime] = useState<string>("00:00")
  const [age, setAge] = useState<string>("Enter your birth date and time")
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const currentYear = new Date().getFullYear()
  const fromYear = 1900
  const toYear = currentYear

  useEffect(() => {
    if (!birthDate) return

    const intervalId = setInterval(() => {
      const now = new Date()
      const birth = new Date(birthDate)
      birth.setHours(parseInt(birthTime.split(":")[0], 10))
      birth.setMinutes(parseInt(birthTime.split(":")[1], 10))

      const diff = now.getTime() - birth.getTime()

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44))
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setAge(`${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [birthDate, birthTime])

  const handleYearSelect = (year: string) => {
    const yearNumber = parseInt(year, 10)
    setSelectedYear(yearNumber)
    if (birthDate) {
      const newDate = new Date(birthDate)
      newDate.setFullYear(yearNumber)
      setBirthDate(newDate)
    } else {
      setBirthDate(new Date(yearNumber, 0, 1))
    }
    setCalendarOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setBirthDate(date)
    setSelectedYear(date?.getFullYear())
    setCalendarOpen(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link
        href="/"
        className="fixed top-4 left-4 text-blue-600 hover:underline"
      >
        Back to Home
      </Link>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Precise Age Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="birth-year">Birth Year</Label>
              <Select onValueChange={handleYearSelect} value={selectedYear?.toString()}>
                <SelectTrigger id="birth-year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: toYear - fromYear + 1 }, (_, index) => toYear - index).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birth-date">Birth Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="birth-date"
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!birthDate && "text-muted-foreground"
                      }`}
                    onClick={() => setCalendarOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? birthDate.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={handleDateSelect}
                    fromYear={fromYear}
                    toYear={toYear}
                    defaultMonth={birthDate || (selectedYear ? new Date(selectedYear, 0) : undefined)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birth-time">Birth Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="birth-time"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Your Age:</h3>
              <p className="text-muted-foreground">{age}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}