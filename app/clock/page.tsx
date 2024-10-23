"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

const ScrollableInput = ({ value, onChange, max }) => {
  return (
    <div className="flex flex-col items-center">
      <button className="text-2xl" onClick={() => onChange((value + 1) % (max + 1))}>▲</button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) % (max + 1))}
        className="w-16 text-center text-2xl border rounded"
      />
      <button className="text-2xl" onClick={() => onChange((value - 1 + max + 1) % (max + 1))}>▼</button>
    </div>
  )
}

export default function ClockTimerStopwatchWorldClock() {
  // Timer state
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Stopwatch state
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [laps, setLaps] = useState([])
  const stopwatchRef = useRef(null)
  const startTimeRef = useRef(0)

  // World Clock state
  const [cities, setCities] = useState([
    { name: 'New York', timeZone: 'America/New_York' },
    { name: 'London', timeZone: 'Europe/London' },
    { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
  ])
  const [newCity, setNewCity] = useState('')
  const [newTimeZone, setNewTimeZone] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    let interval

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false)
      if (Notification.permission === "granted") {
        new Notification("Timer Ended!", { body: "Your timer has finished." })
      }
    }

    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  useEffect(() => {
    let animationFrame

    const updateStopwatch = () => {
      if (isStopwatchRunning) {
        const now = performance.now()
        setStopwatchTime(prevTime => prevTime + (now - startTimeRef.current))
        startTimeRef.current = now
        animationFrame = requestAnimationFrame(updateStopwatch)
      }
    }

    if (isStopwatchRunning) {
      startTimeRef.current = performance.now()
      animationFrame = requestAnimationFrame(updateStopwatch)
    }

    return () => cancelAnimationFrame(animationFrame)
  }, [isStopwatchRunning])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds)
      setIsTimerRunning(true)
      Notification.requestPermission()
    }
  }

  const formatTime = (time) => {
    const h = Math.floor(time / 3600)
    const m = Math.floor((time % 3600) / 60)
    const s = time % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatStopwatchTime = (time) => {
    const ms = Math.floor(time % 1000)
    const s = Math.floor((time / 1000) % 60)
    const m = Math.floor((time / (1000 * 60)) % 60)
    const h = Math.floor(time / (1000 * 60 * 60))
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
  }

  const toggleStopwatch = () => {
    setIsStopwatchRunning(!isStopwatchRunning)
  }

  const resetStopwatch = () => {
    setIsStopwatchRunning(false)
    setStopwatchTime(0)
    setLaps([])
  }

  const recordLap = () => {
    setLaps([...laps, stopwatchTime])
  }

  const addCity = () => {
    if (newCity && newTimeZone) {
      setCities([...cities, { name: newCity, timeZone: newTimeZone }])
      setNewCity('')
      setNewTimeZone('')
    }
  }

  const removeCity = (index) => {
    setCities(cities.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Timer, Stopwatch & World Clock</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timer">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
            <TabsTrigger value="worldclock">World Clock</TabsTrigger>
          </TabsList>
          <TabsContent value="timer">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="text-center">
                <p>Hours</p>
                <ScrollableInput value={hours} onChange={setHours} max={23} />
              </div>
              <div className="text-center">
                <p>Minutes</p>
                <ScrollableInput value={minutes} onChange={setMinutes} max={59} />
              </div>
              <div className="text-center">
                <p>Seconds</p>
                <ScrollableInput value={seconds} onChange={setSeconds} max={59} />
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{formatTime(timeLeft)}</p>
            </div>
            <Button 
              onClick={startTimer} 
              disabled={isTimerRunning} 
              className="w-full"
            >
              {isTimerRunning ? 'Timer Running' : 'Start Timer'}
            </Button>
          </TabsContent>
          <TabsContent value="stopwatch">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{formatStopwatchTime(stopwatchTime)}</p>
            </div>
            <div className="flex justify-center space-x-2 mb-4">
              <Button onClick={toggleStopwatch}>
                {isStopwatchRunning ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={resetStopwatch}>Reset</Button>
              <Button onClick={recordLap} disabled={!isStopwatchRunning}>Lap</Button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {laps.map((lap, index) => (
                <div key={index} className="text-center">
                  Lap {index + 1}: {formatStopwatchTime(lap)}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="worldclock">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="City Name"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Time Zone (e.g., America/New_York)"
                value={newTimeZone}
                onChange={(e) => setNewTimeZone(e.target.value)}
                className="mb-2"
              />
              <Button onClick={addCity} className="w-full">Add City</Button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {cities.map((city, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{city.name}: </span>
                  <span>
                    {new Intl.DateTimeFormat('en-US', {
                      timeZone: city.timeZone,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    }).format(currentTime)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeCity(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}