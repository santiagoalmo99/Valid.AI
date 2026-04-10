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
    description: 'VC-grade validation for enterprise software solutions.',
    industry: 'B2B SaaS',
    targetAudience: 'Enterprise Decision Makers (CTOs, VPs, IT Directors)',
    coverPrompt: 'Modern corporate office with cloud computing servers, professional SaaS dashboard',
    questions: [
      { order: 1, text: 'What is the most critical friction point in your current technology stack?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'frustrated business person looking at computer' },
      { order: 2, text: 'How many monthly productivity hours are lost due to inefficiencies in current tools?', type: 'select', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'default', options: ['<5 hours', '5-10 hours', '10-20 hours', '20-40 hours', '>40 hours'], imageKeyword: 'time wasted inefficiency' },
      { order: 3, text: 'Relative to the problem value, what is your projected monthly budget for a solution?', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['$0-500', '$500-2K', '$2K-5K', '$5K-10K', '>$10K'], imageKeyword: 'budget allocation software' },
      { order: 4, text: 'Describe your internal procurement/approval hierarchy.', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['Solo Decision Maker', 'Single Stakeholder Approval', 'Department Committee (<5)', 'Enterprise Procurement (>5)'], imageKeyword: 'corporate approval process' },
      { order: 5, text: 'On a 1-10 scale, how urgent is the deployment of a new solution?', type: 'scale', dimension: 'problemIntensity', weight: 0.18, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'urgency crisis alert' },
      { order: 6, text: 'Identify legacy alternatives you have attempted and why they were decommissioned.', type: 'text', dimension: 'currentBehavior', weight: 0.10, required: false, widgetType: 'keyword_cloud', imageKeyword: 'failed solutions alternative tools' },
      { order: 7, text: 'Would you be willing to participate in a prioritized private beta cohort?', type: 'boolean', dimension: 'earlyAdopter', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'beta testing early access' }
    ]
  },
  
  {
    id: 'consumer_app',
    name: 'Consumer App Validation',
    emoji: '📱',
    description: 'High-fidelity audit for consumer-facing mobile applications.',
    industry: 'Consumer Tech',
    targetAudience: 'End Users (Gen Z, Millennials, Early Adopters)',
    coverPrompt: 'Young people using smartphones in vibrant urban setting, mobile app interface',
    questions: [
      { order: 1, text: 'What is your primary friction point with the applications you utilize daily?', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'frustrated young person smartphone' },
      { order: 2, text: 'Quantify your monthly application installation velocity.', type: 'select', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'default', options: ['0-1', '2-3', '4-6', '7-10', '>10'], imageKeyword: 'app store browsing' },
      { order: 3, text: 'Would you commit capital to a solution that eradicated this friction?', type: 'boolean', dimension: 'willingnessToPay', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'paying for app subscription' },
      { order: 4, text: 'Define your ceiling for a premium monthly subscription.', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['Freemium Only', '$1-3', '$4-7', '$8-15', '>$15'], imageKeyword: 'money subscription pricing' },
      { order: 5, text: 'On a 1-5 scale, what is the probability of organic referral (NPS)?', type: 'scale', dimension: 'solutionFit', weight: 0.12, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'sharing app with friends' },
      { order: 6, text: 'Define the "Atomic Habit" feature that would command daily attention.', type: 'text', dimension: 'solutionFit', weight: 0.15, required: false, widgetType: 'keyword_cloud', imageKeyword: 'daily habit notification' },
      { order: 7, text: 'Would you exchange behavioral data for a personalized strategic experience?', type: 'boolean', dimension: 'earlyAdopter', weight: 0.10, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'privacy data sharing' },
      { order: 8, text: 'Monetization preference: Ad-supported vs. Premium Ad-free.', type: 'select', dimension: 'willingnessToPay', weight: 0.05, required: true, widgetType: 'default', options: ['Ad-Supported (Free)', 'Ad-Free (Premium)', 'Freemium Hybrid'], imageKeyword: 'ads vs premium choice' }
    ]
  },
  
  {
    id: 'ecommerce',
    name: 'E-commerce Validation',
    emoji: '🛒',
    description: 'Protocol for online retailers and digital marketplaces.',
    industry: 'E-commerce',
    targetAudience: 'High-Velocity Online Shoppers',
    coverPrompt: 'Modern e-commerce shopping interface, online store checkout, digital commerce',
    questions: [
      { order: 1, text: 'Identify the primary catalyst for shopping cart abandonment.', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'abandoned shopping cart' },
      { order: 2, text: 'Quantify your monthly digital procurement frequency.', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['None', 'Annually', 'Monthly', 'Weekly', 'Daily'], imageKeyword: 'online shopping frequency' },
      { order: 3, text: 'Define your average transaction value (ATV) for online spending.', type: 'select', dimension: 'willingnessToPay', weight: 0.18, required: true, widgetType: 'currency_bucket', options: ['<$20', '$20-50', '$51-100', '$101-300', '>$300'], imageKeyword: 'spending money online' },
      { order: 4, text: 'On a 1-10 scale, how critical is subsidized shipping to your conversion?', type: 'scale', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'free shipping delivery' },
      { order: 5, text: 'Do you execute tactical price comparisons before capital commitment?', type: 'boolean', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'price comparison shopping' },
      { order: 6, text: 'Identify the "Surgical Feature" that would increase your purchase frequency.', type: 'text', dimension: 'solutionFit', weight: 0.15, required: false, widgetType: 'keyword_cloud', imageKeyword: 'loyalty program rewards' },
      { order: 7, text: 'Quantify your reliance on peer-to-peer review consensus.', type: 'scale', dimension: 'earlyAdopter', weight: 0.10, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'customer reviews ratings' },
      { order: 8, text: 'Define your prioritized payment protocol.', type: 'select', dimension: 'currentBehavior', weight: 0.05, required: true, widgetType: 'default', options: ['Credit/Debit Card', 'PayPal / Digital Wallet', 'Wire Transfer', 'Crypto Asset', 'Cash on Delivery'], imageKeyword: 'payment methods checkout' }
    ]
  },

  {
    id: 'healthcare',
    name: 'Healthcare Validation',
    emoji: '🏥',
    description: 'Bilateral audit for health-tech and biomedical innovation.',
    industry: 'Healthcare / BioTech',
    targetAudience: 'Patients and Clinical Professionals',
    coverPrompt: 'Modern medical technology, health monitoring devices, telemedicine consultation',
    questions: [
      { order: 1, text: 'Identify the primary structural friction in your current healthcare experience.', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'healthcare frustration waiting room' },
      { order: 2, text: 'Quantify your monthly clinical interaction frequency.', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['None', 'Annual Checkup', 'Bi-annual', 'Monthly', 'Weekly'], imageKeyword: 'doctor visit medical appointment' },
      { order: 3, text: 'Would you adopt Telemedicine for non-critical strategic consultations?', type: 'boolean', dimension: 'solutionFit', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'telemedicine video call' },
      { order: 4, text: 'Define your capital threshold for a premium virtual consultation.', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['$0 (Insured Only)', '$10-20', '$21-40', '$41-70', '>$70'], imageKeyword: 'medical consultation fee' },
      { order: 5, text: 'On a 1-10 scale, how critical is absolute medical data sovereignty?', type: 'scale', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'medical privacy security' },
      { order: 6, text: 'List your current medical biosensor/app ecosystem.', type: 'text', dimension: 'currentBehavior', weight: 0.08, required: false, widgetType: 'keyword_cloud', imageKeyword: 'fitness tracker smartwatch' },
      { order: 7, text: 'Would you trust a diagnosis synthesized by a clinical Neural Engine?', type: 'scale', dimension: 'earlyAdopter', weight: 0.10, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'AI artificial intelligence medical diagnosis' }
    ]
  },

  {
    id: 'education',
    name: 'EdTech Validation',
    emoji: '🎓',
    description: 'Framework for educational platforms and institutional learning.',
    industry: 'Education / EdTech',
    targetAudience: 'Learners, Educators, Institutional Stakeholders',
    coverPrompt: 'Modern online learning platform, virtual classroom, educational technology',
    questions: [
      { order: 1, text: 'Identify the primary friction in your digital learning experience.', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'frustrated student online learning' },
      { order: 2, text: 'Quantify your weekly digital learning velocity (hours).', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['None', '<2 hours', '2-5 hours', '5-10 hours', '>10 hours'], imageKeyword: 'study time learning schedule' },
      { order: 3, text: 'Have you previously committed capital to premium digital curricula?', type: 'boolean', dimension: 'willingnessToPay', weight: 0.12, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'online course payment' },
      { order: 4, text: 'Define your investment threshold for a high-fidelity course.', type: 'select', dimension: 'willingnessToPay', weight: 0.18, required: true, widgetType: 'currency_bucket', options: ['$0 (Free Only)', '$10-30', '$31-70', '$71-150', '>$150'], imageKeyword: 'course pricing education' },
      { order: 5, text: 'On a 1-5 scale, how critical is accredited institutional certification?', type: 'scale', dimension: 'solutionFit', weight: 0.12, required: true, widgetType: 'gauge_1_5', options: [], imageKeyword: 'certificate diploma credential' },
      { order: 6, text: 'Learning preference: Synchronous (Live) vs. Asynchronous (Recorded).', type: 'select', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'default', options: ['Synchronous (Live)', 'Asynchronous (Recorded)', 'Hybrid Protocol', 'Indifferent'], imageKeyword: 'live class vs recorded video' },
      { order: 7, text: 'Identify the primary catalyst for curriculum completion.', type: 'text', dimension: 'solutionFit', weight: 0.15, required: false, widgetType: 'keyword_cloud', imageKeyword: 'course completion motivation' }
    ]
  },

  {
    id: 'hardware_iot',
    name: 'Hardware / IoT Validation',
    emoji: '⚙️',
    description: 'Critical audit for physical products and connected ecosystems.',
    industry: 'Hardware / IoT',
    targetAudience: 'Tech-Savvy Visionaries / Early Adopters',
    coverPrompt: 'Smart IoT devices, futuristic hardware product, connected technology',
    questions: [
      { order: 1, text: 'Identify the "Invisible Object" (disrupted hardware) you wish existed.', type: 'text', dimension: 'painPoint', weight: 0.15, required: true, widgetType: 'keyword_cloud', imageKeyword: 'smart home IoT device' },
      { order: 2, text: 'Quantify your home IoT density (device count).', type: 'select', dimension: 'currentBehavior', weight: 0.10, required: true, widgetType: 'default', options: ['0', '1-2', '3-5', '6-10', '>10'], imageKeyword: 'smart home devices collection' },
      { order: 3, text: 'Define your investment threshold for a device resolving critical friction.', type: 'select', dimension: 'willingnessToPay', weight: 0.20, required: true, widgetType: 'currency_bucket', options: ['<$50', '$50-100', '$101-200', '$201-400', '>$400'], imageKeyword: 'hardware product pricing' },
      { order: 4, text: 'On a 1-10 scale, how critical is cross-ecosystem integration?', type: 'scale', dimension: 'problemIntensity', weight: 0.12, required: true, widgetType: 'gauge_1_10', options: [], imageKeyword: 'device integration ecosystem' },
      { order: 5, text: 'Rate your strategic concern regarding IoT data sovereignty.', type: 'boolean', dimension: 'currentBehavior', weight: 0.08, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'IoT privacy security concern' },
      { order: 6, text: 'Would you commit capital to a Crowdfunding (Kickstarter) protocol?', type: 'boolean', dimension: 'earlyAdopter', weight: 0.15, required: true, widgetType: 'boolean_donut', options: [], imageKeyword: 'crowdfunding campaign pledge' }
    ]
  }
];

// Utility to convert NicheTemplate to ProjectTemplate
export const templateToProject = (template: NicheTemplate, userId: string): ProjectTemplate => {
  return {
    id: `proj_${Date.now()}_${template.id}`,
    name: template.name,
    description: template.description,
    detailedDescription: `Institutional Framework for ${template.industry}. Target Persona: ${template.targetAudience}`,

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
