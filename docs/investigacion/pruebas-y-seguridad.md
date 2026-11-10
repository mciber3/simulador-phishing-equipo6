Pruebas Manuales, Revisión de Seguridad y Reflexión sobre Frameworks — Equipo 6

1. Casos de Prueba Manuales Documentados

| ID | Función evaluada | Pasos y datos de entrada | Resultado esperado | Resultado obtenido |

| CP-01 (Prueba de aceptación Equipo 6) | Retroalimentación de pistas y registro en historial | 1. Iniciar intento con alias `estudiante_unas`.<br>2. Ante un correo de phishing (`seguridad@0ffice365-support.com`), presionar «Es Legítimo».<br>3.
Completar los 10 casos e ir a `resultados.html`. | El simulador indica respuesta incorrecta, muestra inmediatamente las pistas del caso y al finalizar registra el puntaje en el historial y ranking. | Cumple |
| CP-02 | Orden aleatorio sin repetición | Iniciar dos intentos seguidos y anotar la secuencia de los 10 casos mostrados. | Los 10 casos aparecen en orden distinto en cada intento y ninguno se repite dentro del mismo intento. | Cumple |
| CP-03 | Validación de formulario y prevención de XSS | En `crear.html`, intentar guardar un caso con remitente `invalido`, asunto `<script>alert(1)</script>` y sin pistas. | El formulario bloquea el envío, muestra mensajes de error junto a cada campo (`aria-invalid="true"`) y rechaza los símbolos `<` y `>`. | Cumple |
| CP-04 | Enlaces desactivados en correos simulados | En el simulador, hacer clic sobre la URL azul subrayada `https://login.0ffice365-support.com/auth/login`. | La URL se visualiza azul y subrayada como en un correo real, pero es un `<span>` de texto plano y no redirige ni abre ninguna página. | Cumple |
| CP-05 | CRUD, filtros, restauración y exportación JSON | 1. Filtrar casos por tipo `Phishing` y origen `Equipo`.<br>2. Editar el asunto de un caso y guardarlo.<br>3. Eliminar un caso base con confirmación y presionar «Cargar los 10 casos de ejemplo».<br>4. Presionar «Exportar datos en JSON». | La tabla se actualiza al instante, la edición persiste al recargar (`F5`), el botón restaura el caso faltante sin duplicar los demás y se descarga el archivo `.json`. | Cumple |
| CP-06 | Diseño responsive en 3 anchos | Redimensionar el navegador a `375 px` (móvil), `768 px` (tableta) y `1200 px` (escritorio). | En móvil el menú se pliega en el botón `Menú` (`aria-expanded`), en tableta los filtros pasan a 2 columnas y en escritorio a 4 columnas. | Cumple |

2. Verificación de los 6 Controles de Seguridad (Sección 6)

1. Sin claves, tokens ni credenciales reales:** Todo el código fuente y el historial de Git contienen únicamente los 10 casos simulados educativos y alias de prueba.
2. Prevención de XSS con `textContent` y sin `eval`:** Toda inserción de datos del usuario en el DOM se realiza mediante la función `crearEtiqueta()` que emplea `nodo.textContent = texto`. No se utiliza `innerHTML` con entradas del usuario ni `eval()`.
3. Validación de campos en JavaScript: Se validan longitudes, formato de correo electrónico con expresiones regulares, cantidad de pistas (1 a 3) y se bloquean caracteres `<` y `>`, teniendo presente que en producción toda validación cliente debe replicarse en el servidor.
4. Control de enlaces (Seguridad específica Equipo 6): Las direcciones `http://` y `https://` dentro del cuerpo de los casos se transforman en etiquetas `<span class="enlace-falso">` con `textContent`, impidiendo que el usuario haga clic hacia sitios externos reales.
5. Uso responsable de `localStorage`:** Solo se almacenan las claves `equipo6_casos` y `equipo6_intentos` con datos públicos del ejercicio educativo, sin guardar contraseñas ni información personal sensible.
6. Política de Seguridad de Contenido (`<meta>` CSP):** Las tres páginas incluyen `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'">`, bloqueando scripts en línea y recursos de terceros.

3. Reflexión: ¿Cómo se reorganizaría este proyecto con un Framework Front End?

Si migráramos este simulador de JavaScript puro a un framework como React o Vue, el cambio principal sería pasar de una manipulación imperativa del DOM (`document.getElementById`, `innerHTML = ""` y `appendChild`) a una arquitectura declarativa basada en componentes y estado reactivo:

1. División en Componentes Reutilizables:**
   - `<Navbar />`: Reemplazaría el `<header>` que actualmente está copiado en los 3 archivos HTML, manteniendo el estado `abierto` del menú móvil en un solo lugar.
   - `<CorreoCard caso={casoActual} />`: Recibiría por propiedades (props) el remitente, asunto y cuerpo, encargándose de resaltar visualmente las URLs inactivas sin tocar el DOM manualmente.
   - `<CasoForm alGuardar={...} casoEditando={...} />` y `<TablaFiltrable datos={...} />`: Permitirían actualizar la tabla automáticamente apenas cambia el arreglo `casos` en memoria, sin tener que borrar y volver a dibujar todas las filas `<tr>` en cada pulsación del buscador.

2. Gestión de Estado y Rutas:
   En lugar de recargar tres documentos HTML distintos, usaríamos un enrutador de página única (SPA) y un estado reactivo sincronizado con `localStorage` (mediante Custom Hooks en React o Composables en Vue), reduciendo aún más el código repetido y facilitando escalar el proyecto si en el futuro se conecta a una base de datos real con servidor.