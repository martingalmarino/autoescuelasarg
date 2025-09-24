"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  schoolName: string
  schoolId: string
}

export default function ContactForm({ schoolName, schoolId }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: `Hola ${schoolName}! Quisiera saber más sobre los cursos de manejo disponibles!`
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          schoolId,
          schoolName,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          phone: '',
          message: `Hola ${schoolName}! Quisiera saber más sobre los cursos de manejo disponibles!`
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error sending contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Solicitar Información
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Completa el formulario y nos pondremos en contacto contigo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+54 9 11 1234-5678"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              placeholder="Tu mensaje aquí..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">
                ¡Mensaje enviado correctamente! Te contactaremos pronto.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">
                Error al enviar el mensaje. Inténtalo nuevamente.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Consulta
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
