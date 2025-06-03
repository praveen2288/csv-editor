'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react'
import { parseExpression } from 'cron-parser'
import Link from 'next/link'


// Note: In a real-world scenario, you'd install cron-parser via npm.
// For this example, we're assuming it's available globally.
// declare const cronParser: any

export default function CronExplainer() {
  const [cronExpression, setCronExpression] = useState('')
  const [explanation, setExplanation] = useState('')
  const [nextExecution, setNextExecution] = useState('')
  const [error, setError] = useState('')

  const explainCron = (expression: string) => {
    const parts = expression.split(' ')
    if (parts.length !== 5) {
      return 'Invalid cron expression. It should have 5 parts.'
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
    let explanation = 'This cron job will run '

    if (minute === '*') explanation += 'every minute'
    else explanation += `at minute ${minute}`

    if (hour === '*') explanation += ' of every hour'
    else explanation += ` of hour ${hour}`

    if (dayOfMonth === '*') explanation += ' every day'
    else explanation += ` on day ${dayOfMonth} of the month`

    if (month === '*') explanation += ' every month'
    else explanation += ` in month ${month}`

    if (dayOfWeek === '*') explanation += '.'
    else explanation += ` on ${getDayName(dayOfWeek)}.`

    return explanation
  }

  const getDayName = (day: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[parseInt(day)] || day
  }

  const handleExplain = () => {
    try {
      const interval = parseExpression(cronExpression)
      const next = interval.next().toString()
      setNextExecution(next)
      setExplanation(explainCron(cronExpression))
      setError('')
    } catch (err) {
      setError('Invalid cron expression. Please check and try again.')
      setExplanation('')
      setNextExecution('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Link
          href="/"
          className="fixed top-4 left-4 text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
        <Card className="w-full max-w-2xl m-auto">
        <CardHeader>
            <CardTitle>Cron Expression Explainer</CardTitle>
            <CardDescription>Enter a cron expression to get an explanation and the next execution time.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            <div className="flex space-x-2">
                <Input
                placeholder="Enter cron expression (e.g., * * * * *)"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                />
                <Button onClick={handleExplain}>Explain</Button>
            </div>
            
            {error && (
                <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {explanation && (
                <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Explanation</AlertTitle>
                <AlertDescription>{explanation}</AlertDescription>
                </Alert>
            )}
            
            {nextExecution && (
                <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Next Execution</AlertTitle>
                <AlertDescription>{nextExecution}</AlertDescription>
                </Alert>
            )}
            </div>
        </CardContent>
        </Card>
    </div>
  )
}