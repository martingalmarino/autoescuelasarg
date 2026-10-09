"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ClipboardCopy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsRow {
  schoolId: string
  name: string
  slug: string
  city: string
  isPremium: boolean
  isClaimed: boolean
  ownerName: string | null
  ownerEmail: string | null
  view: number
  whatsapp: number
  phone: number
  website: number
  email: number
  directions: number
  inquiries: number
}

const columns: { key: keyof MetricsRow; label: string; reportLabel: string }[] = [
  { key: 'view', label: 'Vistas', reportLabel: 'Visitas a la ficha' },
  { key: 'whatsapp', label: 'WhatsApp', reportLabel: 'Clics en WhatsApp' },
  { key: 'phone', label: 'Teléfono', reportLabel: 'Clics en teléfono' },
  { key: 'website', label: 'Web', reportLabel: 'Clics en el sitio web' },
  { key: 'email', label: 'Email', reportLabel: 'Clics en email' },
  { key: 'directions', label: 'Cómo llegar', reportLabel: 'Clics en "Cómo llegar"' },
  { key: 'inquiries', label: 'Consultas', reportLabel: 'Consultas por formulario' },
]

const timeZone = 'America/Argentina/Buenos_Aires'

function lastMonths(count: number) {
  const [year, month] = new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date()).split('-').map(Number)
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 - index, 1))
    const label = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    return { value: date.toISOString().slice(0, 7), label: label.charAt(0).toUpperCase() + label.slice(1) }
  })
}

export default function MetricsAdminPage() {
  const months = useMemo(() => lastMonths(12), [])
  const [month, setMonth] = useState(months[0].value)
  const [rows, setRows] = useState<MetricsRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [onlyPremium, setOnlyPremium] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/admin/metricas?month=${month}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) setRows(data.rows)
        else setError(data.error || 'No se pudieron cargar las métricas')
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setLoading(false))
  }, [month])

  const visible = onlyPremium ? rows.filter(row => row.isPremium) : rows
  const monthLabel = months.find(item => item.value === month)?.label ?? month
  const totals = columns.reduce<Record<string, number>>((acc, column) => {
    acc[column.key] = visible.reduce((sum, row) => sum + (row[column.key] as number), 0)
    return acc
  }, {})

  const copyReport = async (row: MetricsRow) => {
    const lines = [
      `Reporte de ${monthLabel}: ${row.name} en Autoescuelas.ar`,
      '',
      ...columns.map(column => `• ${column.reportLabel}: ${row[column.key]}`),
      '',
      `Tu ficha: https://www.autoescuelas.ar/autoescuelas/${row.slug}`,
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopiedId(row.schoolId)
    setTimeout(() => setCopiedId(current => (current === row.schoolId ? null : current)), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin" className="mb-3 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Panel de administración
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Métricas por ficha</h1>
          <p className="text-gray-600">
            Vistas y clics registrados en cada ficha y consultas recibidas por formulario. Las vistas se cuentan una vez por
            visitante y sesión.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{monthLabel}</CardTitle>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyPremium} onChange={event => setOnlyPremium(event.target.checked)} />
                  Solo premium
                </label>
                <select
                  value={month}
                  onChange={event => setMonth(event.target.value)}
                  className="rounded-md border border-gray-300 p-2 text-sm"
                  aria-label="Mes"
                >
                  {months.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-blue-600">Cargando métricas...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-600">{error}</div>
            ) : visible.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No hay actividad registrada en este mes</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-600">
                      <th className="py-2 pr-3 font-medium">Autoescuela</th>
                      {columns.map(column => (
                        <th key={column.key} className="px-2 py-2 text-right font-medium">
                          {column.label}
                        </th>
                      ))}
                      <th className="py-2 pl-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(row => (
                      <tr key={row.schoolId} className="border-b last:border-0">
                        <td className="py-2 pr-3">
                          <Link href={`/autoescuelas/${row.slug}`} target="_blank" className="font-medium text-blue-600 hover:underline">
                            {row.name}
                          </Link>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-500">
                            {row.city}
                            {row.isPremium && <Badge className="bg-yellow-500 px-1.5 py-0 text-[10px]">Premium</Badge>}
                            {row.isClaimed && <Badge variant="outline" className="px-1.5 py-0 text-[10px]">Reclamada</Badge>}
                          </div>
                        </td>
                        {columns.map(column => (
                          <td key={column.key} className="px-2 py-2 text-right tabular-nums">
                            {row[column.key] as number}
                          </td>
                        ))}
                        <td className="py-2 pl-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => copyReport(row)} title={row.ownerEmail ?? undefined}>
                            {copiedId === row.schoolId ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                            <span className="ml-1">{copiedId === row.schoolId ? 'Copiado' : 'Reporte'}</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold">
                      <td className="py-2 pr-3">Total</td>
                      {columns.map(column => (
                        <td key={column.key} className="px-2 py-2 text-right tabular-nums">
                          {totals[column.key]}
                        </td>
                      ))}
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
