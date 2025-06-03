'use client'

import { useState, useMemo } from 'react'
import Papa from 'papaparse'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, ArrowUp, ArrowDown, ArrowUpDown, Search } from 'lucide-react'
import Link from 'next/link'

type SortConfig = {
  key: number;
  direction: 'ascending' | 'descending';
} | null;

export default function CSVEditor() {
  const [data, setData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleFileImport = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'CSV Files',
            accept: {
              'text/csv': ['.csv'],
            },
          },
        ],
      })
      const file = await fileHandle.getFile()
      const content = await file.text()
      
      Papa.parse(content, {
        complete: (result) => {
          setHeaders(result.data[0] as string[])
          setData(result.data.slice(1) as string[][])
        },
      })
    } catch (error) {
      console.error('Error importing file:', error)
    }
  }

  const handleExport = async () => {
    const csvContent = Papa.unparse([headers, ...data])
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    try {
      const fileHandle = await window.showSaveFilePicker({
        types: [
          {
            description: 'CSV Files',
            accept: {
              'text/csv': ['.csv'],
            },
          },
        ],
      })
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
    } catch (error) {
      console.error('Error exporting file:', error)
    }
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data]
    newData[rowIndex][colIndex] = value
    setData(newData)
  }

  const handleAddRow = (index: number) => {
    const newRow = new Array(headers.length).fill('')
    const newData = [...data]
    newData.splice(index + 1, 0, newRow)
    setData(newData)
  }

  const handleDeleteRow = (rowIndex: number) => {
    const newData = data.filter((_, index) => index !== rowIndex)
    setData(newData)
  }

  const handleMoveRow = (fromIndex: number, toIndex: number) => {
    const newData = [...data]
    const [movedRow] = newData.splice(fromIndex, 1)
    newData.splice(toIndex, 0, movedRow)
    setData(newData)
  }

  const handleSort = (columnIndex: number) => {
    setSortConfig(
      sortConfig && sortConfig.key === columnIndex
        ? { key: columnIndex, direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' }
        : { key: columnIndex, direction: 'ascending' }
    )
  }

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(row =>
        row.some(cell =>
          cell.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [data, sortConfig, searchQuery])

  return (
    <div className="max-w-[90%] mx-auto p-4 bg-background">
      <h1 className="text-2xl font-bold mb-4">CSV Editor</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <Button onClick={handleFileImport}>Import CSV</Button>
        <Button onClick={handleExport} disabled={data.length === 0}>Export CSV</Button>
        <Button onClick={() => handleAddRow(-1)} disabled={headers.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Add Row
        </Button>
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      {headers.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] px-3 py-2 text-left bg-muted">Actions</TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index} className="px-3 py-2 text-left whitespace-nowrap bg-muted">
                    <div className="flex items-center space-x-2">
                      <span>{header}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleSort(index)}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/50">
                  <TableCell className="p-2">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveRow(rowIndex, Math.max(0, rowIndex - 1))}
                        disabled={rowIndex === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveRow(rowIndex, Math.min(sortedAndFilteredData.length - 1, rowIndex + 1))}
                        disabled={rowIndex === sortedAndFilteredData.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddRow(rowIndex)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRow(rowIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="p-0">
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                        className="border-0 focus:ring-0 bg-transparent"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="text-center mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}