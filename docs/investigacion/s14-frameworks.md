Ficha S14: Frameworks Front End (Etapa 5)

# Resumen 
Un framework de Front End es una estructura de trabajo que estandariza el desarrollo de interfaces web complejas mediante una arquitectura basada en componentes. En el desarrollo tradicional con JavaScript puro, actualizar la pantalla exige buscar nodos manualmente en el DOM y reconstruir tablas completas ante cada cambio de estado, lo cual dificulta el mantenimiento cuando la aplicación crece. Los frameworks resuelven este problema sincronizando automáticamente los datos con la vista de forma declarativa. Cada componente encapsula su propia estructura HTML, estilos y lógica, permitiendo reutilizar piezas como tarjetas de correo, tablas o formularios en distintas secciones sin duplicar código. Comprender primero el funcionamiento nativo del DOM facilita adoptar posteriormente herramientas modernas como React o Vue con criterio técnico y seguridad.

# Respuestas a las preguntas guía
1. **¿Qué problema resuelve un framework y qué es un componente?**
   Un framework resuelve el problema de mantener sincronizados los datos de la aplicación (el estado) con la interfaz de usuario sin tener que manipular manualmente el DOM con `document.createElement` o `innerHTML` en cada cambio. Un **componente** es un bloque de interfaz independiente y reutilizable que agrupa su propia vista (HTML), estilo (CSS) y lógica (JS).
2. **¿Qué partes de tu proyecto serían componentes reutilizables?**
   - `BarraNavegacion`: El `<header>` y menú adaptable común a las 3 páginas.
   - `TarjetaCorreo`: El contenedor que muestra remitente, asunto y cuerpo con enlaces desactivados.
   - `CampoFormulario`: Cada grupo de `<label>`, `<input>` y `<small class="error">` con validación accesible.
   - `TablaDatos`: La estructura de tabla con buscador y selectores de filtro usada tanto en Crear casos como en Resultados.
3. **¿En qué se diferencian React y Vue, en una frase cada uno?**
   - **React:** Es una librería declarativa que utiliza JSX (HTML dentro de JavaScript) y un flujo de datos unidireccional donde toda la interfaz se programa como funciones de JavaScript.
   - **Vue:** Es un framework progresivo que separa de forma clásica la plantilla HTML (`<template>`), la lógica (`<script>`) y los estilos (`<style>`) en archivos de un solo componente, utilizando reactividad automática.

# Aplicación en nuestro proyecto
Aunque construimos el simulador en JavaScript puro, aplicamos modularidad separando la capa de almacenamiento (`js/datos.js`) de la lógica de vista (`js/app.js`) y creando funciones reutilizables como `crearEtiqueta()` y `errorCampo()`.

# Dudas surgidas en el estudio
- ¿Cómo gestionan internamente React y Vue las políticas `Content-Security-Policy` cuando compilan estilos o scripts para producción?

# Referencias (APA 7)
- Meta Platforms. (s. f.). *Documentación oficial de React: Describir la UI*. https://es.react.dev/learn/describing-the-ui
- You, E. (s. f.). *Guía oficial de Vue.js: Conceptos básicos de componentes*. https://vuejs.org/guide/essentials/component-basics.html