/**
 * Universal Export Service
 * Generates professional PDF/HTML exports for all VALID.AI reports
 * Phase 13 Implementation
 */

import { ProjectTemplate, Interview, DeepAnalysisReport, REPORT_SECTIONS } from '../types';

// ============ TYPES ============

export type ExportFormat = 'html' | 'pdf';
export type ExportType = 'interview' | 'interview_batch' | 'deep_research' | 'due_diligence' | 'dashboard';

interface ExportOptions {
  format: ExportFormat;
  language: 'es' | 'en';
  includeRawData?: boolean;
  watermark?: boolean;
}

// ============ CORE STYLES ============

const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  :root {
    --primary: #00FF94;
    --primary-dark: #00CC77;
    --bg-dark: #0a0a0a;
    --bg-card: #111111;
    --bg-section: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-muted: #666666;
    --border: rgba(255,255,255,0.1);
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
  }
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-dark);
    color: var(--text-primary);
    line-height: 1.6;
    font-size: 14px;
  }
  
  .export-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
  }
  
  .export-header {
    text-align: center;
    padding: 50px 0;
    border-bottom: 2px solid var(--primary);
    margin-bottom: 40px;
  }
  
  .export-header h1 {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #fff, var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .export-header .subtitle {
    color: var(--text-secondary);
    font-size: 16px;
  }
  
  .export-header .date {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 15px;
  }
  
  .export-header .badge {
    display: inline-block;
    background: rgba(0,255,148,0.15);
    color: var(--primary);
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    margin-top: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 25px;
  }
  
  .section h2 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .section h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 20px 0 12px;
    color: var(--text-primary);
  }
  
  .section p {
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .metric-card {
    background: var(--bg-section);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
  
  .metric-card .value {
    font-size: 32px;
    font-weight: 800;
    color: var(--primary);
  }
  
  .metric-card .label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 5px;
  }
  
  .score-bar {
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
    margin: 10px 0;
  }
  
  .score-bar .fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--primary-dark));
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  
  .data-table th {
    background: rgba(0,255,148,0.1);
    color: var(--primary);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .data-table td {
    color: var(--text-secondary);
  }
  
  .insight-card {
    background: rgba(0,255,148,0.05);
    border-left: 4px solid var(--primary);
    padding: 15px 20px;
    margin: 10px 0;
    border-radius: 0 8px 8px 0;
  }
  
  .insight-card.warning {
    background: rgba(245,158,11,0.1);
    border-left-color: var(--warning);
  }
  
  .insight-card.danger {
    background: rgba(239,68,68,0.1);
    border-left-color: var(--danger);
  }
  
  .quote {
    font-style: italic;
    color: var(--text-secondary);
    padding: 15px 25px;
    border-left: 3px solid var(--primary);
    margin: 15px 0;
    background: rgba(0,255,148,0.03);
  }
  
  .quote .attribution {
    font-style: normal;
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 8px;
  }
  
  .tag {
    display: inline-block;
    padding: 4px 10px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    font-size: 11px;
    margin: 3px;
    color: var(--text-secondary);
  }
  
  .tag.positive { background: rgba(34,197,94,0.2); color: var(--success); }
  .tag.negative { background: rgba(239,68,68,0.2); color: var(--danger); }
  .tag.warning { background: rgba(245,158,11,0.2); color: var(--warning); }
  
  .footer {
    text-align: center;
    padding: 40px;
    color: var(--text-muted);
    font-size: 11px;
    border-top: 1px solid var(--border);
    margin-top: 40px;
  }
  
  .footer .logo {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 8px;
    color: var(--text-secondary);
  }
  
  .footer .logo span { color: var(--primary); }
  
  @media print {
    body { background: white; color: #1a1a1a; }
    .section { border-color: #e5e5e5; }
    .export-header { border-color: #00CC77; }
    .metric-card { background: #f5f5f5; }
    .data-table th { background: #f0f0f0; color: #00CC77; }
    .data-table td { color: #333; }
    .section p, .footer { color: #666; }
  }
`;

// ============ INTERVIEW EXPORT ============

export function generateInterviewExport(
  interview: Interview,
  project: ProjectTemplate,
  options: ExportOptions
): string {
  const isSpanish = options.language === 'es';
  const date = new Date(interview.date).toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  // Score interpretation
  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: isSpanish ? 'Excelente' : 'Excellent', color: 'success' };
    if (score >= 60) return { label: isSpanish ? 'Bueno' : 'Good', color: 'primary' };
    if (score >= 40) return { label: isSpanish ? 'Regular' : 'Fair', color: 'warning' };
    return { label: isSpanish ? 'Bajo' : 'Low', color: 'danger' };
  };
  
  const scoreLevel = getScoreLevel(interview.totalScore);
  
  // Dimension scores
  const dimensionLabels: Record<string, { es: string; en: string }> = {
    problemIntensity: { es: 'Intensidad del Problema', en: 'Problem Intensity' },
    solutionFit: { es: 'Ajuste de Solución', en: 'Solution Fit' },
    currentBehavior: { es: 'Comportamiento Actual', en: 'Current Behavior' },
    painPoint: { es: 'Punto de Dolor', en: 'Pain Point' },
    earlyAdopter: { es: 'Early Adopter', en: 'Early Adopter' },
    willingnessToPay: { es: 'Disposición a Pagar', en: 'Willingness to Pay' },
  };
  
  const dimensionScoresHTML = interview.dimensionScores 
    ? Object.entries(interview.dimensionScores).map(([key, value]) => `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>${dimensionLabels[key]?.[options.language] || key}</span>
          <span style="font-weight: 600; color: var(--primary);">${Math.round(value)}%</span>
        </div>
        <div class="score-bar">
          <div class="fill" style="width: ${value}%;"></div>
        </div>
      </div>
    `).join('')
    : '';
  
  // Key insights
  const insightsHTML = interview.keyInsights?.length 
    ? interview.keyInsights.map(insight => `
      <div class="insight-card">
        <p style="margin: 0;">💡 ${insight}</p>
      </div>
    `).join('')
    : `<p style="color: var(--text-muted);">${isSpanish ? 'No hay insights disponibles' : 'No insights available'}</p>`;
  
  // Answers table
  const answersHTML = Object.entries(interview.answers || {}).map(([questionId, answer]) => {
    const question = project.questions.find(q => q.id === questionId);
    return `
      <tr>
        <td style="width: 40%;">${question?.text || questionId}</td>
        <td>${answer.rawValue || '-'}</td>
        <td style="color: var(--text-muted); font-size: 12px;">${answer.observation || ''}</td>
      </tr>
    `;
  }).join('');
  
  return `
<!DOCTYPE html>
<html lang="${options.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isSpanish ? 'Reporte de Entrevista' : 'Interview Report'} - ${interview.respondentName}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="export-container">
    <header class="export-header">
      <h1>${project.name}</h1>
      <p class="subtitle">${isSpanish ? 'Reporte de Entrevista de Validación' : 'Validation Interview Report'}</p>
      <p class="date">${date}</p>
      <span class="badge">${isSpanish ? 'Análisis Científico' : 'Scientific Analysis'}</span>
    </header>
    
    <!-- Respondent Info -->
    <section class="section">
      <h2>👤 ${isSpanish ? 'Información del Entrevistado' : 'Respondent Information'}</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="value" style="font-size: 18px;">${interview.respondentName}</div>
          <div class="label">${isSpanish ? 'Nombre' : 'Name'}</div>
        </div>
        ${interview.respondentRole ? `
        <div class="metric-card">
          <div class="value" style="font-size: 18px;">${interview.respondentRole}</div>
          <div class="label">${isSpanish ? 'Cargo' : 'Role'}</div>
        </div>
        ` : ''}
        ${interview.respondentCity || interview.respondentCountry ? `
        <div class="metric-card">
          <div class="value" style="font-size: 18px;">${[interview.respondentCity, interview.respondentCountry].filter(Boolean).join(', ')}</div>
          <div class="label">${isSpanish ? 'Ubicación' : 'Location'}</div>
        </div>
        ` : ''}
      </div>
    </section>
    
    <!-- Score Overview -->
    <section class="section">
      <h2>📊 ${isSpanish ? 'Puntuación de Validación' : 'Validation Score'}</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="value">${interview.totalScore}%</div>
          <div class="label">${isSpanish ? 'Puntuación Total' : 'Total Score'}</div>
        </div>
        <div class="metric-card">
          <div class="value" style="font-size: 18px; color: var(--${scoreLevel.color});">${scoreLevel.label}</div>
          <div class="label">${isSpanish ? 'Nivel' : 'Level'}</div>
        </div>
      </div>
      
      <h3>${isSpanish ? 'Desglose por Dimensión' : 'Dimension Breakdown'}</h3>
      ${dimensionScoresHTML}
    </section>
    
    <!-- AI Analysis Summary -->
    <section class="section">
      <h2>🤖 ${isSpanish ? 'Análisis de IA' : 'AI Analysis'}</h2>
      ${interview.summary ? `
      <div class="quote">
        "${interview.summary}"
        <div class="attribution">— VALID.AI ${isSpanish ? 'Motor de Análisis' : 'Analysis Engine'}</div>
      </div>
      ` : ''}
      
      <h3>${isSpanish ? 'Insights Clave' : 'Key Insights'}</h3>
      ${insightsHTML}
    </section>
    
    <!-- Detailed Answers -->
    <section class="section">
      <h2>📝 ${isSpanish ? 'Respuestas Detalladas' : 'Detailed Answers'}</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>${isSpanish ? 'Pregunta' : 'Question'}</th>
            <th>${isSpanish ? 'Respuesta' : 'Answer'}</th>
            <th>${isSpanish ? 'Notas' : 'Notes'}</th>
          </tr>
        </thead>
        <tbody>
          ${answersHTML}
        </tbody>
      </table>
    </section>
    
    <footer class="footer">
      <div class="logo">VALID<span>.AI</span></div>
      <p>${isSpanish ? 'Generado con inteligencia artificial' : 'Generated with artificial intelligence'}</p>
      <p>${isSpanish ? 'Powered by Gemini' : 'Powered by Gemini'}</p>
    </footer>
  </div>
</body>
</html>
  `.trim();
}

// ============ BATCH INTERVIEW EXPORT ============

export function generateInterviewBatchExport(
  interviews: Interview[],
  project: ProjectTemplate,
  options: ExportOptions
): string {
  const isSpanish = options.language === 'es';
  const now = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  // Calculate averages
  const avgScore = interviews.length > 0 
    ? Math.round(interviews.reduce((sum, i) => sum + (i.totalScore || 0), 0) / interviews.length)
    : 0;
  
  // Summary table
  const summaryTableHTML = interviews.map((interview, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${interview.respondentName}</strong></td>
      <td>${interview.respondentRole || '-'}</td>
      <td style="text-align: center;">
        <span style="color: ${interview.totalScore >= 70 ? 'var(--success)' : interview.totalScore >= 50 ? 'var(--warning)' : 'var(--danger)'}; font-weight: 600;">
          ${interview.totalScore}%
        </span>
      </td>
      <td>${new Date(interview.date).toLocaleDateString()}</td>
    </tr>
  `).join('');
  
  // Aggregate insights
  const allInsights = interviews.flatMap(i => i.keyInsights || []).slice(0, 10);
  const insightsHTML = allInsights.map(insight => `
    <div class="insight-card">
      <p style="margin: 0;">💡 ${insight}</p>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="${options.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - ${isSpanish ? 'Resumen de Entrevistas' : 'Interview Summary'}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="export-container">
    <header class="export-header">
      <h1>${project.name}</h1>
      <p class="subtitle">${isSpanish ? 'Resumen de Entrevistas de Validación' : 'Validation Interviews Summary'}</p>
      <p class="date">${now}</p>
      <span class="badge">${interviews.length} ${isSpanish ? 'entrevistas analizadas' : 'interviews analyzed'}</span>
    </header>
    
    <!-- Overview -->
    <section class="section">
      <h2>📊 ${isSpanish ? 'Resumen General' : 'Overview'}</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="value">${interviews.length}</div>
          <div class="label">${isSpanish ? 'Total Entrevistas' : 'Total Interviews'}</div>
        </div>
        <div class="metric-card">
          <div class="value">${avgScore}%</div>
          <div class="label">${isSpanish ? 'Puntuación Promedio' : 'Average Score'}</div>
        </div>
        <div class="metric-card">
          <div class="value">${interviews.filter(i => i.totalScore >= 70).length}</div>
          <div class="label">${isSpanish ? 'Alta Validación' : 'High Validation'}</div>
        </div>
      </div>
    </section>
    
    <!-- Interviews Table -->
    <section class="section">
      <h2>👥 ${isSpanish ? 'Todas las Entrevistas' : 'All Interviews'}</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>${isSpanish ? 'Nombre' : 'Name'}</th>
            <th>${isSpanish ? 'Cargo' : 'Role'}</th>
            <th>${isSpanish ? 'Puntuación' : 'Score'}</th>
            <th>${isSpanish ? 'Fecha' : 'Date'}</th>
          </tr>
        </thead>
        <tbody>
          ${summaryTableHTML}
        </tbody>
      </table>
    </section>
    
    <!-- Aggregated Insights -->
    <section class="section">
      <h2>💡 ${isSpanish ? 'Insights Principales' : 'Key Insights'}</h2>
      ${insightsHTML || `<p style="color: var(--text-muted);">${isSpanish ? 'No hay insights disponibles' : 'No insights available'}</p>`}
    </section>
    
    <footer class="footer">
      <div class="logo">VALID<span>.AI</span></div>
      <p>${isSpanish ? 'Generado con inteligencia artificial' : 'Generated with artificial intelligence'}</p>
      <p>${isSpanish ? 'Powered by Gemini' : 'Powered by Gemini'}</p>
    </footer>
  </div>
</body>
</html>
  `.trim();
}

// ============ DEEP RESEARCH EXPORT ============

export function generateDeepResearchExport(
  deepAnalysis: DeepAnalysisReport,
  project: ProjectTemplate,
  options: ExportOptions
): string {
  const isSpanish = options.language === 'es';
  const now = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  // SWOT
  const swotHTML = deepAnalysis.swot ? `
    <div class="metric-grid" style="grid-template-columns: repeat(2, 1fr);">
      <div style="background: rgba(34,197,94,0.1); border-radius: 12px; padding: 20px;">
        <h3 style="color: var(--success); margin-bottom: 10px;">💪 ${isSpanish ? 'Fortalezas' : 'Strengths'}</h3>
        <ul style="list-style: none; padding: 0; color: var(--text-secondary);">
          ${deepAnalysis.swot.strengths?.map(s => `<li style="margin-bottom: 5px;">• ${s}</li>`).join('') || ''}
        </ul>
      </div>
      <div style="background: rgba(239,68,68,0.1); border-radius: 12px; padding: 20px;">
        <h3 style="color: var(--danger); margin-bottom: 10px;">⚠️ ${isSpanish ? 'Debilidades' : 'Weaknesses'}</h3>
        <ul style="list-style: none; padding: 0; color: var(--text-secondary);">
          ${deepAnalysis.swot.weaknesses?.map(w => `<li style="margin-bottom: 5px;">• ${w}</li>`).join('') || ''}
        </ul>
      </div>
      <div style="background: rgba(59,130,246,0.1); border-radius: 12px; padding: 20px;">
        <h3 style="color: #3b82f6; margin-bottom: 10px;">🚀 ${isSpanish ? 'Oportunidades' : 'Opportunities'}</h3>
        <ul style="list-style: none; padding: 0; color: var(--text-secondary);">
          ${deepAnalysis.swot.opportunities?.map(o => `<li style="margin-bottom: 5px;">• ${o}</li>`).join('') || ''}
        </ul>
      </div>
      <div style="background: rgba(245,158,11,0.1); border-radius: 12px; padding: 20px;">
        <h3 style="color: var(--warning); margin-bottom: 10px;">🔥 ${isSpanish ? 'Amenazas' : 'Threats'}</h3>
        <ul style="list-style: none; padding: 0; color: var(--text-secondary);">
          ${deepAnalysis.swot.threats?.map(t => `<li style="margin-bottom: 5px;">• ${t}</li>`).join('') || ''}
        </ul>
      </div>
    </div>
  ` : '';
  
  // Competitors
  const competitorsHTML = deepAnalysis.benchmark?.map(comp => `
    <tr>
      <td><strong>${comp.name}</strong></td>
      <td>${comp.strength}</td>
      <td>${comp.weakness}</td>
      <td>${comp.priceModel}</td>
    </tr>
  `).join('') || '';
  
  // Key Insights
  const insightsHTML = deepAnalysis.keyInsights?.map(insight => `
    <div class="insight-card ${insight.type === 'negative' ? 'danger' : insight.type === 'neutral' ? 'warning' : ''}">
      <strong>${insight.title}</strong>
      <p style="margin: 5px 0 0 0;">${insight.description}</p>
    </div>
  `).join('') || '';
  
  // Strategic Advice
  const adviceHTML = deepAnalysis.strategicAdvice?.map(advice => `
    <li style="margin-bottom: 10px; color: var(--text-secondary);">${advice}</li>
  `).join('') || '';
  
  const verdictColor = deepAnalysis.marketVerdict === 'Go' ? 'success' : 
                       deepAnalysis.marketVerdict === 'Pivot' ? 'warning' : 'danger';
  
  return `
<!DOCTYPE html>
<html lang="${options.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - Deep Research</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="export-container">
    <header class="export-header">
      <h1>${project.name}</h1>
      <p class="subtitle">${isSpanish ? 'Informe de Deep Research' : 'Deep Research Report'}</p>
      <p class="date">${now}</p>
      <span class="badge">${isSpanish ? 'Análisis Avanzado IA' : 'Advanced AI Analysis'}</span>
    </header>
    
    <!-- Verdict -->
    <section class="section">
      <h2>🎯 ${isSpanish ? 'Veredicto de Mercado' : 'Market Verdict'}</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="value">${deepAnalysis.viabilityScore}%</div>
          <div class="label">${isSpanish ? 'Viabilidad' : 'Viability Score'}</div>
        </div>
        <div class="metric-card">
          <div class="value" style="font-size: 24px; color: var(--${verdictColor});">${deepAnalysis.marketVerdict}</div>
          <div class="label">${isSpanish ? 'Recomendación' : 'Recommendation'}</div>
        </div>
      </div>
      
      <div class="quote" style="margin-top: 20px;">
        "${deepAnalysis.earlyAdopterProfile}"
        <div class="attribution">— ${isSpanish ? 'Perfil de Early Adopter' : 'Early Adopter Profile'}</div>
      </div>
    </section>
    
    <!-- SWOT -->
    <section class="section">
      <h2>📋 ${isSpanish ? 'Análisis SWOT' : 'SWOT Analysis'}</h2>
      ${swotHTML}
    </section>
    
    <!-- Competition -->
    ${competitorsHTML ? `
    <section class="section">
      <h2>⚔️ ${isSpanish ? 'Análisis Competitivo' : 'Competitive Analysis'}</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>${isSpanish ? 'Competidor' : 'Competitor'}</th>
            <th>${isSpanish ? 'Fortaleza' : 'Strength'}</th>
            <th>${isSpanish ? 'Debilidad' : 'Weakness'}</th>
            <th>${isSpanish ? 'Modelo de Precio' : 'Price Model'}</th>
          </tr>
        </thead>
        <tbody>
          ${competitorsHTML}
        </tbody>
      </table>
    </section>
    ` : ''}
    
    <!-- Key Insights -->
    <section class="section">
      <h2>💡 ${isSpanish ? 'Insights Clave' : 'Key Insights'}</h2>
      ${insightsHTML}
    </section>
    
    <!-- Strategic Advice -->
    <section class="section">
      <h2>🧭 ${isSpanish ? 'Consejos Estratégicos' : 'Strategic Advice'}</h2>
      <ol style="padding-left: 20px;">
        ${adviceHTML}
      </ol>
    </section>
    
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

// ============ DOWNLOAD UTILITIES ============

export function downloadAsHTML(htmlContent: string, filename: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openForPrint(htmlContent: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

// ============ MAIN EXPORT FUNCTION ============

interface ExportData {
  interview?: Interview;
  interviews?: Interview[];
  deepAnalysis?: DeepAnalysisReport;
  project: ProjectTemplate;
}

export async function exportDocument(
  type: ExportType,
  data: ExportData,
  options: ExportOptions
): Promise<string> {
  let html = '';
  
  switch (type) {
    case 'interview':
      if (!data.interview) throw new Error('Interview data required');
      html = generateInterviewExport(data.interview, data.project, options);
      break;
      
    case 'interview_batch':
      if (!data.interviews) throw new Error('Interviews data required');
      html = generateInterviewBatchExport(data.interviews, data.project, options);
      break;
      
    case 'deep_research':
      if (!data.deepAnalysis) throw new Error('Deep analysis data required');
      html = generateDeepResearchExport(data.deepAnalysis, data.project, options);
      break;
      
    default:
      throw new Error(`Export type '${type}' not supported yet`);
  }
  
  return html;
}
