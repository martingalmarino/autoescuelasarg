"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Check, Crown, ExternalLink, Mail, MessageCircle, Phone, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { whatsappUrl } from '@/lib/premium'

type ClaimStatus = 'pending' | 'approved' | 'rejected'

interface Claim {
  id: string
  schoolId: string | null
  schoolName: string
  city: string | null
  name: string
  role: string
  email: string
  phone: string
  message: string | null
  interest: 'claim' | 'premium'
  status: ClaimStatus
  notes: string | null
  createdAt: string
  school: {
    id: string
    name: string
    slug: string
    claimedAt: string | null
    ownerEmail: string | null
    city: { name: string }
  } | null
}

interface SchoolOption {
  id: string
  label: string
}

const statusBadges: Record<ClaimStatus, JSX.Element> = {
  pending: <Badge className="bg-blue-500">Pendiente</Badge>,
  approved: <Badge className="bg-green-600">Aprobado</Badge>,
  rejected: <Badge variant="secondary">Rechazado</Badge>,
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function ClaimsAdminPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [schools, setSchools] = useState<SchoolOption[] | null>(null)
  const [schoolQuery, setSchoolQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = claims.find(claim => claim.id === selectedId) ?? null

  const fetchClaims = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/reclamos?status=${statusFilter}`)
      const data = await response.json()
      if (data.success) setClaims(data.claims)
    } catch (err) {
      console.error('Error obteniendo reclamos:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  useEffect(() => {
    if (!selected || selected.schoolId || schools) return
    fetch('/api/admin/autoescuelas')
      .then(response => response.json())
      .then(data => {
        if (!data.success) return
        setSchools(
          data.schools.map((school: { id: string; name: string; city: string; province: string }) => ({
            id: school.id,
            label: `${school.name} — ${school.city}, ${school.province}`,
          }))
        )
      })
      .catch(err => console.error('Error obteniendo autoescuelas:', err))
  }, [selected, schools])

  const matchedSchool = useMemo(
    () => schools?.find(school => school.label === schoolQuery) ?? null,
    [schools, schoolQuery]
  )

  const select = (claim: Claim) => {
    setSelectedId(claim.id)
    setNotes(claim.notes || '')
    setSchoolQuery('')
    setError(null)
  }

  const update = async (payload: { status?: ClaimStatus; notes?: string; schoolId?: string }) => {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/reclamos/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!data.success) {
        setError(data.error || 'No se pudo actualizar el reclamo')
        return
      }
      await fetchClaims()
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const approve = () => {
    if (!selected) return
    const schoolId = selected.schoolId ?? matchedSchool?.id
    if (!schoolId) {
      setError('Elegí a qué autoescuela corresponde antes de aprobar')
      return
    }
    const label = selected.school?.name ?? matchedSchool?.label
    if (!confirm(`¿Aprobar el reclamo y asignar a ${selected.name} como responsable de ${label}?`)) return
    update({ status: 'approved', schoolId, notes })
  }

  const ownerWhatsapp = selected
    ? whatsappUrl(
        selected.phone,
        `Hola ${selected.name}, te escribo de Autoescuelas.ar por la ficha de ${selected.school?.name ?? selected.schoolName}.`
      )
    : null

  const alreadyClaimedByOther =
    selected?.school?.claimedAt && selected.school.ownerEmail && selected.school.ownerEmail !== selected.email

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin" className="mb-3 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Panel de administración
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reclamos de fichas</h1>
          <p className="text-gray-600">
            Solicitudes de dueños que quieren reclamar su ficha o pasarse a Premium. Al aprobar, la ficha queda verificada
            y con el responsable asignado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>Reclamos ({claims.length})</CardTitle>
                  <Select value={statusFilter} onValueChange={value => { setStatusFilter(value); setSelectedId(null) }}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobados</SelectItem>
                      <SelectItem value="rejected">Rechazados</SelectItem>
                      <SelectItem value="all">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-blue-600">Cargando reclamos...</div>
                ) : claims.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">No hay reclamos para mostrar</div>
                ) : (
                  <div className="space-y-3">
                    {claims.map(claim => (
                      <button
                        key={claim.id}
                        type="button"
                        onClick={() => select(claim)}
                        className={`w-full rounded-lg border p-4 text-left transition-colors ${
                          selectedId === claim.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{claim.school?.name ?? claim.schoolName}</span>
                          {statusBadges[claim.status]}
                          {claim.interest === 'premium' && (
                            <Badge className="bg-yellow-500">
                              <Crown className="mr-1 h-3 w-3" />
                              Interés Premium
                            </Badge>
                          )}
                          {!claim.schoolId && <Badge variant="outline">Sin ficha asignada</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">
                          {claim.name} · {claim.role} · {claim.school?.city.name ?? claim.city ?? 'Ciudad sin indicar'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{formatDate(claim.createdAt)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {selected ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalle del reclamo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Autoescuela</p>
                    {selected.school ? (
                      <Link
                        href={`/autoescuelas/${selected.school.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        {selected.school.name}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <p className="text-gray-900">
                        {selected.schoolName}
                        {selected.city && ` (${selected.city})`}
                      </p>
                    )}
                  </div>

                  {alreadyClaimedByOther && (
                    <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Esta ficha ya tiene otro responsable ({selected.school?.ownerEmail}). Si aprobás, se reemplaza.</span>
                    </div>
                  )}

                  {!selected.schoolId && selected.status !== 'approved' && (
                    <div className="space-y-1">
                      <label htmlFor="claim-school-picker" className="font-medium text-gray-700">
                        Asignar a una ficha
                      </label>
                      <Input
                        id="claim-school-picker"
                        list="claim-school-options"
                        value={schoolQuery}
                        onChange={event => setSchoolQuery(event.target.value)}
                        placeholder={schools ? 'Buscá por nombre…' : 'Cargando autoescuelas…'}
                      />
                      <datalist id="claim-school-options">
                        {schools?.map(school => <option key={school.id} value={school.label} />)}
                      </datalist>
                      <p className="text-xs text-gray-500">
                        {matchedSchool
                          ? `Se asignará a ${matchedSchool.label}`
                          : 'Si la autoescuela no existe, creala primero en Gestionar autoescuelas.'}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-700">Responsable</p>
                    <p className="text-gray-900">
                      {selected.name} · {selected.role}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Phone className="h-4 w-4" />
                      {selected.phone}
                    </a>
                    {ownerWhatsapp && (
                      <a
                        href={ownerWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-700 hover:underline"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Escribir por WhatsApp
                      </a>
                    )}
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Mail className="h-4 w-4" />
                      {selected.email}
                    </a>
                  </div>

                  {selected.message && (
                    <div>
                      <p className="font-medium text-gray-700">Comentarios</p>
                      <p className="whitespace-pre-line rounded bg-gray-50 p-3 text-gray-900">{selected.message}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="claim-notes" className="font-medium text-gray-700">
                      Notas internas
                    </label>
                    <Textarea
                      id="claim-notes"
                      value={notes}
                      onChange={event => setNotes(event.target.value)}
                      rows={3}
                      placeholder="Cómo se verificó, acuerdo de precio, etc."
                    />
                    <Button size="sm" variant="outline" className="mt-2" disabled={saving} onClick={() => update({ notes })}>
                      Guardar notas
                    </Button>
                  </div>

                  {error && <p className="rounded-md bg-red-50 p-2 text-red-700">{error}</p>}

                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    {selected.status !== 'approved' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={saving} onClick={approve}>
                        <Check className="mr-1 h-4 w-4" />
                        Aprobar
                      </Button>
                    )}
                    {selected.status !== 'rejected' && (
                      <Button size="sm" variant="outline" disabled={saving} onClick={() => update({ status: 'rejected', notes })}>
                        <X className="mr-1 h-4 w-4" />
                        Rechazar
                      </Button>
                    )}
                    {selected.status !== 'pending' && (
                      <Button size="sm" variant="ghost" disabled={saving} onClick={() => update({ status: 'pending' })}>
                        Volver a pendiente
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Recibido: {formatDate(selected.createdAt)}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">Elegí un reclamo para ver el detalle</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
