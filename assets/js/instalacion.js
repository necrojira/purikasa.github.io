document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modalVideo");
  const frame = document.getElementById("videoFrame");

  // Agregar evento a cada tarjeta
  document.querySelectorAll(".video-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");

      frame.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      modal.style.display = "block";
    });
  });

  // Cerrar al dar click en la X
  document.querySelector(".cerrar").addEventListener("click", () => {
    frame.src = "";
    modal.style.display = "none";
  });

  // Cerrar al hacer click fuera del video
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      frame.src = "";
      modal.style.display = "none";
    }
  });

});