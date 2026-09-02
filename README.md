# Carátula Netflix

Carátula personalizada estilo Netflix, construida con React + Vite.

## Configuración

Toda la personalización inicial está en:

`src/config.js`

Puedes configurar:

- Foto principal
- 5 fotos inferiores
- Foto de avatar
- Título

Las imágenes se pueden proporcionar mediante URLs públicas HTTPS.

## Verificación de acceso

El editor está protegido por una pantalla de acceso privado basada en la pantalla de inicio de sesión del proyecto de referencia Netflix Memories. La autenticación se realiza mediante una Cloudflare Pages Function y una cookie de sesión HttpOnly; las credenciales no se guardan en el código del navegador.

En Cloudflare Pages configura estas variables de entorno:

- `ADMIN_USERNAME` — usuario de acceso
- `ADMIN_PASSWORD` — contraseña de acceso
- `ADMIN_SESSION_SECRET` — secreto largo y aleatorio para firmar la sesión

La Function utilizada es:

`functions/admin-auth.js`

En producción debe estar desplegado sobre HTTPS para que la cookie segura de sesión funcione correctamente.

## Ejecutar en local

```bash
npm install
npm run dev
```

La pantalla de verificación se muestra en el editor, pero el endpoint `/admin-auth` debe ejecutarse con el entorno de Cloudflare Pages para validar las credenciales.

## Crear versión de producción

```bash
npm run build
npm run preview
```
