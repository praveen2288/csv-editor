"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import * as diff from 'diff'
import Link from 'next/link'

export default function DiffApp() {
  const [leftText, setLeftText] = useState('')
  const [rightText, setRightText] = useState('')
  const [diffResult, setDiffResult] = useState<diff.Change[]>([])

  useEffect(() => {
    const result = diff.diffLines(leftText, rightText)
    setDiffResult(result)
  }, [leftText, rightText])

  const pushDiffLeft = (index: number) => {
    const newRightText = diffResult.map((part, i) => {
      if (i === index && part.added) {
        return part.value // Take added part from the right side
      }
      return !part.removed ? part.value : ''
    }).join('')
    
    setLeftText(newRightText)
  }

  const pushDiffRight = (index: number) => {
    const newLeftText = diffResult.map((part, i) => {
      if (i === index && part.removed) {
        return part.value // Take removed part from the left side
      }
      return !part.added ? part.value : ''
    }).join('')
    
    setRightText(newLeftText)
  }

  const renderDiff = (side: 'left' | 'right') => {
    let lineNumber = 1
    return diffResult.map((part, partIndex) => {
      const lines = part.value.split('\n')
      return lines.map((line, lineIndex) => {
        if (lineIndex === lines.length - 1 && line === '') return null
        const backgroundColor = part.added ? 'bg-green-100' : part.removed ? 'bg-red-100' : ''
        const shouldRender = (side === 'left' && !part.added) || (side === 'right' && !part.removed)
        if (shouldRender) {
          return (
            <div key={`${partIndex}-${lineIndex}`} className={`flex items-center ${backgroundColor}`}>
              <span className="w-8 text-right pr-2 text-gray-500">{lineNumber++}</span>
              <span className="flex-grow">{line}</span>
              {(part.added || part.removed) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  onClick={() => side === 'left' ? pushDiffRight(partIndex) : pushDiffLeft(partIndex)}
                  aria-label={`Push ${side === 'left' ? 'Right' : 'Left'}`}
                >
                  Push {side === 'left' ? 'Right' : 'Left'}
                </Button>
              )}
            </div>
          )
        }
        return null
      }).filter(Boolean)
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="fixed top-4 left-4 text-blue-600 hover:underline"
      >
        Back to Home
      </Link>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Textarea
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Paste left content here"
            className="mb-2 font-mono"
            rows={5}
          />
          <ScrollArea className="h-[400px] border rounded">
            <div className="p-4 font-mono whitespace-pre">
              {renderDiff('left')}
            </div>
          </ScrollArea>
        </div>
        <div>
          <Textarea
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Paste right content here"
            className="mb-2 font-mono"
            rows={5}
          />
          <ScrollArea className="h-[400px] border rounded">
            <div className="p-4 font-mono whitespace-pre">
              {renderDiff('right')}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
