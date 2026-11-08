let CASOS_CLAVE = "equipo6_casos";
let INTENTOS_CLAVE = "equipo6_intentos";

let ejemplos = [
  {
    id: 1,
    origen: "base",
    remitente: "seguridad@0ffice365-support.com",
    asunto: "Acción requerida: Expiración de contraseña institucional",
    cuerpo: "Estimado usuario, su contraseña de Office 365 vencerá hoy a las 23:59. Para mantener su cuenta activa y no perder acceso a sus archivos, valide su clave actual en https://login.0ffice365-support.com/auth/login inmediatamente.",
    phishing: true,
    pistas: [
      "El dominio usa un número cero (0ffice365) en lugar de la letra 'o' (técnica de typosquatting).",
      "Genera urgencia extrema para que ingreses tu contraseña en un enlace externo."
    ]
  },
  {
    id: 2,
    origen: "base",
    remitente: "biblioteca@unas.edu.pe",
    asunto: "Ampliación de horario de atención por exámenes parciales",
    cuerpo: "Se comunica a los estudiantes que durante la semana de exámenes parciales la Biblioteca Central atenderá en horario corrido de 08:00 a 20:00 horas. Recuerde portar su carné universitario al ingresar.",
    phishing: false,
    pistas: [
      "El remitente pertenece al dominio institucional oficial (@unas.edu.pe).",
      "Es un aviso informativo que no solicita contraseñas ni obliga a abrir enlaces."
    ]
  },
  {
    id: 3,
    origen: "base",
    remitente: "no-reply@micros0ft-security.net",
    asunto: "Alerta de inicio de sesión inusual en Windows",
    cuerpo: "Detectamos un intento de acceso a tu cuenta desde una dirección IP desconocida. Si no reconoces esta actividad, bloquea el acceso ingresando tus credenciales en https://account.micros0ft-security.net/verify-user ahora mismo.",
    phishing: true,
    pistas: [
      "Reemplaza la letra 'o' de Microsoft por un cero (micros0ft-security.net).",
      "Pide ingresar tus credenciales en un dominio '.net' ajeno al sitio oficial."
    ]
  },
  {
    id: 4,
    origen: "base",
    remitente: "oti.soporte@unas.edu.pe",
    asunto: "Mantenimiento programado del Aula Virtual",
    cuerpo: "Informamos a la comunidad universitaria que este domingo de 02:00 a 05:00 horas se realizará el mantenimiento preventivo de los servidores del Aula Virtual. Durante ese lapso el servicio estará temporalmente inactivo.",
    phishing: false,
    pistas: [
      "Proviene del correo oficial de soporte y solo informa una ventana de mantenimiento.",
      "No incluye enlaces sospechosos ni pide confirmar datos de usuario."
    ]
  },
  {
    id: 5,
    origen: "base",
    remitente: "tesoreria@unas-edu.pe",
    asunto: "Notificación urgente de bloqueo de matrícula",
    cuerpo: "Su ficha de matrícula presenta una observación pendiente. Realice la validación de su tarjeta bancaria en las próximas 2 horas desde https://pagos-matricula.unas-edu.pe/validar o sus cursos serán retirados del sistema.",
    phishing: true,
    pistas: [
      "El dominio falsifica al oficial usando un guion medio (unas-edu.pe) en lugar de punto (.unas.edu.pe).",
      "Amenaza con anular la matrícula en 2 horas para robar datos de tarjeta bancaria."
    ]
  },
  {
    id: 6,
    origen: "base",
    remitente: "notificaciones@microsoft.com",
    asunto: "Resumen semanal de actividad en Microsoft Teams",
    cuerpo: "Hola, tienes nuevas publicaciones en el canal del curso Programación II. Puedes revisarlas abriendo directamente tu aplicación de escritorio de Microsoft Teams cuando inicies tus actividades académicas.",
    phishing: false,
    pistas: [
      "Te indica abrir tu propia aplicación instalada en lugar de redirigirte a un enlace extraño.",
      "No exige contraseñas ni utiliza amenazas de suspensión de cuenta."
    ]
  },
  {
    id: 7,
    origen: "equipo",
    remitente: "soporte.correo@un4s.edu.pe",
    asunto: "Buzón lleno al 99% - Actualización obligatoria",
    cuerpo: "Su correo institucional ha superado el límite de almacenamiento permitido. Para seguir recibiendo mensajes, amplíe su cuota sin costo ingresando su contraseña en http://webmail-un4s.com/ampliar-cuota hoy mismo.",
    phishing: true,
    pistas: [
      "El remitente cambia la letra 'a' por el número '4' (un4s.edu.pe).",
      "El enlace utiliza protocolo inseguro (http://) hacia una página externa."
    ]
  },
  {
    id: 8,
    origen: "equipo",
    remitente: "bienestar@unas.edu.pe",
    asunto: "Cronograma de campaña médica preventiva",
    cuerpo: "La Oficina de Bienestar Universitario invita a los estudiantes a la campaña médica preventiva que se realizará este jueves de 09:00 a 13:00 horas junto al comedor universitario. Solo debes presentar tu DNI físico.",
    phishing: false,
    pistas: [
      "Correo institucional legítimo con información de una actividad presencial.",
      "No solicita ningún dato confidencial por internet."
    ]
  },
  {
    id: 9,
    origen: "equipo",
    remitente: "alertas@seguridad-bcp-clientes.com",
    asunto: "Clave digital desincronizada - Bloqueo preventivo",
    cuerpo: "Por medidas de seguridad hemos suspendido sus transferencias y pagos por Yape. Sincronice su tarjeta y clave de 6 dígitos ingresando a https://banca-en-linea.seguridad-bcp-clientes.com/activar para evitar el cierre de su cuenta.",
    phishing: true,
    pistas: [
      "Usa un dominio largo inventado con guiones (seguridad-bcp-clientes.com).",
      "Los bancos nunca piden ingresar la clave de 6 dígitos ni datos de tarjeta mediante enlaces por correo."
    ]
  },
  {
    id: 10,
    origen: "equipo",
    remitente: "coordinacion.fiis@unas.edu.pe",
    asunto: "Publicación de orden de sustentación de proyectos",
    cuerpo: "Se informa a los equipos del curso que la lista con el orden de exposición de los proyectos finales ya se encuentra publicada en el mural de la facultad. Recuerden estar presentes 10 minutos antes de su turno.",
    phishing: false,
    pistas: [
      "Comunicación académica normal enviada desde la facultad (@unas.edu.pe).",
      "No contiene enlaces externos ni solicita credenciales de acceso."
    ]
  }
];

function leerDatos(clave) {
  try {
    let texto = localStorage.getItem(clave);
    if (!texto) {
      return [];
    }
    let datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

function obtenerCasos() {
  return leerDatos(CASOS_CLAVE);
}

function guardarCasos(listaCasos) {
  localStorage.setItem(CASOS_CLAVE, JSON.stringify(listaCasos));
}

function obtenerIntentos() {
  return leerDatos(INTENTOS_CLAVE);
}

function guardarIntentos(listaIntentos) {
  localStorage.setItem(INTENTOS_CLAVE, JSON.stringify(listaIntentos));
}

function restaurarEjemplos() {
  let casosActuales = obtenerCasos();
  for (let i = 0; i < ejemplos.length; i++) {
    let existe = false;
    for (let j = 0; j < casosActuales.length; j++) {
      if (casosActuales[j].id === ejemplos[i].id) {
        existe = true;
        break;
      }
    }
    if (!existe) {
      casosActuales.push(ejemplos[i]);
    }
  }
  guardarCasos(casosActuales);
}

if (localStorage.getItem(CASOS_CLAVE) === null) {
  guardarCasos(ejemplos.slice());
}