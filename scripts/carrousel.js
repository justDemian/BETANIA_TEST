const slidesContainer = document.getElementById("slides");
const dotsContainer = document.getElementById("dots");

let ofertas = [];
let index = 0;
let intervalo;

async function cargarOfertas(){

  const res = await fetch("./content/ofertas.json");
  const data = await res.json();
  ofertas = data.ofertas;

  crearSlides();
  crearDots();
  actualizarCarrusel();
  iniciarAuto();
}

function crearSlides(){

  ofertas.forEach(oferta => {

    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
      <div class="slide-bg" style="background-image: url('${oferta.imagen}')"></div>

      <div class="slide-content">
        <h2>${oferta.titulo}</h2>
        <p>${oferta.contenido}</p>

        <div class="precios">
          <span class="precio-real">$${oferta.precio_real}</span>
          <span class="precio-desc">$${oferta.precio_descuento}</span>
        </div>

        <p class="periodo">${oferta.periodo}</p>

        <a class="boton" href="${oferta.referencia}">
          Aprovechar esta Promoción
        </a>
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

cargarOfertas();