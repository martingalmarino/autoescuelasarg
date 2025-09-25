"use client"

import { useMemo } from 'react'

interface SafeHTMLProps {
  content: string
  className?: string
}

export default function SafeHTML({ content, className = "" }: SafeHTMLProps) {
  const sanitizedHTML = useMemo(() => {
    if (!content) return ''
    
    // Lista de tags permitidos
    const allowedTags = [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 
      'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ]
    
    // Crear un parser simple para limpiar el HTML
    let cleanHTML = content
    
    // Remover scripts y otros elementos peligrosos
    cleanHTML = cleanHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    cleanHTML = cleanHTML.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    cleanHTML = cleanHTML.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    cleanHTML = cleanHTML.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    
    // Remover atributos peligrosos
    cleanHTML = cleanHTML.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    cleanHTML = cleanHTML.replace(/\s*javascript\s*:/gi, '')
    
    return cleanHTML
  }, [content])

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}

