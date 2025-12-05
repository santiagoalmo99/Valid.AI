import { ProjectTemplate, Question } from '../types';
import { getCoverByIdea } from '../utils/projectCovers';

/**
 * Multi-Niche Templates
 * Pre-configured validation questionnaires for different industries.
 */

export interface NicheTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  industry: string;
  targetAudience: string;
  questions: Omit<Question, 'id'>[];
  coverPrompt: string;
}

export const NICHE_TEMPLATES: NicheTemplate[] = [
  {
    id: 'b2b_saas',
    name: 'B2B SaaS Validation',
    emoji: '💼',
    description: 'Validación para productos SaaS empresariales',
    industry: 'B2B SaaS',
    targetAudience: 'Decision makers empresariales (CTOs, VPs)',
    coverPrompt: 'Modern corporate office with cloud computing servers, professional SaaS dashboard',
    questions: [
      { order: 1, text: '¿Cuál es el mayor dolor que enfrentas con tu stack tecnológico actual?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'frustrated business person looking at computer' },
      { order: 2, text: '¿Cuánto tiempo pierdes al mes por ineficiencias en tus herramientas actuales?', type: 'select', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'default', options: ['<5 horas', '5-10 horas', '10-20 horas', '20-40 horas', '>40 horas'], imageKeyword: 'time wasted inefficiency' },
      { order: 3, text: '¿Qué presupuesto mensual destinas actualmente a soluciones SaaS similares?', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['$0-500', '$500-2K', '$2K-5K', '$5K-10K', '>$10K'], imageKeyword: 'budget allocation software' },
      { order: 4, text: '¿Qué tan complejo es tu proceso de aprobación para nuevas herramientas?', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['Solo yo decido', 'Aprobación de 1 persona', 'Comité (<5 personas)', 'Proceso largo (>5 personas)'], imageKeyword: 'corporate approval process' },
      { order: 5, text: 'Del 1 al 10, ¿qué tan urgente es resolver este problema?', type: 'scale', dimension: 'problemIntensity', weight: 0.18, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'urgency crisis alert' },
      { order: 6, text: '¿Has intentado soluciones alternativas? Si sí, ¿por qué fallaron?', type: 'text', dimension: 'currentBehavior', weight: 0.10, required: false, widgetType: 'keyword_cloud', imageKeyword: 'failed solutions alternative tools' },
      { order: 7, text: '¿Estarías dispuesto a probar una beta privada?', type: 'boolean', dimension: 'earlyAdopter', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'beta testing early access' }
    ]
  },
  
  {
    id: 'consumer_app',
    name: 'Consumer App Validation',
    emoji: '📱',
    description: 'Validación para aplicaciones móviles de consumo',
    industry: 'Consumer Apps',
    targetAudience: 'Usuarios finales (Gen Z, Millennials)',
    coverPrompt: 'Young people using smartphones in vibrant urban setting, mobile app interface',
    questions: [
      { order: 1, text: '¿Cuál es tu mayor frustración con las apps que usas a diario?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'frustrated young person smartphone' },
      { order: 2, text: '¿Cuántas apps instalas al mes en promedio?', type: 'select', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'default', options: ['0-1', '2-3', '4-6', '7-10', '>10'], imageKeyword: 'app store browsing' },
      { order: 3, text: '¿Pagarías por una app que resuelva este problema?', type: 'boolean', dimension: 'willingnessToPay', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'paying for app subscription' },
      { order: 4, text: 'Si sí, ¿cuánto como máximo al mes?', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['Gratis solamente', '$1-3', '$4-7', '$8-15', '>$15'], imageKeyword: 'money subscription pricing' },
      { order: 5, text: 'Del 1 al 5, ¿qué tan probable es que recomiendes esta app a un amigo?', type: 'scale', dimension: 'solutionFit', weight: 0.12, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'sharing app with friends' },
      { order: 6, text: '¿Qué característica te haría abrir la app todos los días?', type: 'text', dimension: 'solutionFit', weight: 0.15, required: false, widgetType: 'keyword_cloud', imageKeyword: 'daily habit notification' },
      { order: 7, text: '¿Compartirías tus datos personales para una mejor experiencia?', type: 'boolean', dimension: 'earlyAdopter', weight: 0.10, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'privacy data sharing' },
      { order: 8, text: '¿Prefieres ads gratis o pagar sin ads?', type: 'select', dimension: 'willingnessToPay', weight: 0.05, required: true, widgetType: 'default', options: ['Gratis con ads', 'Pagar sin ads', 'Freemium (mix)'], imageKeyword: 'ads vs premium choice' }
    ]
  },
  
  {
    id: 'ecommerce',
    name: 'E-commerce Validation',
    emoji: '🛒',
    description: 'Validación para tiendas online y marketplaces',
    industry: 'E-commerce',
    targetAudience: 'Compradores online frecuentes',
    coverPrompt: 'Modern e-commerce shopping interface, online store checkout, digital commerce',
    questions: [
      { order: 1, text: '¿Qué te hace abandonar un carrito de compras?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'abandoned shopping cart' },
      { order: 2, text: '¿Con qué frecuencia compras online?', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['Nunca', 'Pocas veces al año', 'Mensualmente', 'Semanalmente', 'Diariamente'], imageKeyword: 'online shopping frequency' },
      { order: 3, text: '¿Cuál es tu gasto promedio por compra online?', type: 'select', dimension: 'willingnessToPay', weight: 0.18, required: true, widgetType: 'currency_bucket', options: ['<$20', '$20-50', '$51-100', '$101-300', '>$300'], imageKeyword: 'spending money online' },
      { order: 4, text: 'Del 1 al 10, ¿qué tan importante es el envío gratis para ti?', type: 'scale', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'free shipping delivery' },
      { order: 5, text: '¿Comparas precios antes de comprar?', type: 'boolean', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'price comparison shopping' },
      { order: 6, text: '¿Qué feature te haría comprar más seguido en una tienda?', type: 'text', dimension: 'solutionFit', weight: 0.15, required: false, widgetType: 'keyword_cloud', imageKeyword: 'loyalty program rewards' },
      { order: 7, text: '¿Confías en reseñas de otros usuarios?', type: 'scale', dimension: 'earlyAdopter', weight: 0.10, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'customer reviews ratings' },
      { order: 8, text: '¿Qué método de pago prefieres?', type: 'select', dimension: 'currentBehavior', weight: 0.05, required: true, widgetType: 'default', options: ['Tarjeta de crédito', 'PayPal', 'Transferencia', 'Crypto', 'Contra entrega'], imageKeyword: 'payment methods checkout' }
    ]
  },

  {
    id: 'healthcare',
    name: 'Healthcare Validation',
    emoji: '🏥',
    description: 'Validación para productos de salud y bienestar',
    industry: 'Healthcare / Wellness',
    targetAudience: 'Pacientes y profesionales de la salud',
    coverPrompt: 'Modern medical technology, health monitoring devices, telemedicine consultation',
    questions: [
      { order: 1, text: '¿Cuál es tu mayor frustración con el sistema de salud actual?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'healthcare frustration waiting room' },
      { order: 2, text: '¿Con qué frecuencia visitas a un profesional de la salud?', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['Nunca', '1 vez al año', 'Cada 6 meses', 'Mensualmente', 'Semanalmente'], imageKeyword: 'doctor visit medical appointment' },
      { order: 3, text: '¿Usarías telemedicina para consultas no urgentes?', type: 'boolean', dimension: 'solutionFit', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'telemedicine video call' },
      { order: 4, text: '¿Cuánto pagarías por una consulta virtual de calidad?', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['$0 (solo seguro)', '$10-20', '$21-40', '$41-70', '>$70'], imageKeyword: 'medical consultation fee' },
      { order: 5, text: 'Del 1 al 10, ¿qué tan importante es la privacidad de tus datos médicos?', type: 'scale', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'medical privacy security' },
      { order: 6, text: '¿Usas algún wearable o app de salud actualmente?', type: 'text', dimension: 'currentBehavior', weight: 0.08, required: false, widgetType: 'keyword_cloud', imageKeyword: 'fitness tracker smartwatch' },
      { order: 7, text: '¿Confiarías en un diagnóstico asistido por IA?', type: 'scale', dimension: 'earlyAdopter', weight: 0.10, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'AI artificial intelligence medical diagnosis' }
    ]
  },

  {
    id: 'education',
    name: 'EdTech Validation',
    emoji: '🎓',
    description: 'Validación para plataformas educativas',
    industry: 'Education',
    targetAudience: 'Estudiantes, maestros, instituciones',
    coverPrompt: 'Modern online learning platform, virtual classroom, educational technology',
    questions: [
      { order: 1, text: '¿Cuál es tu mayor frustración al aprender online?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'frustrated student online learning' },
      { order: 2, text: '¿Cuántas horas dedicas a formación online a la semana?', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['0', '<2 horas', '2-5 horas', '5-10 horas', '>10 horas'], imageKeyword: 'study time learning schedule' },
      { order: 3, text: '¿Has pagado por cursos online antes?', type: 'boolean', dimension: 'willingnessToPay', weight: 0.12, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'online course payment' },
      { order: 4, text: '¿Cuánto estarías dispuesto a pagar por un curso de calidad?', type: 'select', dimension: 'willingnessToPay', weight: 0.18, required: true, widgetType: 'currency_bucket', options: ['$0 (solo gratis)', '$10-30', '$31-70', '$71-150', '>$150'], imageKeyword: 'course pricing education' },
      { order: 5, text: 'Del 1 al 5, ¿qué tan importante es la certificación oficial para ti?', type: 'scale', dimension: 'solutionFit', weight: 0.12, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'certificate diploma credential' },
      { order: 6, text: '¿Prefieres aprender en vivo o con contenido grabado?', type: 'select', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'default', options: ['En vivo', 'Grabado', 'Híbrido', 'Me da igual'], imageKeyword: 'live class vs recorded video' },
      { order: 7, text: '¿Qué te motiva a completar un curso online?', type: 'text', dimension: 'solutionFit', weight: 0.15, required: false, widgetType: 'keyword_cloud', imageKeyword: 'course completion motivation' }
    ]
  },

  {
    id: 'hardware_iot',
    name: 'Hardware / IoT Validation',
    emoji: '⚙️',
    description: 'Validación para productos físicos y dispositivos IoT',
    industry: 'Hardware / IoT',
    targetAudience: 'Early adopters tech-savvy',
    coverPrompt: 'Smart IoT devices, futuristic hardware product, connected technology',
    questions: [
      { order: 1, text: '¿Qué dispositivo inteligente te gustaría tener que no existe aún?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'smart home IoT device' },
      { order: 2, text: '¿Cuántos dispositivos IoT tienes en casa?', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['0', '1-2', '3-5', '6-10', '>10'], imageKeyword: 'smart home devices collection' },
      { order: 3, text: '¿Cuánto gastarías en un dispositivo que resuelva un problema real?', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['<$50', '$50-100', '$101-200', '$201-400', '>$400'], imageKeyword: 'hardware product pricing' },
      { order: 4, text: 'Del 1 al 10, ¿qué tan importante es la integración con otros dispositivos?', type: 'scale', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'device integration ecosystem' },
      { order: 5, text: '¿Te preocupa la privacidad con dispositivos conectados?', type: 'boolean', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'IoT privacy security concern' },
      { order: 6, text: '¿Comprarías un producto en crowdfunding (Kickstarter)?', type: 'boolean', dimension: 'earlyAdopter', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'crowdfunding campaign pledge' }
    ]
  }
];

// Utility to convert NicheTemplate to ProjectTemplate
export const templateToProject = (template: NicheTemplate, userId: string): ProjectTemplate => {
  return {
    id: `proj_${Date.now()}_${template.id}`,
    name: template.name,
    description: template.description,
    detailedDescription: `Template pre-configurado para ${template.industry}. Target: ${template.targetAudience}`,

    emoji: template.emoji,
    coverImage: getCoverByIdea(template.industry, template.industry),
    targetAudience: template.targetAudience,
    region: 'Global',
    productTypes: [],
    questions: template.questions.map((q, i) => ({
      ...q,
      id: `q${i + 1}_${template.id}`
    })) as Question[],
    createdAt: new Date().toISOString()
  };
};
