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
  
  onProgress?.({ progress: 5, stage: 'Preparando datos de validación...' });
  
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
    
    :root {
      --primary: #00FF94;
      --bg-dark: #0a0a0a;
      --bg-card: #111111;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-dark);
      color: var(--text-primary);
      line-height: 1.7;
      font-size: 14px;
    }
    
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 40px;
    }
    
    .report-header {
      text-align: center;
      padding: 60px 0;
      border-bottom: 2px solid var(--primary);
      margin-bottom: 40px;
    }
    
    .report-header h1 {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #fff, var(--primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .report-header .date {
      color: var(--text-secondary);
      font-size: 14px;
    }
    
    .report-header .badge {
      display: inline-block;
      background: rgba(0,255,148,0.15);
      color: var(--primary);
      padding: 8px 20px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 20px;
    }
    
    .report-section {
      background: var(--bg-card);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 35px;
      margin-bottom: 30px;
    }
    
    .report-section h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 25px;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .section-content {
      color: var(--text-secondary);
    }
    
    .section-content p { margin-bottom: 16px; }
    
    .section-content ul, .section-content ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    
    .section-content li { margin-bottom: 10px; }
    
    .section-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    .section-content th, .section-content td {
      padding: 14px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .section-content th {
      background: rgba(0,255,148,0.1);
      color: var(--primary);
      font-weight: 600;
    }
    
    .section-content blockquote {
      border-left: 4px solid var(--primary);
      padding: 16px 24px;
      margin: 20px 0;
      background: rgba(0,255,148,0.05);
      border-radius: 0 8px 8px 0;
      font-style: italic;
    }
    
    .section-content strong { color: var(--text-primary); }
    
    .footer {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 40px;
    }
    
    .footer .logo {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 10px;
    }
    
    .footer .logo span { color: var(--primary); }
    
    @media print {
      body { background: white; color: black; }
      .report-section { border-color: #ddd; }
      .section-content { color: #333; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <header class="report-header">
      <h1>${project.name}</h1>
      <p class="date">${date}</p>
      <span class="badge">${isSpanish ? 'Informe de Validación de Negocio' : 'Business Validation Report'}</span>
    </header>
    
    ${sectionHtml}
    
    <footer class="footer">
      <div class="logo">VALID<span>.AI</span></div>
      <p>${isSpanish ? 'Generado con inteligencia artificial' : 'Generated with artificial intelligence'}</p>
      <p>${isSpanish ? 'Powered by Gemini & Claude' : 'Powered by Gemini & Claude'}</p>
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
