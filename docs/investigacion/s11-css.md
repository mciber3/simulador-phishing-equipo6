Ficha S11: CSS y Diseño Responsive (Etapa 2)

Resumen (128 palabras)
El diseño web adaptable bajo el enfoque mobile-first consiste en construir primero la interfaz para pantallas pequeñas (hasta 600 px) e incorporar progresivamente reglas para pantallas medianas y grandes mediante consultas de medios (`@media`). Para mantener la consistencia visual y cumplir con el nivel de contraste AA de las pautas WCAG 2.2, se emplean variables CSS en `:root`. Asimismo, el modelo de caja ajustado con `box-sizing: border-box` garantiza que los rellenos (`padding`) y bordes no desborden el ancho del contenedor. Finalmente, la combinación de Flexbox para alinear barras de navegación o botones en una dimensión, junto con CSS Grid para distribuir controles de filtrado en múltiples columnas, permite estructurar interfaces limpias sin recurrir a librerías externas.

## Respuestas a las preguntas guía
1. ¿Qué regla gana cuando dos selectores compiten
   Gana el selector con mayor especificidad (un ID `#id` pesa más que una clase `.clase`, y una clase pesa más que una etiqueta `p`). Si ambos tienen exactamente la misma especificidad, gana la regla que esté escrita más abajo en la hoja de estilos (cascada).
2. ¿Qué cambia entre `content-box` y `border-box`?
   En `content-box` (valor por defecto), el `padding` y el `border` se suman al `width` definido, agrandando la caja. En `border-box`, el `width` incluye contenido, relleno y borde, evitando que los `input` con `width: 100%` se salgan de su tarjeta.
3. ¿Cómo funcionan Flexbox, Grid y una media query?
   - Flexbox (`display: flex`):** Ordena elementos en una sola dirección (fila o columna), ideal para la cabecera y el menú.
   - Grid (`display: grid`): Crea una cuadrícula bidimensional de filas y columnas (`grid-template-columns`), ideal para alinear los selectores de filtros.
   - Media query (`@media`): Aplica un bloque de estilos CSS únicamente cuando la pantalla cumple una condición de ancho, como `@media (min-width: 601px)` y `@media (min-width: 961px)`.

Aplicación en nuestro proyecto
Definimos colores institucionales en `:root` (`--principal: #16325c`), aplicamos `box-sizing: border-box` globalmente, usamos Flexbox en `.cabecera` y `nav`, y empleamos Grid en `.filtros` pasando de 1 columna en móvil a 2 en tableta (601 px) y 4 en escritorio (961 px).

Referencias (APA 7)
- Mozilla. (s. f.). Diseño web adaptable y Media Queries. MDN Web Docs. https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Responsive_Design
- W3C. (2023). Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/