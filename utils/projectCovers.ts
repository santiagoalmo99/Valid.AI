// utils/projectCovers.ts
// Predefined project covers by category - NO API CALLS

/**
 * Returns a predefined cover image URL based on project idea/category
 * Eliminates the need for AI-generated covers
 */

export function getCoverByIdea(idea: string, category?: string): string {
  const lower = idea.toLowerCase();
  
  // Map keywords to cover categories
  if (category) {
    return COVER_MAP[category] || COVER_MAP.default;
  }
  
  // Tech/SaaS
  if (lower.match(/\b(saas|software|app|tech|platform|api|web|mobile)\b/)) {
    return COVER_MAP['tech'];
  }
  
  // Food & Beverage
  if (lower.match(/\b(comida|restaurant|delivery|food|cocina|chef|bebida|café)\b/)) {
    return COVER_MAP['food'];
  }
  
  // Healthcare
  if (lower.match(/\b(salud|health|médico|doctor|fitness|wellness|bienestar)\b/)) {
    return COVER_MAP['health'];
  }
  
  // Fintech
  if (lower.match(/\b(fintech|banco|pago|cripto|inversión|finanzas|wallet)\b/)) {
    return COVER_MAP['fintech'];
  }
  
  // Education
  if (lower.match(/\b(educación|curso|learn|enseñ|formación|escuela)\b/)) {
    return COVER_MAP['education'];
  }
  
  // Ecommerce
  if (lower.match(/\b(ecommerce|tienda|venta|marketplace|comercio|shop)\b/)) {
    return COVER_MAP['ecommerce'];
  }
  
  // Hardware/IoT
  if (lower.match(/\b(hardware|iot|dispositivo|sensor|robot|electrónica)\b/)) {
    return COVER_MAP['iot'];
  }
  
  // Logistics
  if (lower.match(/\b(logística|transporte|envío|courier|mensajería)\b/)) {
    return COVER_MAP['logistics'];
  }
  
  // Real Estate
  if (lower.match(/\b(inmobiliaria|propiedad|alquiler|renta|casa|apartamento)\b/)) {
    return COVER_MAP['realestate'];
  }
  
  // Marketing
  if (lower.match(/\b(marketing|publicidad|social media|contenido|ads)\b/)) {
    return COVER_MAP['marketing'];
  }
  
  // B2B
  if (lower.match(/\b(b2b|empresa|corporativo|pyme|negocio)\b/)) {
    return COVER_MAP['b2b'];
  }
  
  // Consumer Apps
  if (lower.match(/\b(consumidor|usuario|persona|familia|joven)\b/)) {
    return COVER_MAP['consumer'];
  }
  
  return COVER_MAP.default;
}

const COVER_MAP: Record<string, string> = {
  'tech': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230f172a"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%231e40af"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'food': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23991b1b"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23f59e0b"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'health': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23065f46"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2310b981"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'fintech': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23581c87"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23a855f7"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'education': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231e3a8a"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2360a5fa"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'ecommerce': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23be123c"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23fb7185"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'iot': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23134e4a"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2314b8a6"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'logistics': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23713f12"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23fbbf24"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'realestate': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23450a0a"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23dc2626"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'marketing': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23701a75"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%23e879f9"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'b2b': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231e293b"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2364748b"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'consumer': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230c4a6e"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2306b6d4"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E',
  'default': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230f172a"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%2300FF94"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23a)"%3E%3C/rect%3E%3C/svg%3E'
};

// Export for TypeScript
export default getCoverByIdea;
