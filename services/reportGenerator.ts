/**
 * Report Generator Service
 * Generates professional business reports from validation data
 */

import { 
  ProjectTemplate, Interview, ReportConfig, GeneratedReport, 
  REPORT_SECTIONS, calculateReportCost 
} from '../types';
import { chat } from './aiService';

// ============ REPORT GENERATION ============

interface ReportProgress {
  progress: number;
  stage: string;
}

type ProgressCallback = (progress: ReportProgress) => void;

/**
 * Generate a complete business report
 */
export async function generateBusinessReport(
  config: ReportConfig,
  project: ProjectTemplate,
  interviews: Interview[],
  onProgress?: ProgressCallback
): Promise<GeneratedReport> {
  const reportId = `report_${Date.now()}`;
  const totalSections = config.sections.length;
  let currentSection = 0;
  
  const updateProgress = (stage: string) => {
    currentSection++;
    const progress = Math.round((currentSection / (totalSections + 2)) * 100);
    onProgress?.({ progress, stage });
  };
  
  // FORCE IMMEDIATE UPDATE
  console.log("🚀 Starting report generation...");
  onProgress?.({ progress: 1, stage: 'Iniciando motor de IA...' });
  
  // Discovery check
  onProgress?.({ progress: 5, stage: 'Verificando modelos disponibles...' });
  
  // Collect validation data
  const validationData = prepareValidationData(project, interviews);
  
  onProgress?.({ progress: 10, stage: 'Analizando entrevistas...' });
  
  // Generate each section
  const sectionContents: Record<string, string> = {};
  
  for (const sectionId of config.sections) {
    const section = REPORT_SECTIONS.find(s => s.id === sectionId);
    if (!section) continue;
    
    updateProgress(`Generando ${section.titleEs}...`);
    
    try {
      const content = await generateSection(sectionId, validationData, config.language);
      sectionContents[sectionId] = content;
    } catch (error) {
      console.error(`Error generating section ${sectionId}:`, error);
      sectionContents[sectionId] = `<p style="color: #ef4444;">Error al generar esta sección. Por favor intente nuevamente.</p>`;
    }
  }
  
  onProgress?.({ progress: 90, stage: 'Diseñando reporte final...' });
  
  // Assemble final HTML
  const htmlContent = assembleReport(project, sectionContents, config);
  
  onProgress?.({ progress: 100, stage: '¡Reporte completado!' });
  
  return {
    id: reportId,
    projectId: config.projectId,
    config,
    htmlContent,
    creditsUsed: calculateReportCost(config.sections),
    generatedAt: new Date().toISOString(),
    status: 'complete',
    progress: 100,
  };
}

// ============ DATA PREPARATION ============

interface ValidationData {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  region: string;
  totalInterviews: number;
  averageScore: number;
  dimensionScores: Record<string, number>;
  topInsights: string[];
  customerQuotes: string[];
  questions: Array<{ text: string; category?: string }>;
}

function prepareValidationData(project: ProjectTemplate, interviews: Interview[]): ValidationData {
  // Calculate average scores
  const avgScore = interviews.length > 0
    ? interviews.reduce((sum, i) => sum + (i.totalScore || 0), 0) / interviews.length
    : 0;
  
  // Aggregate dimension scores
  const dimensionTotals: Record<string, number[]> = {};
  interviews.forEach(interview => {
    if (interview.dimensionScores) {
      Object.entries(interview.dimensionScores).forEach(([dim, score]) => {
        if (!dimensionTotals[dim]) dimensionTotals[dim] = [];
        dimensionTotals[dim].push(score);
      });
    }
  });
  
  const dimensionScores: Record<string, number> = {};
  Object.entries(dimensionTotals).forEach(([dim, scores]) => {
    dimensionScores[dim] = scores.reduce((a, b) => a + b, 0) / scores.length;
  });
  
  // Extract insights and quotes
  const topInsights = interviews
    .flatMap(i => i.keyInsights || [])
    .slice(0, 10);
  
  const customerQuotes = interviews
    .filter(i => i.summary)
    .map(i => `"${i.summary}" - ${i.respondentName}`)
    .slice(0, 5);
  
  return {
    projectName: project.name,
    projectDescription: project.description,
    targetAudience: project.targetAudience || 'General',
    region: project.region || 'Global',
    totalInterviews: interviews.length,
    averageScore: Math.round(avgScore),
    dimensionScores,
    topInsights,
    customerQuotes,
    questions: project.questions.map(q => ({ text: q.text, category: q.category })),
  };
}

// ============ SECTION GENERATORS ============

async function generateSection(
  sectionId: string, 
  data: ValidationData, 
  language: 'es' | 'en'
): Promise<string> {
  const isSpanish = language === 'es';
  
  const prompts: Record<string, string> = {
    executive_summary: `
      Generate an EXECUTIVE SUMMARY for a startup validation report.
      
      Project: ${data.projectName}
      Description: ${data.projectDescription}
      Target: ${data.targetAudience}
      Validation Score: ${data.averageScore}%
      Interviews Conducted: ${data.totalInterviews}
      
      Write 2-3 paragraphs covering:
      1. The opportunity in one compelling sentence
      2. Key validation findings
      3. Recommended next steps
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY the HTML content (paragraphs with <p> tags)
    `,
    
    problem_solution: `
      Analyze the PROBLEM & SOLUTION fit based on validation data.
      
      Project: ${data.projectName}
      Description: ${data.projectDescription}
      Problem Intensity Score: ${data.dimensionScores.problemIntensity || data.dimensionScores.painPoint || 50}%
      Solution Fit Score: ${data.dimensionScores.solutionFit || 50}%
      
      Key Insights: ${data.topInsights.join('; ')}
      
      Write:
      1. The core problem identified (1 paragraph)
      2. How the solution addresses it (1 paragraph)
      3. Gaps or opportunities for improvement (bullet points)
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content
    `,
    
    market_analysis: `
      Generate a MARKET ANALYSIS section.
      
      Project: ${data.projectName}
      Target Audience: ${data.targetAudience}
      Region: ${data.region}
      
      Include:
      1. TAM/SAM/SOM estimates with reasoning
      2. Market trends (3-4 bullet points)
      3. Growth potential assessment
      
      Make educated estimates based on the project type and target market.
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with tables and lists
    `,
    
    competition: `
      Generate a COMPETITIVE LANDSCAPE analysis.
      
      Project: ${data.projectName}
      Description: ${data.projectDescription}
      
      Include:
      1. Identify 3-4 potential competitors (estimate based on project type)
      2. Create a comparison matrix (features, pricing, strengths)
      3. Unique differentiators for this project
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with table
    `,
    
    validation_results: `
      Generate a VALIDATION RESULTS section.
      
      Validation Score: ${data.averageScore}%
      Total Interviews: ${data.totalInterviews}
      
      Dimension Scores:
      ${Object.entries(data.dimensionScores).map(([k, v]) => `- ${k}: ${Math.round(v)}%`).join('\\n')}
      
      Include:
      1. Overall assessment (Go / Pivot / No-Go recommendation)
      2. Breakdown by dimension with interpretation
      3. Statistical confidence note
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content
    `,
    
    customer_insights: `
      Generate a CUSTOMER INSIGHTS section.
      
      Customer Quotes:
      ${data.customerQuotes.join('\\n')}
      
      Key Insights:
      ${data.topInsights.join('\\n')}
      
      Include:
      1. Key patterns observed (3-4 bullet points)
      2. Featured quotes (format nicely with attribution)
      3. Customer persona summary
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with blockquotes
    `,
    
    business_model: `
      Generate a BUSINESS MODEL section.
      
      Project: ${data.projectName}
      Description: ${data.projectDescription}
      Willingness to Pay Score: ${data.dimensionScores.willingnessToPay || 50}%
      
      Include:
      1. Suggested pricing model (freemium, subscription, per-use, etc.)
      2. Revenue projections (monthly, yearly estimates)
      3. Unit economics (CAC, LTV estimates)
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with table for pricing tiers
    `,
    
    go_to_market: `
      Generate a GO-TO-MARKET STRATEGY section.
      
      Project: ${data.projectName}
      Target: ${data.targetAudience}
      Region: ${data.region}
      
      Include:
      1. Launch strategy (phased approach)
      2. Top 3 acquisition channels with reasoning
      3. First 100 customers plan
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content
    `,
    
    financial_projections: `
      Generate a FINANCIAL PROJECTIONS section (12 months).
      
      Project: ${data.projectName}
      
      Include:
      1. Monthly revenue projection chart data
      2. Key expense categories
      3. Break-even analysis
      4. Funding requirements (if any)
      
      Make reasonable estimates for a early-stage startup.
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with tables
    `,
    
    risk_assessment: `
      Generate a RISK ASSESSMENT section.
      
      Project: ${data.projectName}
      Validation Score: ${data.averageScore}%
      
      Include:
      1. Top 5 risks (market, technical, financial, operational, regulatory)
      2. Severity and likelihood for each
      3. Mitigation strategies
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with table
    `,
    
    roadmap: `
      Generate a 12-MONTH ROADMAP section.
      
      Project: ${data.projectName}
      
      Include:
      1. Quarter 1: MVP and launch milestones
      2. Quarter 2: Growth phase milestones
      3. Quarter 3: Scaling milestones
      4. Quarter 4: Optimization milestones
      
      Be specific with timeline and deliverables.
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content with timeline structure
    `,
    
    appendix: `
      Generate an APPENDIX section.
      
      Total Interviews: ${data.totalInterviews}
      Questions Asked: ${data.questions.length}
      
      Question Categories:
      ${data.questions.map(q => `- ${q.text}`).slice(0, 5).join('\\n')}
      
      Include:
      1. Methodology summary
      2. Data quality notes
      3. Limitations
      
      Language: ${isSpanish ? 'Spanish' : 'English'}
      Format: Return ONLY HTML content
    `,
  };
  
  const prompt = prompts[sectionId];
  if (!prompt) {
    return `<p>Section "${sectionId}" not available.</p>`;
  }
  
  try {
    const response = await chat(prompt);
    // Clean up response - remove markdown code blocks if present
    let cleaned = response
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return cleaned;
  } catch (error) {
    console.error(`Error generating ${sectionId}:`, error);
    return `<p style="color: #fbbf24;">Contenido no disponible temporalmente.</p>`;
  }
}

// ============ REPORT ASSEMBLY ============

function assembleReport(
  project: ProjectTemplate,
  sections: Record<string, string>,
  config: ReportConfig
): string {
  const isSpanish = config.language === 'es';
  const date = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const sectionHtml = config.sections.map(sectionId => {
    const section = REPORT_SECTIONS.find(s => s.id === sectionId);
    if (!section || !sections[sectionId]) return '';
    
    const title = isSpanish ? section.titleEs : section.title;
    
    return `
      <section class="report-section">
        <h2>${section.icon} ${title}</h2>
        <div class="section-content">
          ${sections[sectionId]}
        </div>
      </section>
    `;
  }).join('');
  
  return `
<!DOCTYPE html>
<html lang="${config.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - ${isSpanish ? 'Informe de Negocio' : 'Business Report'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
    
    :root {
      --primary: #059669;       /* Professional Emerald Green */
      --secondary: #2563EB;     /* Trustworhy Blue */
      --bg-paper: #ffffff;      /* Clean White */
      --bg-subtle: #f8fafc;     /* Lighter Grey */
      --text-main: #1e293b;     /* Slate 800 - High Contrast */
      --text-muted: #64748b;    /* Slate 500 */
      --border: #e2e8f0;        /* Slate 200 */
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', sans-serif;
      background: #f1f5f9;      /* Light grey background for the "desk" */
      color: var(--text-main);
      line-height: 1.8;
      font-size: 16px;          /* Improved Readability */
      -webkit-font-smoothing: antialiased;
    }
    
    /* Simulate A4 Paper */
    .report-container {
      max-width: 850px;         /* Approx A4 width */
      margin: 40px auto;
      background: var(--bg-paper);
      padding: 80px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border-radius: 4px;
    }
    
    /* Header - Professional & Clean */
    .report-header {
      text-align: left;
      border-bottom: 4px solid var(--primary);
      padding-bottom: 40px;
      margin-bottom: 60px;
    }
    
    .report-header h1 {
      font-family: 'Merriweather', serif;
      font-size: 36px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    
    .report-header .meta {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .report-section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }
    
    .report-section h2 {
      font-family: 'Merriweather', serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 25px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .section-content {
      color: #334155; /* Slate 700 */
    }
    
    .section-content p { margin-bottom: 18px; }
    
    .section-content ul, .section-content ol {
      margin: 20px 0;
      padding-left: 24px;
    }
    
    .section-content li { margin-bottom: 10px; }
    
    .section-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 15px;
      border: 1px solid var(--border);
    }
    
    .section-content th, .section-content td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    
    .section-content th {
      background: var(--bg-subtle);
      color: var(--text-main);
      font-weight: 600;
    }
    
    .section-content blockquote {
      border-left: 4px solid var(--secondary);
      background: #eff6ff; /* Blue 50 */
      padding: 24px 30px;
      margin: 30px 0;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #1e3a8a;
    }
    
    .section-content strong { color: #0f172a; font-weight: 600; }
    
    .footer {
      text-align: center;
      padding-top: 40px;
      color: var(--text-muted);
      font-size: 12px;
      border-top: 1px solid var(--border);
      margin-top: 80px;
    }
    
    .footer .logo span { color: var(--primary); font-weight: 700; }
    
    @media print {
      body { background: white; }
      .report-container { 
        margin: 0; 
        padding: 40px;
        box-shadow: none;
        max-width: 100%;
      }
      .report-section { page-break-inside: auto; }
      h2 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <header class="report-header">
      <h1>${project.name}</h1>
      <div class="meta">
        <span>${date}</span>
        <span>•</span>
        <span>${isSpanish ? 'Validación Estratégica' : 'Strategic Validation'}</span>
      </div>
    </header>
    
    ${sectionHtml}
    
    <footer class="footer">
      <div class="logo">VALID<span>.AI</span> Business Intelligence</div>
      <p style="margin-top:8px">
        ${isSpanish ? 'Generado con motor de inteligencia híbrida' : 'Generated with hybrid intelligence engine'}
      </p>
    </footer>
  </div>
</body>
</html>
  `.trim();
}

// ============ UTILITY ============

/**
 * Download report as HTML file
 */
export function downloadReport(report: GeneratedReport, filename?: string): void {
  const blob = new Blob([report.htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${report.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open report in new tab for printing to PDF
 */
export function openReportForPrint(report: GeneratedReport): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(report.htmlContent);
    printWindow.document.close();
  }
}
