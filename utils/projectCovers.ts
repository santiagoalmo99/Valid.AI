// utils/projectCovers.ts
// Predefined project covers Cache System v2.0
// Uses high-quality curated Unsplash images to eliminate API latency

const COVER_CACHE: Record<string, string[]> = {
  'tech': [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'
  ],
  'food': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1000&auto=format&fit=crop'
  ],
  'health': [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1000&auto=format&fit=crop'
  ],
  'fintech': [
    'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565514020176-db783387d773?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000&auto=format&fit=crop'
  ],
  'education': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop'
  ],
  'realestate': [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000&auto=format&fit=crop'
  ],
  'marketing': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1000&auto=format&fit=crop'
  ],
  'default': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop'
  ]
};

/**
 * Returns a predefined cover image URL based on project idea/category
 * Eliminates the need for API calls/Pollinations
 */
export function getCoverByIdea(idea: string, category?: string): string {
  const lower = idea.toLowerCase();
  let selectedCategory = 'default';

  // 1. Explicit Category
  if (category && COVER_CACHE[category]) {
    selectedCategory = category;
  }
  // 2. Keyword Detection
  else if (lower.match(/\b(saas|software|app|tech|platform|api|web|mobile|ai|inteligencia)\b/)) selectedCategory = 'tech';
  else if (lower.match(/\b(comida|restaurant|delivery|food|cocina|chef|bebida|café|restaurante)\b/)) selectedCategory = 'food';
  else if (lower.match(/\b(salud|health|médico|doctor|fitness|wellness|bienestar|hospital|clinica)\b/)) selectedCategory = 'health';
  else if (lower.match(/\b(fintech|banco|pago|cripto|inversión|finanzas|wallet|dinero|ahorro)\b/)) selectedCategory = 'fintech';
  else if (lower.match(/\b(educación|curso|learn|enseñ|formación|escuela|universidad|tutor)\b/)) selectedCategory = 'education';
  else if (lower.match(/\b(ecommerce|tienda|venta|marketplace|comercio|shop|retail|moda)\b/)) selectedCategory = 'ecommerce';
  else if (lower.match(/\b(inmobiliaria|propiedad|alquiler|renta|casa|apartamento|construcción)\b/)) selectedCategory = 'realestate';
  else if (lower.match(/\b(marketing|publicidad|social media|contenido|ads|marca|brand)\b/)) selectedCategory = 'marketing';

  // 3. Get Random Image from Category
  const images = COVER_CACHE[selectedCategory] || COVER_CACHE['default'];
  
  // Deterministic random based on idea string length to keep stable if possible, 
  // or just pure random for variety. Let's use simple random for now as users might want variety.
  return images[Math.floor(Math.random() * images.length)];
}

export default getCoverByIdea;
