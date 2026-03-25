
document.querySelectorAll(".service_card").forEach(card => {

  const content = card.innerHTML;

  card.innerHTML = `
    <div class="card_face card_front">
      <h3>${card.querySelector("h3").innerText}</h3>
    </div>

    <div class="card_face card_back">
      ${content}
    </div>
  `;

});