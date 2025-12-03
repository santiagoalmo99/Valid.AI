
# 🧬 Cuestionario de Validación: Holistic Biohacking Colombia

**Target:** Personas que invierten en optimización integral (belleza, salud, bienestar, longevidad)  
**Perfil:** "Holistic Optimizers" - Tech-savvy, 28-45 años, ingresos medios-altos  
**Duración estimada:** 12-15 minutos  
**Fecha:** Diciembre 2025

---

## 📌 Instrucciones para el Entrevistador

- **Objetivo:** Validar si existe dolor real por la desconexión de datos entre belleza, salud y suplementación
- **Tono:** Conversacional, curioso, nunca vendedor
- **Técnica:** Dejar que hablen libremente en preguntas abiertas, profundizar en contradicciones
- **Registro:** Grabar respuesta larga (cualitativa) + valor medible (cuantitativa) en cada pregunta

---

## 🎯 Sección 1: Contexto y Comportamiento Actual (Setup)

### P1. ¿Podrías describir tu "rutina de optimización" típica en una semana?
**Tipo:** Texto largo (cualitativa)  
**Objetivo:** Entender complejidad y nivel de compromiso sin preguntar directamente  
**Buscar en respuesta:**
- ¿Menciona múltiples categorías? (skincare + suplementos + ejercicio + sueño)
- ¿Usa términos avanzados? (biohacking, stack, protocolo, tracking)
- ¿Qué tan estructurado suena?

**Seguimiento medible:**
¿Cuántas categorías diferentes mencionaste?
- [ ] 1-2 (solo skincare o solo ejercicio)
- [ ] 3-4 (empieza a ser holístico)
- [ ] 5+ (definitivamente un "optimizer")

**Dimensión:** `currentBehavior`  
**Peso:** 0.08

---

### P2. Del 1 al 10, ¿qué tan satisfecho/a estás con los resultados que ves actualmente?
**Tipo:** Escala 1-10  
**Mapping:** 1-3→10 (muy insatisfecho, alto dolor), 4-6→5, 7-8→2, 9-10→0 (satisfecho, no necesita app)  
**Dimensión:** `painPoint`  
**Peso:** 0.12  
⭐ **PREGUNTA CRÍTICA**

**Insight clave:** Si responde 9-10, probablemente no es tu target (ya encontró su sistema). Si 1-6, hay oportunidad.

---

## 💰 Sección 2: Inversión y Gasto Real

### P3. ¿Cada cuánto renuevas/compras tus productos de skincare?
**Tipo:** Select  
**Opciones:**
- [ ] No uso productos especializados
- [ ] Cada 4-6 meses (básico)
- [ ] Cada 2-3 meses (regular)
- [ ] Mensualmente (frecuente)
- [ ] Tengo suscripción/compro constantemente

**Mapping:** No uso→0, 4-6 meses→3, 2-3 meses→6, Mensual→9, Suscripción→10  
**Dimensión:** `problemIntensity`  
**Peso:** 0.15

---

### P4. Aproximadamente, ¿cuánto gastas cuando renuevas tu skincare? (en COP)
**Tipo:** Select  
**Opciones:**
- [ ] $0 - $150,000 COP
- [ ] $151,000 - $400,000 COP
- [ ] $401,000 - $800,000 COP
- [ ] $801,000 - $1,500,000 COP
- [ ] Más de $1,500,000 COP

**Mapping:** 0-150K→2, 151-400K→5, 401-800K→7, 801K-1.5M→9, 1.5M+→10  
**Dimensión:** `problemIntensity`  
**Peso:** 0.12

**Cálculo automático para el análisis:**
Gasto Mensual Equivalente = (Respuesta P4) / (Frecuencia P3 en meses)

---

### P5. ¿Tomas suplementos actualmente? Si sí, ¿cuáles y cuánto gastas al mes aproximadamente?
**Tipo:** Texto largo + Select

**Respuesta abierta:** *(Dejar que listen suplementos, marcas, razones)*

**Seguimiento medible:**
¿Cuánto gastas mensualmente en suplementos? (COP)
- [ ] No tomo suplementos ($0)
- [ ] $50,000 - $150,000
- [ ] $151,000 - $300,000
- [ ] $301,000 - $500,000
- [ ] Más de $500,000

**Mapping:** 0→0, 50-150K→4, 151-300K→7, 301-500K→9, 500K+→10  
**Dimensión:** `problemIntensity`  
**Peso:** 0.18  
⭐ **PREGUNTA CRÍTICA**

---

### P6. ¿Usas algún wearable o dispositivo de tracking? (reloj inteligente, anillo, etc)
**Tipo:** Select múltiple (permitir varias opciones)

**Opciones:**
- [ ] No uso ninguno
- [ ] Apple Watch
- [ ] Oura Ring
- [ ] Whoop
- [ ] Fitbit
- [ ] Garmin
- [ ] Xiaomi Mi Band u otro básico
- [ ] Dispositivos médicos (glucómetro continuo, etc)

**Mapping:** 
- No uso→0
- Apple Watch/Fitbit/Xiaomi→5
- Oura/Whoop/Garmin→10
- Múltiples dispositivos→10 + bonus

**Dimensión:** `earlyAdopter`  
**Peso:** 0.08

---

## 🔍 Sección 3: Pain Points Ocultos (El Oro)

### P7. Si tuvieras que elegir 3 cosas de tu rutina actual que ELIMINARÍAS porque no estás seguro/a de si realmente funcionan, ¿cuáles serían?
**Tipo:** Texto largo  
**Objetivo:** Detectar incertidumbre y desperdicio percibido  

**Buscar señales:**
- ¿Menciona suplementos caros? (colágeno, NMN, etc) → Alto pain point
- ¿Dice "no sé" o "creo que sí funciona"? → Incertidumbre = oportunidad
- ¿Menciona productos/hábitos caros? → Más dolor

**Seguimiento medible:**
¿Cuántas cosas mencionaste con incertidumbre?
- [ ] 0 (todo funciona bien)
- [ ] 1 cosa
- [ ] 2 cosas
- [ ] 3+ cosas

**Mapping:** 0→0, 1→4, 2→7, 3+→10  
**Dimensión:** `painPoint`  
**Peso:** 0.15  
⭐ **PREGUNTA CRÍTICA** - Esta revela el dolor real

---

### P8. ¿Alguna vez has intentado cruzar tus datos de sueño/estrés con cambios visibles en tu piel, energía o peso? ¿Cómo lo haces?
**Tipo:** Texto largo + Boolean

**Respuesta abierta:** *(Escuchar el método, si existe)*

**Seguimiento medible:**
¿Logras cruzar efectivamente estos datos?
- [ ] Sí, tengo un sistema que funciona
- [ ] Lo intento "a ojo" pero es impreciso
- [ ] No, nunca lo he hecho
- [ ] No, pero me gustaría poder hacerlo

**Mapping:** Tengo sistema→2, A ojo→7, Nunca→5, Me gustaría→10  
**Dimensión:** `painPoint`  
**Peso:** 0.10

**Insight:** Si dice "A ojo" o "Me gustaría" → Validación de que el problema existe

---

### P9. Del 1 al 10, ¿qué tan seguro/a estás de que tu suplemento MÁS CARO está generando un efecto real y medible?
**Tipo:** Escala 1-10

**Mapping:** 1-3→10 (inseguro total, necesita app), 4-6→7, 7-8→4, 9-10→0 (seguro, no necesita)  
**Dimensión:** `painPoint`  
**Peso:** 0.12

**Pregunta trampa:** Cruza con P5 para ver si hay inconsistencia. Si gasta $500K+ en suplementos pero responde 1-4 → ALTO dolor y potencial cliente ideal.

---

### P10. ¿Has comprado algún producto (crema, suplemento, gadget) que te prometieron resultados específicos pero después de X meses NO viste cambios claros?
**Tipo:** Boolean + Texto

**Respuesta:**
- [ ] Sí, me ha pasado → ¿Cuánto dinero aproximadamente perdiste? ________
- [ ] No, todo lo que compro funciona

**Mapping:** Sí + perdió >$500K→10, Sí + perdió $200-500K→7, Sí + <$200K→5, No→0  
**Dimensión:** `painPoint`  
**Peso:** 0.08

---

### P11. ¿Cuál es tu mayor frustración con tu rutina actual de optimización?
**Tipo:** Texto largo (dejar hablar libremente)

**Objetivo:** Capturar pain points que no anticipamos

**Buscar:**
- "No veo resultados claros"
- "Es caro y no sé si vale la pena"
- "Tengo muchos datos pero no sé qué hacer con ellos"
- "Es complicado/tedioso"
- "No puedo medir si funciona"

**Dimensión:** `painPoint` (cualitativo, no puntúa directamente pero alimenta insights de IA)  
**Peso:** 0.05

---

## 📊 Sección 4: Correlación y Tracking (Behavior)

### P12. ¿Llevas algún tipo de registro de tu rutina? (diario, app, Excel, fotos, etc)
**Tipo:** Select

**Opciones:**
- [ ] No llevo ningún registro
- [ ] Fotos ocasionales (sin fechas ni notas)
- [ ] Notas mentales / memoria
- [ ] Fotos con fechas + notas en papel/Notes app
- [ ] App especializada para una cosa (solo skincare o solo suplementos)
- [ ] Sistema completo (múltiples apps o Excel detallado)

**Mapping:** No→0, Fotos→3, Notas→2, Fotos+Notas→6, App→8, Sistema→10  
**Dimensión:** `earlyAdopter`  
**Peso:** 0.10

---

### P13. ¿Qué apps de salud/bienestar usas actualmente? (lista)
**Tipo:** Texto corto (tags múltiples)

**Ejemplos:** Apple Health, Oura App, MyFitnessPal, Cronometer, Flo, Skin Bliss, Notion, Excel personalizado, etc.

**Dimensión:** `currentBehavior` (cualitativo para análisis competitivo)  
**Peso:** 0.03

**IA debe extraer:** Número de apps, categorías cubiertas, si hay overlap/redundancia

---

### P14. ¿Has notado patrones entre tu estilo de vida y tu apariencia/energía? (Ej: "Cuando duermo mal, me salen más granos", "Si tomo X suplemento, tengo más energía")
**Tipo:** Texto largo

**Objetivo:** Ver si ya están haciendo correlaciones mentales (valida hipótesis)

**Seguimiento:**
¿Cuántos patrones claros has identificado por tu cuenta?
- [ ] 0 (ninguno)
- [ ] 1-2 patrones
- [ ] 3-5 patrones
- [ ] Muchos (6+)

**Mapping:** 0→2, 1-2→5, 3-5→8, 6+→10  
**Dimensión:** `currentBehavior`  
**Peso:** 0.07

---

## 💡 Sección 5: Solución e Interés (Solution Fit)

### P15. Imagina que existiera una app que pudiera leer automáticamente tus datos de wearable (sueño, estrés), escanear tu rostro con IA cada mañana, saber qué suplementos/productos usas, y al final del mes te dijera: "Tu piel mejoró 18% en las semanas que dormiste 7+ horas y tomaste Magnesio, pero el Colágeno ($200K/mes) no mostró impacto medible." ¿Qué tanto valor tendría eso para ti?
**Tipo:** Escala 1-5 + Texto explicativo

**Escala:**
- [ ] 1 - Nada de valor
- [ ] 2 - Poco valor
- [ ] 3 - Algo de valor
- [ ] 4 - Bastante valor
- [ ] 5 - Muchísimo valor, lo necesito YA

**Mapping:** 1→0, 2→3, 3→5, 4→8, 5→10  
**Dimensión:** `solutionFit`  
**Peso:** 0.25  
⭐ **PREGUNTA CRÍTICA**

**Texto abierto:** ¿Por qué le diste ese puntaje? *(Buscar objeciones o validaciones)*

---

### P16. Si esa app existiera, ¿cuánto estarías dispuesto/a a pagar mensualmente? (COP)
**Tipo:** Select

**Opciones:**
- [ ] $0 - No pagaría, prefiero gratis
- [ ] $20,000 - $40,000 COP/mes
- [ ] $41,000 - $70,000 COP/mes
- [ ] $71,000 - $100,000 COP/mes
- [ ] Más de $100,000 COP/mes

**Mapping:** 0→0, 20-40K→5, 41-70K→8, 71-100K→10, 100K+→10  
**Dimensión:** `willingnessToPay`  
**Peso:** 0.30  
⭐ **PREGUNTA CRÍTICA**

**Pregunta de control (después de responder):**
*"Interesante. Mencionaste antes que gastas aproximadamente $XXX en suplementos y $YYY en skincare al mes. ¿Te parece que [precio app] es caro, barato o justo en comparación?"*

**Objetivo:** Ver si hay consistencia. Si gasta $500K+ en su stack pero dice que $60K/mes es "caro" → Red flag.

---

### P17. ¿Qué features específicas te gustaría que tuviera esa app? (abierta)
**Tipo:** Texto largo

**Objetivo:** Descubrir demanda de features no anticipadas

**Buscar:**
- Integración con médicos/dermatólogos
- Comunidad/comparación con otros
- Recomendaciones de compra
- Análisis de ingredientes
- Alertas/recordatorios
- Exportar reportes para mostrar a profesionales

**Dimensión:** `featureWishlist` (cualitativo, no puntúa pero crítico para MVP)

---

## 🎯 Sección 6: Early Adopter Signals

### P18. Si lanzáramos una beta privada de esta app en los próximos 3 meses, ¿te interesaría probarla?
**Tipo:** Select

**Opciones:**
- [ ] Sí, quiero probarla cuanto antes (beta tester ideal)
- [ ] Sí, pero prefiero esperar a que esté más pulida
- [ ] Tal vez, depende de las features
- [ ] No me interesa

**Mapping:** Sí cuanto antes→10, Sí pero pulida→7, Tal vez→4, No→0  
**Dimensión:** `earlyAdopter`  
**Peso:** 0.10

---

### P19. ¿Me darías tu email para enviarte acceso anticipado a la beta (gratis los primeros 3 meses)?
**Tipo:** Email input

**Opciones:**
- [ ] Sí, aquí está: _______________________
- [ ] Prefiero no dar mi email ahora

**Mapping:** Dio email→10, No dio→0  
**Dimensión:** `earlyAdopter`  
**Peso:** 0.12  
⭐ **PREGUNTA CRÍTICA** - Valida interés real vs. educación

**Red flag:** Si respondió "5" en P15 (muchísimo valor) y "Sí cuanto antes" en P18, pero NO da email → Inconsistencia, respuesta educada.

---

## 🔥 Sección 7: La Pregunta Secreta (Regret Minimization)

### P20. Si pudieras pedirle un consejo a alguien que lleva 10 años optimizándose y ahorró mucho dinero y tiempo porque descubrió qué funciona y qué no, ¿qué le preguntarías?
**Tipo:** Texto largo

**Objetivo:** Capturar aspiraciones y miedos profundos que revelan el dolor no articulado

**Buscar:**
- Preguntas sobre "qué funciona realmente"
- Preguntas sobre "qué fue desperdicio de dinero"
- Preguntas sobre "cuánto tiempo toma ver resultados"
- Preguntas sobre "cómo saber si algo funciona"

**Dimensión:** `deepPainPoint` (cualitativo, alimenta IA insights)  
**Peso:** 0.05

**Insight clave:** Esta pregunta revela lo que NO te atreves a preguntar directamente. Si mencionan desperdicio de dinero o tiempo → Validación masiva.

---

## 📋 Resumen de Dimensiones y Pesos

| Dimensión | Peso Total | Preguntas Clave |
|-----------|------------|-----------------|
| `problemIntensity` | 0.30 | P3, P4, P5 (gasto real) |
| `willingnessToPay` | 0.25 | P16 (precio) |
| `solutionFit` | 0.25 | P15 (valor percibido) |
| `painPoint` | 0.15 | P2, P7, P8, P9, P10, P11 |
| `earlyAdopter` | 0.10 | P6, P12, P18, P19 |
| `currentBehavior` | 0.10 | P1, P13, P14 |

**Total:** 1.0 (100%)

---

## 🎯 Umbrales de Validación Actualizados

### Mínimos para BUILD MVP:

1. ✅ **Total entrevistas:** ≥12 (ideal: 18+)
2. ✅ **Score promedio:** ≥7.0 (más exigente que antes)
3. ✅ **% gasta >$500K/mes en su stack:** ≥40% (ideal: 60%+)
4. ✅ **% tiene wearable avanzado (Oura/Whoop/Apple Watch):** ≥50%
5. ✅ **% WTP >$60K/mes:** ≥30% (ideal: 50%+)
6. ✅ **% dio email:** ≥70% (ideal: 80%+)
7. ✅ **% tiene 3+ cosas con incertidumbre (P7):** ≥50% (valida el dolor)
8. ✅ **% respondió 1-6 en satisfacción (P2):** ≥60% (valida insatisfacción)

### Veredicto:

- **≥6/8 umbrales cumplidos** → 🚀 **BUILD MVP**
- **4-5/8 umbrales** → ⚠️ **PIVOTAR** (ajustar propuesta de valor o target)
- **0-3/8 umbrales** → ❌ **DESCARTAR** (problema no validado o target incorrecto)

---

## 🚨 Red Flags a Detectar

### 🚩 Red Flag 1: Inconsistencia de Gasto vs WTP
Si gasta $600K+/mes en su stack pero solo pagaría $20K/mes por la app → No valora la solución realmente.

### 🚩 Red Flag 2: Interés Verbal sin Email
Responde 5/5 en P15 y "Sí, beta YA" en P18, pero no da email → Respuesta educada, no buyer real.

### 🚩 Red Flag 3: Satisfacción Alta (P2: 9-10) + Gasto Alto
Si está súper satisfecho, no es tu target. La app es para los frustrados.

### 🚩 Red Flag 4: No Usa Wearables + WTP Bajo
Si no trackea nada y no quiere pagar → No es "Holistic Optimizer", es casualty.

### 🚩 Red Flag 5: No Identifica Patrones (P14: 0)
Si lleva años optimizándose pero nunca ha notado correlaciones → Falta de awareness, no es early adopter.

---

## 💡 Preguntas de Profundización (Follow-ups)

Usa estas después de respuestas clave para sacar oro:

### Después de P7 (eliminarías 3 cosas):
*"¿Por qué sigues usando X si no estás seguro de que funciona?"*  
→ Revela creencias irracionales o presión social

### Después de P9 (seguridad del suplemento caro):
*"¿Qué tendría que pasar para que estuvieras 100% seguro?"*  
→ Revela qué evidencia necesitan (fotos, datos, expertos)

### Después de P16 (WTP):
*"Si el precio fuera $XXX pero te ahorrara $YYY al mes en productos que no funcionan, ¿cambiaría tu respuesta?"*  
→ Valida si entienden el ROI

---

## 📊 Análisis Post-Entrevista

### Calcular automáticamente:

1. **Stack Spend Total** = (Skincare P4 amortizado) + (Suplementos P5) + (Wearables amortizados)
2. **Uncertainty Index** = (P7 cosas inciertas × P9 inseguridad suplemento) / 10
3. **Tech Maturity Score** = (P6 wearable × 0.4) + (P12 tracking × 0.3) + (P13 # apps × 0.3)
4. **Pain vs WTP Ratio** = (P2 insatisfacción + P7 + P8 + P9) / (P16 WTP)  
   → Si ratio >2 → Alto dolor pero bajo WTP (problema: precio o no entienden valor)

---

## 🎓 Notas para el Análisis con IA

### Prompts para Gemini después de recolectar datos:

1. **Segmentación:**
   *"Analiza estas 15 entrevistas y crea 3-4 arquetipos de usuarios basado en gasto, dolor, tech maturity. Dame nombres, características, % del sample, y prioridad para MVP."*

2. **Feature Extraction:**
   *"De las respuestas P17, extrae las 10 features más mencionadas y rankéalas. Agrupa similares (ej: 'integración con doctor' y 'exportar para médico' son lo mismo)."*

3. **Pain Point Clustering:**
   *"Analiza P7, P9, P11, P20 y encuentra 5 pain points comunes. ¿Cuál es el más intenso según frecuencia y emoción del lenguaje?"*

4. **Correlation Discovery:**
   *"Cruza P2 (satisfacción), P5 (gasto suplementos), P7 (incertidumbre), P9 (seguridad). ¿Hay patrones? ¿Los que gastan más están más o menos satisfechos?"*

5. **Red Flags Detection:**
   *"Identifica entrevistas con inconsistencias entre: alto interés (P15/P18) pero no dan email (P19), o alto gasto (P4+P5) pero bajo WTP (P16). Estas son respuestas educadas, no clientes reales."*

---

## ✅ Checklist Pre-Entrevista

Antes de cada entrevista, verifica:

- [ ] Audio/video grabando (para análisis de IA de lenguaje)
- [ ] Tienes calculadora para convertir gastos semestrales → mensuales
- [ ] Contexto del entrevistado (¿cómo llegó? ¿Instagram? ¿Referido?)
- [ ] Preguntas de warm-up listas (romper hielo)
- [ ] Timer (no pasar de 20 minutos)

---

## 🚀 Siguiente Paso

Después de recolectar 12-18 entrevistas:

1. **Subir a VALID.AI** (la app de validación que construiremos)
2. **Gemini analiza** y genera:
   - Score total por entrevistado
   - Dashboard con gráficos
   - Top 10 insights
   - 3-4 arquetipos de usuarios
   - Features prioritarias
   - Veredicto: BUILD/PIVOT/DISCARD
3. **Exportar reporte ejecutivo** PDF con toda la evidencia

---

**Fin del Cuestionario**  
**Versión:** 1.0 - Holistic Biohacking Colombia  
**Fecha:** Diciembre 2025
