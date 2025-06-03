'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function parseMarkdown(md: string): string {
  let html = md
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
  html = html.replace(/^(\s*[-*]\s+.*(?:\n\s*[-*]\s+.*)*)/gm, (match) => {
    const items = match.split(/\n/).map(i => i.replace(/^\s*[-*]\s+/, '')).map(i => `<li>${i}</li>`).join('')
    return `<ul>${items}</ul>`
  })
  html = html.replace(/^(\s*\d+\.\s+.*(?:\n\s*\d+\.\s+.*)*)/gm, (match) => {
    const items = match.split(/\n/).map(i => i.replace(/^\s*\d+\.\s+/, '')).map(i => `<li>${i}</li>`).join('')
    return `<ol>${items}</ol>`
  })
  html = html.replace(/\n{2,}/g, '</p><p>')
  html = html.replace(/\n/g, '<br/>')
  return '<p>' + html + '</p>'
}

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState('')

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="fixed top-4 left-4 text-blue-600 hover:underline">
        Back to Home
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Markdown Previewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter Markdown here"
              rows={20}
              className="font-mono"
            />
            <div
              className="prose max-w-none overflow-auto p-4 border rounded"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
