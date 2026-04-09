const slidesContainer = document.getElementById("slides");
const dotsContainer = document.getElementById("dots");

let ofertas = [];
let index = 0;
let intervalo;

async function cargarOfertas(){

  const res = await fetch("./content/ofertas.json");
  const data = await res.json();

  //Filtrar solo vigentes
  ofertas = data.ofertas.filter(oferta => 
    obtenerTextoPeriodo(oferta.periodo)
  );

  crearSlides();
  crearDots();
  actualizarCarrusel();
  iniciarAuto();
}

function crearSlides(){

  ofertas.forEach(oferta => {

    const textoPeriodo = obtenerTextoPeriodo(oferta.periodo);

    //Si no está vigente, no se muestra
    if (!textoPeriodo) return;

    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
    <div class="slide-bg" style="background-image: url('${oferta.imagen}')"></div>
    
    <div class="slide-content">
        <div class="slide-desc">
          <p class="periodo">${textoPeriodo}</p>
          <h2>${oferta.titulo}</h2>
          <p>${oferta.contenido}</p>
        </div>

        <div class="slide-actions">
          <div class="precios">
            <span class="precio-real">$${oferta.precio_real}</span>
            <span class="precio-desc">$${oferta.precio_descuento}</span>
          </div>

          <div class="slide-buttons">
            <a href="${oferta.wsp}" class="oferta_button wsp">Aprovecha esta Promoción <img src="/res/whatsapp.png" alt="" width="50px"></a>
            <a href="${oferta.mail}" class="oferta_button mail">Envainos un correo<img src="/res/mail.png" alt="" width="50px"></a>
          </div>
        </div>
      </div>
    `;

    slidesContainer.appendChild(slide);
  });
}

function crearDots(){

  ofertas.forEach((_,i)=>{

    const dot = document.createElement("div");
    dot.className="dot";

    const progress=document.createElement("div");
    progress.className="dot-progress";

    dot.appendChild(progress);

    dot.addEventListener("click",()=>{
      index=i;
      actualizarCarrusel();
      reiniciarAuto();
    });

    dotsContainer.appendChild(dot);

  });

}

function actualizarCarrusel(){

  slidesContainer.style.transform =
    `translateX(-${index*100}%)`;

  const dots = document.querySelectorAll(".dot");

  dots.forEach(dot => {
    dot.classList.remove("active");

    const progress = dot.querySelector(".dot-progress");
    progress.style.animation = "none"; // reset
    progress.offsetHeight; // force reflow
    progress.style.animation = null; // vuelve a aplicar
  });

  dots[index].classList.add("active");
}

function siguiente(){
  index=(index+1)%ofertas.length;
  actualizarCarrusel();
}

function iniciarAuto(){
  intervalo=setInterval(siguiente,5000);
}

function reiniciarAuto(){
  clearInterval(intervalo);
  iniciarAuto();
}


function obtenerTextoPeriodo(periodo) {

  if (periodo.toLowerCase() === "yearly") {
    return "Disponible todo el año";
  }

  const [inicioStr, finStr] = periodo.split(" - ");

  const [diaInicio, mesInicio] = inicioStr.split(".").map(Number);
  const [diaFin, mesFin] = finStr.split(".").map(Number);

  const hoy = new Date();
  const año = hoy.getFullYear();

  let fechaInicio = new Date(año, mesInicio - 1, diaInicio);
  let fechaFin = new Date(año, mesFin - 1, diaFin);

  // Caso: rango cruza año (ej: 20.12 - 10.01)
  if (fechaFin < fechaInicio) {
    fechaFin.setFullYear(año + 1);
  }

  // Si hoy es antes del inicio → no vigente
  if (hoy < fechaInicio) {
    return null;
  }

  // Si ya terminó → no vigente
  if (hoy > fechaFin) {
    return null;
  }

  const diff = fechaFin - hoy;
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return dias === 0
    ? "Último día"
    : `Quedan ${dias} día${dias !== 1 ? "s" : ""}`;
}

cargarOfertas();