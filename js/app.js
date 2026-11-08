function elemento(id) {
  return document.getElementById(id);
}

function crearEtiqueta(nombreEtiqueta, texto) {
  let nodo = document.createElement(nombreEtiqueta);
  nodo.textContent = texto;
  return nodo;
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

if (elemento("casoForm")) {
  let idEditando = null;

  function limpiarFormulario() {
    elemento("casoForm").reset();
    idEditando = null;
    elemento("tituloForm").textContent = "Crear un caso simulado";
    elemento("guardar").textContent = "Guardar caso";
    elemento("cancelar").hidden = true;
  }

  elemento("casoForm").addEventListener("submit", function (evento) {
    evento.preventDefault();
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

    if (!remitente || !asunto || !cuerpo || !tipo || pistas.length === 0) {
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