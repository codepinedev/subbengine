'use client'

import dayjs from 'dayjs'

import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

import type { Leaderboard } from '@/lib/types'
import type { ColumnDef } from '@tanstack/react-table'

export const columns: Array<ColumnDef<Leaderboard>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'game',
    header: 'Game Title',
  },
  {
    accessorKey: 'createdAt',
    header: 'Creation Date',
    cell: ({ row }) => {
      return dayjs(row.getValue('createdAt')).format('MM/DD/YYYY')
    },
  },
  {
    accessorKey: 'action',
    header: '',
    cell: () => {
      return (
        <Button variant="ghost" size={'icon'}>
          <ArrowRight />
        </Button>
      )
    },
  },
]
