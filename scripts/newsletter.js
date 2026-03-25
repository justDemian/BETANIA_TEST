
const input = document.getElementById("emailInput");
const button = document.getElementById("subscribeBtn");
const msg = document.getElementById("feedbackMsg");

function validarEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

button.addEventListener("click", () => {

  const email = input.value.trim();

  // limpiar clases anteriores
  msg.classList.remove("success", "error");

  if(validarEmail(email)){
    msg.textContent = "CORREO DE CONFIRMACIÓN ENVIADO, REVISA TU BANDEJA DE ENTRADA";
    msg.classList.add("success");
    input.value = "";
  } else {
    msg.textContent = "FORMATO DE CORREO NO RECONOCIDO, REVISA QUE ESTÉ BIEN ESCRITO";
    msg.classList.add("error");
  }

});

input.addEventListener("keypress", (e) => {
  if(e.key === "Enter"){
    button.click();
  }
});
