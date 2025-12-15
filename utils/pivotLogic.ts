
interface PivotRecommendation {
  type: 'warning' | 'pivot' | 'success';
  title: string;
  message: string;
  strategy: string; // The "Consultant" advice
}

export const analyzePivotNeeds = (
  scores: {
    problemIntensity: number;
    willingnessToPay: number;
    marketSize: number;
  }
): PivotRecommendation | null => {
  const { problemIntensity, willingnessToPay } = scores;

  // 1. The "False Positive" (High Problem, No Money)
  if (problemIntensity > 75 && willingnessToPay < 40) {
    return {
      type: 'warning',
      title: 'Trampa de "Buen Problema"',
      message: 'Los usuarios dicen que es un problema grave, pero NO pagarían por solucionarlo.',
      strategy: 'Cambia a modelo Freemium o Ad-supported. O busca un nicho con más presupuesto (B2B).'
    };
  }

  // 2. The "Solution looking for a problem" (High Pay intent, Low Problem?) - Rare but possible "Vitamin"
  if (willingnessToPay > 70 && problemIntensity < 40) {
    return {
      type: 'pivot',
      title: 'Riesgo de Producto "Vitamina"',
      message: 'Pagarían, pero el dolor no es agudo. Puede ser una compra impulsiva o de bajo LTV.',
      strategy: 'Posiciónalo como un producto de lujo/estatus o aumenta la urgencia artificialmente.'
    };
  }

  // 3. The "Ghost Town" (Low Everything)
  if (problemIntensity < 40 && willingnessToPay < 40 && problemIntensity > 0) {
    return {
      type: 'pivot',
      title: 'Zona de Indiferencia',
      message: 'Ni les duele, ni pagarían. Estás validando la idea equivocada.',
      strategy: 'Pivota drásticamente. Haz entrevistas exploratorias sin mencionar tu solución.'
    };
  }

  // 4. Unicorn Territory
  if (problemIntensity > 80 && willingnessToPay > 80) {
    return {
      type: 'success',
      title: 'Territorio Unicornio 🦄',
      message: 'Alta intensidad y alta disposición a pagar. ¡Construye rápido!',
      strategy: 'Enfocate en retención y escalamiento. El PMF está cerca.'
    };
  }

  return null;
};
