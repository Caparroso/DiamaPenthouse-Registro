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

Para conexiones móviles, los tres audios se cargan únicamente después de la
interacción del usuario. La portada tiene prioridad y el flyer completo se
carga de forma diferida cuando la persona se acerca a la sección de lineup.

## Imágenes

Las secciones con texto usan las fotografías limpias
`assets/diama-stairs-clean.jpg` y `assets/diama-sink-clean.jpg`. El flyer oficial
con lineup se conserva completo dentro de la sección **LINEUP**.

El lineup confirmado es: Fedra, Grupo Precario, íA, Caparroso, Firefly light y
1galgo.

La hora oficial del evento es **7:30 PM** y aparece en la portada, la sección
de ubicación, el boleto, el QR y el registro enviado a Formspree.

En celular, el título principal reduce su escala para no salirse de la pantalla
y el flyer del lineup se muestra completo, sin recortar los laterales.

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

`assets/flyer-final.jpg` es la tarjeta social provisional. Cuando tengas la URL final de GitHub
Pages, reemplaza en `index.html` el valor relativo de `og:image` y
`twitter:image` por la URL completa de esa imagen para mejorar la vista previa
en WhatsApp, iMessage y redes sociales.
