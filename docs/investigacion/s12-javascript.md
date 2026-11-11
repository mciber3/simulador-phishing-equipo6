Ficha S12: JavaScript Aplicado y Manipulación del DOM (Etapa 3)

Resumen (119 palabras)
JavaScript permite dotar de interactividad a un sitio web mediante la manipulación del Modelo de Objetos del Documento (DOM), el cual representa la estructura HTML como un árbol de nodos en memoria. A través de métodos nativos, el programa escucha eventos del usuario, crea filas de tabla dinámicamente y actualiza contadores sin recargar la página. Para conservar la información en el navegador, se utiliza la API `localStorage`, convirtiendo arreglos de objetos a texto mediante `JSON.stringify` al guardar y reconstruyéndolos con `JSON.parse` al leer. Finalmente, por seguridad informática, todo dato ingresado por el usuario se inserta exclusivamente con la propiedad `textContent` en lugar de `innerHTML`, impidiendo que el navegador interprete etiquetas maliciosas y previniendo ataques de tipo Cross-Site Scripting (XSS).

Respuestas a las preguntas guía
1. ¿Qué es el DOM y cómo se modifica?
   El DOM (*Document Object Model*) es una representación en forma de árbol de objetos que el navegador genera a partir del documento HTML. Se modifica desde JavaScript seleccionando elementos (`document.getElementById`), creando nuevos nodos (`document.createElement`), cambiando su texto o atributos (`textContent`, `setAttribute`, `hidden`) e insertándolos con `appendChild`.
2. ¿Cómo se guarda y se lee un arreglo de objetos con `localStorage`, `JSON.stringify` y `JSON.parse`?**
   Como `localStorage` solo almacena cadenas de texto, al guardar se convierte el arreglo de objetos a formato texto JSON usando `localStorage.setItem(clave, JSON.stringify(arreglo))`. Al leer, se recupera la cadena con `localStorage.getItem(clave)` y se transforma nuevamente en un arreglo de objetos JavaScript mediante `JSON.parse(texto)` dentro de un bloque `try/catch`.
3. ¿Por qué `textContent` y no `innerHTML` con datos del usuario?
   Porque `innerHTML` interpreta y ejecuta etiquetas HTML o scripts (`<script>`, `<img onerror=...>`), abriendo la puerta a ataques de inyección XSS. En cambio, `textContent` inserta cualquier entrada estrictamente como texto plano inofensivo.

Aplicación en nuestro proyecto
En `js/datos.js` encapsulamos la lectura y escritura en `localStorage` bajo las claves `equipo6_casos` y `equipo6_intentos`. En `js/app.js` creamos la función `crearEtiqueta(etiqueta, texto)` que usa `document.createElement` y `textContent` para poblar las tablas de casos y de historial sin riesgo de XSS.

Dudas surgidas en el estudio
- ¿Cómo debemos manejar en el código el error cuando localStorage llena sus 5 MB de límite en el navegador del usuario?

Referencias (APA 7)
- Haverbeke, M. (2024). *Eloquent JavaScript* (4.ª ed.). No Starch Press. https://eloquentjavascript.net/
- Mozilla. (s. f.). *Web Storage API y Document Object Model (DOM)*. MDN Web Docs. https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API