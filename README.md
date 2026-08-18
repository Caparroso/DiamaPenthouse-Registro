# La Merecida Burger

Base estática optimizada para GitHub Pages. Incluye el dominio personalizado y 27 imágenes de producto en formato WebP, organizadas en hamburguesas, Baby burgers, fries y postres.

La versión actual renderiza directamente como HTML y JavaScript local. No depende de React, Babel ni CDNs de JavaScript para mostrar el contenido inicial.

Base web estática para GitHub Pages.

## Estructura

- `index.html`: contenido, estilos y configuración principal.
- `support.js`: comportamiento de los componentes de la página.
- `image-slot.js`: presentación de los espacios gráficos.
- `assets/`: imágenes que utiliza el sitio.

## Publicar en GitHub Pages

Sube todo el contenido de esta carpeta a la raíz del repositorio. Después abre **Settings → Pages**, selecciona **Deploy from a branch**, elige `main` y `/ (root)`, y guarda.

## Actualizaciones

Mantén las rutas relativas, por ejemplo `assets/imagen.webp`, para que el sitio funcione tanto en GitHub Pages como en una dirección propia.

Esta versión no contiene recursos Base64, no muestra `Unpacking…` y no reconstruye el documento al abrirlo.
