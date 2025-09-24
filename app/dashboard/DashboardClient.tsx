'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  School, 
  MessageSquare, 
  Settings, 
  LogOut,
  Plus,
  Star,
  MapPin
} from 'lucide-react'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface DashboardClientProps {
  user: User
}

interface School {
  id: string
  name: string
  slug: string
  city: string
  province: string
  rating: number
  reviewsCount: number
  isActive: boolean
  isVerified: boolean
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserSchools = async () => {
      try {
        const response = await fetch('/api/user/schools')
        if (response.ok) {
          const data = await response.json()
          setSchools(data.schools || [])
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUserSchools()
    }
  }, [session])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user.name || user.email}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <School className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Autoescuelas</p>
                  <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Promedio Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schools.length > 0 
                      ? (schools.reduce((acc, school) => acc + school.rating, 0) / schools.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reseñas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schools.reduce((acc, school) => acc + school.reviewsCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => router.push('/sumar-autoescuela')}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Autoescuela
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Autoescuelas</CardTitle>
          </CardHeader>
          <CardContent>
            {schools.length === 0 ? (
              <div className="text-center py-8">
                <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes autoescuelas registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza agregando tu primera autoescuela al directorio.
                </p>
                <Button onClick={() => router.push('/sumar-autoescuela')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Autoescuela
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {schools.map((school) => (
                  <div key={school.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {school.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {school.isVerified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verificada
                              </span>
                            )}
                            {!school.isActive && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pendiente
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {school.city}, {school.province}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {school.rating.toFixed(1)} ({school.reviewsCount} reseñas)
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/autoescuelas/${school.slug}`)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/schools/${school.id}/edit`)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
