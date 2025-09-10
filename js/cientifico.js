<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyC8XKDRQ6iRdpEJXcaCp8vqaALVk7Di_P8",
    authDomain: "mates-catalunya-selectividad.firebaseapp.com",
    projectId: "mates-catalunya-selectividad",
    storageBucket: "mates-catalunya-selectividad.firebasestorage.app",
    messagingSenderId: "902089237800",
    appId: "1:902089237800:web:96e74744749ea7f2a21c1d",
    measurementId: "G-XDJTHHEL8Y"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const temas = [
    { nombre: "Matrius i sistemes d'equacions lineals", ejercicios: 15 },
    { nombre: "Geometria de l'espai", ejercicios: 15 },
    { nombre: "Funcions I - Aplicacions Derivades", ejercicios: 15 },
    { nombre: "Funcions II - Problemes Optimització", ejercicios: 15 },
    { nombre: "Funcions III - Integrals", ejercicios: 15 },
    { nombre: "Probabilitat", ejercicios: 15 }
  ];

  const indice = document.getElementById("indice");
  const contenido = document.getElementById("contenido");
  let ejercicioId = 1;

  temas.forEach((tema, tIndex) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = tema.nombre;
    details.appendChild(summary);

    const ul = document.createElement("ul");
    for (let i = 1; i <= tema.ejercicios; i++) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#ej${ejercicioId}">Ejercicio ${i}</a>`;
      ul.appendChild(li);
      ejercicioId++;
    }
    details.appendChild(ul);
    indice.appendChild(details);

    const temaDiv = document.createElement("div");
    temaDiv.className = "tema";
    temaDiv.innerHTML = `<h2>${tema.nombre}</h2>`;
    contenido.appendChild(temaDiv);

    for (let i = 1; i <= tema.ejercicios; i++) {
      const idEj = ejercicioId - tema.ejercicios + i - 1;
      const div = document.createElement("div");
      div.className = "ejercicio";
      div.id = "ej" + idEj;
      div.innerHTML = `
        <div class="ejercicio-contenido">
          <h3>Ejercicio ${i}</h3>
          <img src="img/ej${idEj}.png" alt="Enunciado Ejercicio ${i}" width="300"><br>
          <button class="btn" onclick="mostrarSolucion(${idEj})">Mostrar Solución</button>
          <div class="video" onclick="abrirPopup(${idEj})">🔒 Video Premium - Haz clic para acceder</div>
        </div>
        <div id="sol${idEj}" class="solucion">
          <img src="img/sol${idEj}.png" alt="Solución Ejercicio ${i}">
        </div>
      `;
      temaDiv.appendChild(div);
    }
  });

  window.mostrarSolucion = function(num) {
    const solDiv = document.getElementById("sol" + num);
    solDiv.style.display = "block";
  }

  let ejercicioSeleccionado = null;
  window.abrirPopup = function(num) {
    ejercicioSeleccionado = num;
    document.getElementById("popup").style.display = "flex";
  }
  window.cerrarPopup = function() {
    document.getElementById("popup").style.display = "none";
  }

  window.guardarCorreo = async function() {
    const correo = document.getElementById("correoInput").value;
    const telefono = document.getElementById("telefonoInput").value;
  
    if (!correo || !telefono) {
      alert("⚠️ Por favor introduce tu correo y teléfono.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert("⚠️ Introduce un correo válido.");
      return;
    }
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(telefono)) {
      alert("⚠️ Introduce un teléfono válido (solo números).");
      return;
    }

    try {
      await addDoc(collection(db, "correos"), {
        email: correo,
        telefono: telefono,
        ejercicio: ejercicioSeleccionado,
        fecha: serverTimestamp()
      });
      alert("✅ Gracias, nos pondremos en contacto contigo.");
      document.getElementById("correoInput").value = "";
      document.getElementById("telefonoInput").value = "";
      cerrarPopup();
    } catch (e) {
      console.error("Error al guardar:", e);
      alert("❌ Error al guardar los datos.");
    }
  }

  window.toggleMenu = function() {
    document.getElementById("sidebar").classList.toggle("active");
  }
</script>
