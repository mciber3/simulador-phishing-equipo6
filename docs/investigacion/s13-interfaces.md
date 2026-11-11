Ficha S13: Interfaces Gráficas, Validación y Usabilidad (Etapa 4)

Resumen
El diseño de una interfaz gráfica centrada en el usuario combina principios de usabilidad, accesibilidad web y validación defensiva. Las heurísticas de Nielsen permiten evaluar si el sistema comunica claramente su estado, utiliza un lenguaje familiar, previene equivocaciones y otorga control para cancelar acciones o confirmar eliminaciones. Asimismo, conforme a las pautas de accesibilidad WCAG 2.

2, los errores de formulario nunca deben indicarse únicamente mediante el color rojo; es indispensable vincular cada campo con su mensaje descriptivo mediante atributos como `aria-describedby` y `aria-invalid`, facilitando la navegación por teclado y lectores de pantalla. Por último, aunque la validación en el cliente con JavaScript mejora la experiencia inmediata, en arquitectura web nunca reemplaza la validación en el servidor.

Respuestas a las preguntas de la guía
1. Explica 5 de las 10 heurísticas de Nielsen con un ejemplo.
   - Visibilidad del estado del sistema: Mostrar el progreso `"Caso 3 de 10"` durante el entrenamiento.
   - Relación entre el sistema y el mundo real: Presentar el caso con formato de bandeja de correo (`De:`, `Asunto:`) y botones claros (`Es Legítimo` / `Es Phishing`).
   - Control y libertad del usuario: Incluir el botón `"Cancelar edición"` en el formulario y pedir confirmación (`confirm`) antes de eliminar un registro.
   - Prevención de errores: Prohibir caracteres `<` y `>` y validar el formato de correo antes de permitir guardar un caso.
   - Reconocimiento antes que recuerdo: Mostrar inmediatamente la lista de pistas del correo tras responder, sin obligar al usuario a memorizar los indicadores.
2. ¿Cómo se vincula un error con su campo y por qué no basta el color?
   Se vincula colocando en el `<input>` el atributo `aria-describedby="idDelMensajeError"` junto con `aria-invalid="true"` cuando falla la validación. No basta el color rojo porque las personas con daltonismo, baja visión o que utilizan lectores de pantalla no perciben cambios cromáticos y necesitan un texto explicativo asociado programáticamente al control.
3. ¿Qué valida el cliente y qué debe validar el servidor?**
   El **cliente (navegador) valida de forma rápida el formato, campos obligatorios y longitud para dar retroalimentación inmediata al usuario, pero puede ser evadido desde las herramientas de desarrollador. El servidor debe volver a validar absolutamente todas las entradas, tipos de datos, permisos y reglas de seguridad antes de procesar o almacenar información.

Aplicación en nuestro proyecto
Implementamos la función `errorCampo(id, mensaje)` en `js/app.js`, que escribe el texto de ayuda en el elemento `<small class="error">` vinculado por `aria-describedby` y activa `aria-invalid="true"`, resaltando el borde y enfocando los controles con `:focus-visible`.

Dudas surgidas en el estudio
- ¿Cuándo es necesario agregar el atributo aria-live="polite" junto con aria-invalid para que un lector de pantalla lea en voz alta el error apenas aparece?

Referencias (APA 7)
- Nielsen, J. (1994). Enhancing the explanatory power of usability heuristics. En Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '94) (pp. 152-158). ACM.
- Nielsen Norman Group. (s. f.). 10 usability heuristics for user interface design. https://www.nngroup.com/articles/ten-usability-heuristics/
- W3C. (2023). Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/