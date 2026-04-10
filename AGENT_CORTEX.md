# AGENT_CORTEX — Valid.AI Architectural Decisions

## Session Log: 2026-04-10

### [DECISIÓN] Bypass de GlassCard para Widgets de Landing
- **Rationale**: El componente `GlassCard` estándar en `LandingPage.tsx` utiliza un contenedor flex con padding interno que impedía el uso de fondos full-width (sangre total) y causaba franjas laterales grises/blancas en el widget de voz.
- **Outcome**: Se implementó una estructura de `div` directo con fondo `#070707` y posicionamiento absoluto para lograr un centrado óptico perfecto del AI Core y animaciones de partículas sin restricciones de layout heredadas.

### [DECISIÓN] Implementación de "Truth as a Service" Pipeline
- **Rationale**: El diseño anterior era demasiado ruidoso (láseres, degradados agresivos) y no comunicaba el valor de negocio (ROI).
- **Outcome**: Se reemplazó por una cuadrícula quirúrgica de 4 fases (Hypothesis, Neural Truth, Capital Efficiency, Roadmap) centrada en el ahorro de **$20k+** en R&D. Se eliminaron animaciones de fondo disruptivas para mantener el estilo "Noir Editorial" senior.

### [DECISIÓN] Consolidación de Tech Stack Editorial
- **Rationale**: Mantener coherencia visual entre el Hero y las secciones de valor.
- **Outcome**: Uso de tipografía `Plus Jakarta Sans`, pesos `bold` y `tracking-tight`, y acentos `text-neon` (Emerald/Cyan) dosificados. Eliminación de efectos iridiscentes en secciones de soporte para evitar "Hero fatigue".

---
*Este log es mantenido automáticamente por Antigravity para persistencia de contexto.*
