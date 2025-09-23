"use client"

import { AnalyticsEvent } from './types'

export const trackEvent = (event: AnalyticsEvent) => {
  // En un entorno real, aquí enviarías el evento a tu servicio de analytics
  // Por ejemplo: Google Analytics, Mixpanel, etc.
  console.log('Analytics Event:', event)
  
  // Ejemplo para Google Analytics 4:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event.event, event.properties)
  // }
}

export const analyticsEvents = {
  selectLocation: (location: string) => trackEvent({
    event: 'select_location',
    properties: { location }
  }),
  
  clickSchoolCard: (schoolId: string, schoolName: string) => trackEvent({
    event: 'click_school_card',
    properties: { school_id: schoolId, school_name: schoolName }
  }),
  
  ctaViewAll: (section: string) => trackEvent({
    event: 'cta_view_all',
    properties: { section }
  }),
  
  faqExpand: (faqId: string, question: string) => trackEvent({
    event: 'faq_expand',
    properties: { faq_id: faqId, question }
  }),
  
  provinceLinkClick: (province: string) => trackEvent({
    event: 'province_link_click',
    properties: { province }
  }),
}
