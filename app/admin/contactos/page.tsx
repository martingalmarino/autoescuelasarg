"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  X,
  LogOut,
  Eye,
  Edit
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  message: string
  schoolId: string
  schoolName: string
  status: 'new' | 'contacted' | 'closed'
  source: string
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export default function ContactosAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [statusFilter])

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/admin/contactos?status=${statusFilter}`)
      const data = await response.json()
      if (data.success) {
        setContacts(data.contacts)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contactos/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchContacts()
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus as any })
        }
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const updateContactNotes = async (contactId: string, newNotes: string) => {
    try {
      const response = await fetch(`/api/admin/contactos/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: newNotes }),
      })

      if (response.ok) {
        fetchContacts()
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, notes: newNotes })
        }
      }
    } catch (error) {
      console.error('Error updating contact notes:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500">Nuevo</Badge>
      case 'contacted':
        return <Badge variant="default" className="bg-yellow-500">Contactado</Badge>
      case 'closed':
        return <Badge variant="default" className="bg-green-500">Cerrado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center p-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <div className="text-blue-600">Cargando contactos...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Contactos
              </h1>
              <p className="text-gray-600">
                Administra las consultas recibidas desde el sitio web
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contactos ({contacts.length})</CardTitle>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="new">Nuevos</SelectItem>
                      <SelectItem value="contacted">Contactados</SelectItem>
                      <SelectItem value="closed">Cerrados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay contactos para mostrar
                    </div>
                  ) : (
                    contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedContact?.id === contact.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedContact(contact)
                          setNotes(contact.notes || '')
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{contact.name}</h3>
                              {getStatusBadge(contact.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <Phone className="h-3 w-3 inline mr-1" />
                              {contact.phone}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              <MessageSquare className="h-3 w-3 inline mr-1" />
                              {contact.schoolName}
                            </p>
                            <p className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDate(contact.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedContact(contact)
                                setNotes(contact.notes || '')
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-sm text-gray-900">{selectedContact.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="text-sm text-gray-900">{selectedContact.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Autoescuela</label>
                    <p className="text-sm text-gray-900">{selectedContact.schoolName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Mensaje</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {selectedContact.message}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <div className="mt-1">
                      <Select
                        value={selectedContact.status}
                        onValueChange={(value) => updateContactStatus(selectedContact.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nuevo</SelectItem>
                          <SelectItem value="contacted">Contactado</SelectItem>
                          <SelectItem value="closed">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Notas</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Agregar notas sobre este contacto..."
                      rows={3}
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => updateContactNotes(selectedContact.id, notes)}
                    >
                      Guardar Notas
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Recibido: {formatDate(selectedContact.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-gray-500">
                  Selecciona un contacto para ver los detalles
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
