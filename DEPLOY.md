# 🚀 Guía de Despliegue Rápido (Vercel)

Sigue estos pasos para publicar tu aplicación **VALID.AI** gratis y compartirla con tus amigos.

## 1. Preparación (Ya realizada)

He creado los archivos necesarios para que todo funcione en la nube:

- `vercel.json`: Configuración para que la app funcione como una sola página (SPA).
- `firestore.rules`: Reglas de seguridad para que cada usuario solo vea sus propios datos.

## 2. Subir a GitHub (Requisito para Vercel)

Si aún no has subido este código a GitHub:

1. Crea un nuevo repositorio en [GitHub](https://github.com/new).
2. Sube los archivos de esta carpeta al repositorio.

## 3. Desplegar en Vercel (Gratis)

1. Ve a [vercel.com](https://vercel.com) y regístrate (puedes usar tu cuenta de GitHub).
2. Haz clic en **"Add New..."** -> **"Project"**.
3. Selecciona el repositorio de GitHub que acabas de crear.
4. En la configuración del proyecto ("Configure Project"):
   - **Framework Preset**: Vercel detectará "Vite" automáticamente. Si no, selecciónalo.
   - **Environment Variables**: Despliega esta sección y agrega las siguientes variables (copia los valores de tu archivo `.env` o `firebase.ts`):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_GEMINI_API_KEY`
5. Haz clic en **"Deploy"**.

## 4. Configurar Seguridad en Firebase (Importante)

Para que las reglas de seguridad funcionen:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2. Selecciona tu proyecto.
3. Ve a **Firestore Database** -> pestaña **Rules**.
4. Copia el contenido del archivo `firestore.rules` que he creado en tu carpeta y pégalo allí.
5. Haz clic en **Publicar**.

## ¡Listo! 🎉

Vercel te dará un enlace (ej: `valid-ai.vercel.app`). Compártelo con tus amigos. Ellos podrán iniciar sesión con sus propias cuentas de Google y sus datos estarán totalmente separados de los tuyos.
