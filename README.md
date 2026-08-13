# Diama. Penthouse — versión estática

Esta carpeta contiene la invitación completa y puede abrirse directamente en
VS Code con **Live Server**.

## Abrir localmente

1. Abre esta carpeta en VS Code.
2. Haz clic derecho sobre `index.html`.
3. Selecciona **Open with Live Server**.

No requiere instalar Node, npm ni dependencias.

## Audio

- El botón **SUBIR AL PENTHOUSE** activa el sonido del ascensor.
- El bell suena un segundo antes de llegar a `PH`.
- Al entrar a la invitación comienza `assets/dk-ambience.mp3` en loop.
- El ambiente se pausa al cambiar de pestaña o salir de la página y continúa al volver.
- El control **SOUND ON / SOUND OFF** también está disponible dentro de la invitación.

Los navegadores móviles exigen un primer toque para permitir audio; por eso la
experiencia sonora se desbloquea desde el botón inicial.

## Imágenes

La portada inicial usa `assets/penthouse-intro.png` como pieza completa. En
pantallas verticales se conserva toda la composición sobre un fondo expandido;
en pantallas horizontales ocupa el viewport completo.

Las secciones con texto usan las fotografías limpias
`assets/diama-stairs-clean.jpg` y `assets/diama-sink-clean.jpg`. El flyer oficial
con lineup se conserva completo dentro de la sección **LINEUP**.

## Marca

La marca siempre se escribe **Diama.**: `D` mayúscula, resto en minúsculas y
punto final obligatorio. El wordmark oficial está incluido como
`assets/diama-logo.png`.

## Subir a GitHub Pages

Sube todo el contenido de esta carpeta conservando la estructura:

```text
index.html
styles.css
script.js
assets/
vendor/
```

Después activa GitHub Pages desde la rama y carpeta donde subiste los archivos.

## Registro

El formulario está conectado a:

```text
https://formspree.io/f/xeajkvqp
```

Formspree recibe nombre, Instagram opcional, token, fecha de registro y evento.

## Vista previa al compartir

`assets/penthouse-intro.png` es la tarjeta social provisional. Cuando tengas la URL final de GitHub
Pages, reemplaza en `index.html` el valor relativo de `og:image` y
`twitter:image` por la URL completa de esa imagen para mejorar la vista previa
en WhatsApp, iMessage y redes sociales.
