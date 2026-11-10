# Ficha S15: Integración, Pruebas y Publicación (Etapa 5)

# Resumen
La etapa de integración y publicación consolida el ciclo de desarrollo mediante la verificación funcional, la auditoría de seguridad y el despliegue en un entorno accesible. GitHub Pages permite alojar sitios web estáticos directamente desde el repositorio del proyecto, publicando archivos HTML, CSS y JavaScript sin requerir la configuración de un servidor propio. Sin embargo, al operar íntegramente en el navegador del cliente mediante `localStorage`, existen límites de capacidad cercanos a los cinco megabytes y riesgos de exposición si se almacenan datos sensibles sin cifrar. Por ello, antes de liberar la versión final, resulta indispensable ejecutar casos de prueba manuales documentados que comprueben las reglas de negocio, las validaciones de entrada y la resistencia frente a inyecciones de código.

# Respuestas a las preguntas guía
1. **¿Qué es GitHub Pages y qué archivos se publican?**
   Es un servicio gratuito de alojamiento de sitios web estáticos integrado en GitHub. Publica únicamente archivos que se ejecutan del lado del cliente: documentos `.html` (tomando `index.html` como página principal), hojas `.css`, scripts `.js` e imágenes, sin ejecutar bases de datos ni código de servidor (como PHP o Python).
2. **¿Qué límites y riesgos tiene `localStorage`?**
   - **Límites:** Solo almacena cadenas de texto, tiene un espacio máximo aproximado de **5 MB por dominio**, es síncrono y los datos solo existen en el navegador y dispositivo donde se guardaron.
   - **Riesgos:** No tiene cifrado nativo y cualquier script que logre ejecutarse en la página (por ejemplo, mediante un fallo XSS) puede leer o robar todo su contenido, por lo que nunca debe guardar contraseñas, tokens ni datos personales reales.
3. **¿Cómo se diseña un caso de prueba manual?**
   Se define una tabla o ficha que especifica: **ID de la prueba**, **requisito o función a evaluar**, **datos de entrada / pasos a seguir**, **resultado esperado** y **resultado obtenido** (Cumple / No cumple), incluyendo tanto casos válidos como intentos con datos erróneos o maliciosos.

# Aplicación en nuestro proyecto
Publicamos el repositorio desde la rama `main` en GitHub Pages, verificamos que `localStorage` solo guarde alias ficticios y casos educativos, y ejecutamos la batería de pruebas manuales y de seguridad documentada en `docs/pruebas-y-seguridad.md`.

# Dudas surgidas en el estudio
- ¿Qué alternativa del lado del cliente (como `IndexedDB` o `sessionStorage`) conviene utilizar cuando se necesita que los datos se borren automáticamente al cerrar la pestaña del navegador?

# Referencias (APA 7)
- GitHub. (s. f.). *GitHub Pages documentation*. https://docs.github.com/es/pages
- Mozilla. (s. f.). *Web Storage API: Conceptos y uso de localStorage*. MDN Web Docs. https://developer.mozilla.org/es/docs/Web/API/Web_Storage_API
- OWASP Foundation. (2025). *OWASP Top 10:2025*. https://owasp.org/Top10/2025/