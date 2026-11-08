/* Cinco heurísticas de usabilidad de Nielsen aplicadas en el proyecto:
1. Visibilidad del estado: indica número de caso actual, conteos y mensajes de confirmación.
2. Relación con el mundo real: formato de bandeja de correo y botones claros ("Es Legítimo" / "Es Phishing").
3. Control y libertad del usuario: opción para cancelar edición y confirmación antes de eliminar.
4. Prevención de errores: validación en cada campo antes de guardar datos.
5. Reconocimiento antes que recuerdo: muestra las pistas de detección tras cada respuesta.
*/

function elemento(id) {
  return document.getElementById(id);
}

function crearEtiqueta(nombreEtiqueta, texto) {
  let nodo = document.createElement(nombreEtiqueta);
  nodo.textContent = texto;
  return nodo;
}

function mostrarCuerpoCorreo(contenedor, textoMensaje) {
  contenedor.innerHTML = "";
  let palabras = textoMensaje.split(" ");

  for (let i = 0; i < palabras.length; i++) {
    let palabra = palabras[i];
    if (palabra.startsWith("http://") || palabra.startsWith("https://")) {
      let enlaceVisual = crearEtiqueta("span", palabra);
      enlaceVisual.className = "enlace-falso";
      enlaceVisual.title = "Enlace desactivado por seguridad";
      contenedor.appendChild(enlaceVisual);
    } else {
      contenedor.appendChild(document.createTextNode(palabra));
    }

    if (i < palabras.length - 1) {
      contenedor.appendChild(document.createTextNode(" "));
    }
  }
}

function porcentaje(aciertos, total) {
  if (total === 0) {
    return 0;
  }
  return Math.round((aciertos * 100) / total);
}

function exportarJSON(nombreArchivo, datos) {
  let textoJSON = JSON.stringify(datos, null, 2);
  let archivo = new Blob([textoJSON], { type: "application/json" });
  let enlace = document.createElement("a");
  let url = URL.createObjectURL(archivo);

  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

if (elemento("menuBoton")) {
  elemento("menuBoton").addEventListener("click", function () {
    let menu = elemento("menu");
    let abierto = menu.classList.toggle("abierto");
    elemento("menuBoton").setAttribute("aria-expanded", abierto ? "true" : "false");
  });
}

if (elemento("inicioForm")) {
  let aliasActual = "";
  let preguntas = [];
  let posicion = 0;
  let aciertos = 0;
  let fallados = [];

  elemento("inicioForm").addEventListener("submit", function (evento) {
    evento.preventDefault();
    aliasActual = elemento("alias").value.trim();

    let patronAlias = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _.-]{2,30}$/;
    if (!patronAlias.test(aliasActual)) {
      elemento("aliasError").textContent = "Escribe un alias válido de 2 a 30 caracteres (sin símbolos < o >).";
      elemento("alias").setAttribute("aria-invalid", "true");
      elemento("alias").focus();
      return;
    }

    elemento("aliasError").textContent = "";
    elemento("alias").setAttribute("aria-invalid", "false");

    preguntas = obtenerCasos().slice();
    if (preguntas.length === 0) {
      elemento("aliasError").textContent = "No hay casos registrados. Carga los ejemplos en la página Crear casos.";
      return;
    }

    for (let i = preguntas.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temporal = preguntas[i];
      preguntas[i] = preguntas[j];
      preguntas[j] = temporal;
    }

    posicion = 0;
    aciertos = 0;
    fallados = [];

    elemento("inicioForm").hidden = true;
    elemento("final").hidden = true;
    elemento("pregunta").hidden = false;
    mostrarPregunta();
  });

  function mostrarPregunta() {
    let caso = preguntas[posicion];
    elemento("progreso").textContent = "Caso " + (posicion + 1) + " de " + preguntas.length;
    elemento("verRemitente").textContent = caso.remitente;
    elemento("verAsunto").textContent = caso.asunto;
    mostrarCuerpoCorreo(elemento("verCuerpo"), caso.cuerpo);

    elemento("legitimo").disabled = false;
    elemento("phishing").disabled = false;
    elemento("respuesta").hidden = true;
    elemento("pistas").hidden = true;
    elemento("siguiente").hidden = true;

    if (posicion === preguntas.length - 1) {
      elemento("siguiente").textContent = "Finalizar y ver puntaje";
    } else {
      elemento("siguiente").textContent = "Siguiente caso";
    }
    elemento("legitimo").focus();
  }

  function responderCaso(eligioPhishing) {
    let caso = preguntas[posicion];
    let acerto = caso.phishing === eligioPhishing;

    if (acerto) {
      aciertos++;
    } else {
      fallados.push(caso.asunto + " (" + caso.remitente + ")");
    }

    elemento("legitimo").disabled = true;
    elemento("phishing").disabled = true;

    let estado = acerto ? "¡Respuesta correcta! " : "Respuesta incorrecta. ";
    let tipoReal = caso.phishing ? "era un correo de PHISHING." : "era un correo LEGÍTIMO.";
    elemento("respuesta").textContent = estado + "Este mensaje " + tipoReal;
    elemento("respuesta").hidden = false;

    let lista = elemento("listaPistas");
    lista.innerHTML = "";
    for (let i = 0; i < caso.pistas.length; i++) {
      lista.appendChild(crearEtiqueta("li", caso.pistas[i]));
    }

    elemento("pistas").hidden = false;
    elemento("siguiente").hidden = false;
    elemento("siguiente").focus();
  }

  elemento("legitimo").addEventListener("click", function () {
    responderCaso(false);
  });

  elemento("phishing").addEventListener("click", function () {
    responderCaso(true);
  });

  elemento("siguiente").addEventListener("click", function () {
    posicion++;
    if (posicion < preguntas.length) {
      mostrarPregunta();
      return;
    }

    let intentos = obtenerIntentos();
    intentos.push({
      id: Date.now(),
      alias: aliasActual,
      fecha: new Date().toLocaleDateString("es-PE"),
      aciertos: aciertos,
      total: preguntas.length
    });
    guardarIntentos(intentos);

    elemento("pregunta").hidden = true;
    elemento("final").hidden = false;
    elemento("puntaje").textContent =
      "Participante: " + aliasActual + " | Puntaje: " + aciertos + " de " + preguntas.length +
      " aciertos (" + porcentaje(aciertos, preguntas.length) + " %). Guardado en el historial.";

    let listaErrores = elemento("erroresFinales");
    listaErrores.innerHTML = "";
    if (fallados.length === 0) {
      listaErrores.appendChild(crearEtiqueta("li", "¡Ninguno! Identificaste todos los casos correctamente."));
    } else {
      for (let i = 0; i < fallados.length; i++) {
        listaErrores.appendChild(crearEtiqueta("li", fallados[i]));
      }
    }
  });

  elemento("reiniciar").addEventListener("click", function () {
    elemento("final").hidden = true;
    elemento("inicioForm").hidden = false;
    elemento("alias").focus();
  });
}

if (elemento("casoForm")) {
  let idEditando = null;
  let campos = ["remitente", "asunto", "cuerpo", "tipo", "pistasCampo"];

  function errorCampo(id, mensaje) {
    elemento(id + "Error").textContent = mensaje;
    elemento(id).setAttribute("aria-invalid", mensaje !== "" ? "true" : "false");
  }

  function limpiarFormulario() {
    elemento("casoForm").reset();
    idEditando = null;
    for (let i = 0; i < campos.length; i++) {
      errorCampo(campos[i], "");
    }
    elemento("tituloForm").textContent = "Crear un caso simulado";
    elemento("guardar").textContent = "Guardar caso";
    elemento("cancelar").hidden = true;
  }

  elemento("casoForm").addEventListener("submit", function (evento) {
    evento.preventDefault();
    for (let i = 0; i < campos.length; i++) {
      errorCampo(campos[i], "");
    }
    elemento("mensajeForm").textContent = "";

    let remitente = elemento("remitente").value.trim();
    let asunto = elemento("asunto").value.trim();
    let cuerpo = elemento("cuerpo").value.trim();
    let tipo = elemento("tipo").value;

    let lineas = elemento("pistasCampo").value.split("\n");
    let pistas = [];
    for (let i = 0; i < lineas.length; i++) {
      let textoLinea = lineas[i].trim();
      if (textoLinea !== "") {
        pistas.push(textoLinea);
      }
    }

    let valido = true;

    let patronCorreo = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
    if (!patronCorreo.test(remitente)) {
      errorCampo("remitente", "Ingresa un correo con formato válido (ej. soporte@0ffice365.com).");
      valido = false;
    }

    if (asunto.length < 3 || asunto.includes("<") || asunto.includes(">")) {
      errorCampo("asunto", "El asunto debe tener al menos 3 caracteres y no usar símbolos < o >.");
      valido = false;
    }

    if (cuerpo.length < 20 || cuerpo.includes("<") || cuerpo.includes(">")) {
      errorCampo("cuerpo", "El mensaje debe tener al menos 20 caracteres y no usar símbolos < o >.");
      valido = false;
    }

    if (tipo !== "phishing" && tipo !== "legitimo") {
      errorCampo("tipo", "Selecciona si el caso es Phishing o Legítimo.");
      valido = false;
    }

    if (pistas.length < 1 || pistas.length > 3) {
      errorCampo("pistasCampo", "Debes escribir entre 1 y 3 pistas (una en cada línea).");
      valido = false;
    }

    if (!valido) {
      return;
    }

    let casos = obtenerCasos();
    let origenCaso = "equipo";

    if (idEditando !== null) {
      for (let i = 0; i < casos.length; i++) {
        if (casos[i].id === idEditando) {
          origenCaso = casos[i].origen;
          break;
        }
      }
    }

    let nuevoCaso = {
      id: idEditando === null ? Date.now() : idEditando,
      origen: origenCaso,
      remitente: remitente,
      asunto: asunto,
      cuerpo: cuerpo,
      phishing: tipo === "phishing",
      pistas: pistas
    };

    if (idEditando === null) {
      casos.push(nuevoCaso);
    } else {
      for (let i = 0; i < casos.length; i++) {
        if (casos[i].id === idEditando) {
          casos[i] = nuevoCaso;
          break;
        }
      }
    }

    guardarCasos(casos);
    limpiarFormulario();
    elemento("mensajeForm").textContent = "Caso guardado correctamente.";
    mostrarCasos();
  });

  function mostrarCasos() {
    let todos = obtenerCasos();
    let contPhishing = 0;
    let contLegitimo = 0;

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].phishing) {
        contPhishing++;
      } else {
        contLegitimo++;
      }
    }
    elemento("totalCasos").textContent =
      todos.length + " (" + contPhishing + " Phishing / " + contLegitimo + " Legítimos)";

    let textoBuscar = elemento("buscarCaso").value.toLowerCase().trim();
    let filtroTipo = elemento("filtrarTipo").value;
    let filtroOrigen = elemento("filtrarOrigen").value;
    let orden = elemento("ordenCaso").value;

    let filtrados = todos.filter(function (c) {
      let coincideAsunto = c.asunto.toLowerCase().includes(textoBuscar);
      let tipoCaso = c.phishing ? "phishing" : "legitimo";
      let coincideTipo = filtroTipo === "todos" || tipoCaso === filtroTipo;
      let coincideOrigen = filtroOrigen === "todos" || c.origen === filtroOrigen;
      return coincideAsunto && coincideTipo && coincideOrigen;
    });

    filtrados.sort(function (a, b) {
      let comparacion = a.asunto.localeCompare(b.asunto);
      return orden === "az" ? comparacion : -comparacion;
    });

    elemento("sinCasos").hidden = filtrados.length > 0;
    let tabla = elemento("tablaCasos");
    tabla.innerHTML = "";

    for (let i = 0; i < filtrados.length; i++) {
      let caso = filtrados[i];
      let fila = document.createElement("tr");

      fila.appendChild(crearEtiqueta("td", caso.remitente));
      fila.appendChild(crearEtiqueta("td", caso.asunto));
      fila.appendChild(crearEtiqueta("td", caso.phishing ? "Phishing" : "Legítimo"));
      fila.appendChild(crearEtiqueta("td", caso.origen === "base" ? "Base" : "Equipo"));

      let celdaAcciones = document.createElement("td");

      let btnEditar = crearEtiqueta("button", "Editar");
      btnEditar.type = "button";
      btnEditar.addEventListener("click", function () {
        idEditando = caso.id;
        elemento("remitente").value = caso.remitente;
        elemento("asunto").value = caso.asunto;
        elemento("cuerpo").value = caso.cuerpo;
        elemento("tipo").value = caso.phishing ? "phishing" : "legitimo";
        elemento("pistasCampo").value = caso.pistas.join("\n");
        elemento("tituloForm").textContent = "Editando caso seleccionado";
        elemento("guardar").textContent = "Guardar cambios";
        elemento("cancelar").hidden = false;
        elemento("remitente").focus();
      });

      let btnEliminar = crearEtiqueta("button", "Eliminar");
      btnEliminar.type = "button";
      btnEliminar.className = "secundario";
      btnEliminar.addEventListener("click", function () {
        if (!confirm("¿Estás seguro de eliminar este caso?")) {
          return;
        }
        let restantes = obtenerCasos().filter(function (item) {
          return item.id !== caso.id;
        });
        guardarCasos(restantes);
        if (idEditando === caso.id) {
          limpiarFormulario();
        }
        elemento("mensajeLista").textContent = "Caso eliminado correctamente.";
        mostrarCasos();
      });

      celdaAcciones.appendChild(btnEditar);
      celdaAcciones.appendChild(btnEliminar);
      fila.appendChild(celdaAcciones);
      tabla.appendChild(fila);
    }
  }

  elemento("cancelar").addEventListener("click", limpiarFormulario);
  elemento("buscarCaso").addEventListener("input", mostrarCasos);
  elemento("filtrarTipo").addEventListener("change", mostrarCasos);
  elemento("filtrarOrigen").addEventListener("change", mostrarCasos);
  elemento("ordenCaso").addEventListener("change", mostrarCasos);

  elemento("ejemplos").addEventListener("click", function () {
    restaurarEjemplos();
    mostrarCasos();
    elemento("mensajeLista").textContent = "Se restauraron los 10 casos de ejemplo.";
  });

  elemento("exportarCasos").addEventListener("click", function () {
    exportarJSON("casos_equipo6.json", obtenerCasos());
    elemento("mensajeLista").textContent = "Archivo JSON descargado.";
  });

  mostrarCasos();
}

if (elemento("tablaIntentos")) {
  function mostrarResultados() {
    let intentos = obtenerIntentos();
    let sumaPorcentajes = 0;

    for (let i = 0; i < intentos.length; i++) {
      sumaPorcentajes += porcentaje(intentos[i].aciertos, intentos[i].total);
    }

    elemento("cantidad").textContent = intentos.length;
    let promedio = intentos.length > 0 ? Math.round(sumaPorcentajes / intentos.length) : 0;
    elemento("promedio").textContent = promedio + " %";

    let mejores = intentos.slice().sort(function (a, b) {
      return porcentaje(b.aciertos, b.total) - porcentaje(a.aciertos, a.total);
    }).slice(0, 5);

    let listaRanking = elemento("ranking");
    listaRanking.innerHTML = "";
    elemento("sinRanking").hidden = mejores.length > 0;

    for (let i = 0; i < mejores.length; i++) {
      let item = mejores[i];
      let texto = item.alias + " — " + porcentaje(item.aciertos, item.total) + " % (" + item.aciertos + "/" + item.total + ")";
      listaRanking.appendChild(crearEtiqueta("li", texto));
    }

    let textoAlias = elemento("buscarAlias").value.toLowerCase().trim();
    let orden = elemento("ordenIntentos").value;

    let filtrados = intentos.filter(function (intento) {
      return intento.alias.toLowerCase().includes(textoAlias);
    });

    filtrados.sort(function (a, b) {
      let dif = porcentaje(b.aciertos, b.total) - porcentaje(a.aciertos, a.total);
      return orden === "mayor" ? dif : -dif;
    });

    elemento("sinIntentos").hidden = filtrados.length > 0;
    let tabla = elemento("tablaIntentos");
    tabla.innerHTML = "";

    for (let i = 0; i < filtrados.length; i++) {
      let intento = filtrados[i];
      let fila = document.createElement("tr");

      fila.appendChild(crearEtiqueta("td", intento.alias));
      fila.appendChild(crearEtiqueta("td", intento.fecha));
      fila.appendChild(crearEtiqueta("td", intento.aciertos));
      fila.appendChild(crearEtiqueta("td", intento.total));
      fila.appendChild(crearEtiqueta("td", porcentaje(intento.aciertos, intento.total) + " %"));

      let celdaAccion = document.createElement("td");
      let btnBorrar = crearEtiqueta("button", "Eliminar");
      btnBorrar.type = "button";
      btnBorrar.className = "secundario";
      btnBorrar.addEventListener("click", function () {
        if (!confirm("¿Deseas borrar este intento del historial?")) {
          return;
        }
        let restantes = obtenerIntentos().filter(function (item) {
          return item.id !== intento.id;
        });
        guardarIntentos(restantes);
        elemento("mensajeResultados").textContent = "Intento eliminado del historial.";
        mostrarResultados();
      });

      celdaAccion.appendChild(btnBorrar);
      fila.appendChild(celdaAccion);
      tabla.appendChild(fila);
    }
  }

  elemento("buscarAlias").addEventListener("input", mostrarResultados);
  elemento("ordenIntentos").addEventListener("change", mostrarResultados);

  elemento("exportarIntentos").addEventListener("click", function () {
    exportarJSON("historial_resultados.json", obtenerIntentos());
    elemento("mensajeResultados").textContent = "Historial exportado en JSON.";
  });

  mostrarResultados();
}