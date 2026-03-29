'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  className?: string
  children: React.ReactNode
}

function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function TableHeader({ className, children, ...props }: TableProps) {
  return (
    <thead className={cn("[&_tr]:border-b", className)} {...props}>
      {children}
    </thead>
  )
}

function TableBody({ className, children, ...props }: TableProps) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {children}
    </tbody>
  )
}

function TableRow({ className, children, ...props }: TableProps) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  className?: string
  children?: React.ReactNode
}

function TableHead({ className, children, ...props }: TableCellProps) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
