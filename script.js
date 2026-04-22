// script.js - Con animación suave y carrusel mejorado para móvil

document.addEventListener('DOMContentLoaded', function() {
  
  // ================= ACORDEÓN =================
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', function(e) {
      if (e.target.closest('.btn-comprar')) return;
      
      // Cerrar otros acordeones
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Alternar el actual
      item.classList.toggle('active');
    });
  });
  
  // ================= CARRUSEL MEJORADO PARA MÓVIL =================
  const sliderContainer = document.querySelector('.slider-container');
  const slider = document.querySelector('.slider');
  const slideTrack = document.querySelector('.slide-track');
  
  if (slider && slideTrack) {
    let slides = document.querySelectorAll('.slide');
    let slideWidth = 0;
    let currentPosition = 0;
    let intervalId = null;
    let speed = 0.5;
    let isPlaying = true;
    let totalOriginales = slides.length;
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    // Velocidad más lenta en móvil
    function getSpeed() {
      if (window.innerWidth <= 480) return 0.3;
      if (window.innerWidth <= 768) return 0.4;
      return 0.5;
    }
    
    // Cuántas slides mostrar
    function getSlidesToShow() {
      const width = window.innerWidth;
      if (width <= 480) return 1;
      if (width <= 768) return 2;
      if (width <= 1024) return 3;
      return 4;
    }
    
    // Calcular ancho de cada slide
    function calculateSlideWidth() {
      if (!sliderContainer) return;
      const containerWidth = sliderContainer.clientWidth;
      const slidesToShow = getSlidesToShow();
      slideWidth = containerWidth / slidesToShow;
      
      slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.flex = `0 0 ${slideWidth}px`;
        // Altura automática manteniendo proporción
        slide.style.height = 'auto';
      });
      
      if (slideTrack) {
        slideTrack.style.width = `${slideWidth * slides.length}px`;
      }
    }
    
    // Mover carrusel
    function moveCarousel() {
      if (!isPlaying) return;
      if (!slideTrack) return;
      
      const anchoTotalOriginales = slideWidth * totalOriginales;
      currentPosition -= speed;
      
      if (Math.abs(currentPosition) >= anchoTotalOriginales) {
        currentPosition = 0;
      }
      
      slideTrack.style.transform = `translateX(${currentPosition}px)`;
    }
    //clonar el carrousel
    function cloneSlides() {
  const slidesOriginales = document.querySelectorAll('.slide');
  
  slidesOriginales.forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    slideTrack.appendChild(clone);
  });
}

    // Iniciar carrusel
    function startCarousel() {
      if (intervalId) clearInterval(intervalId);
      isPlaying = true;
      speed = getSpeed();
      intervalId = setInterval(moveCarousel, 30);
    }
    
    // Detener carrusel
    function stopCarousel() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      isPlaying = false;
    }
    
    // Reiniciar carrusel
    function refreshCarousel() {
      stopCarousel();
      slides = document.querySelectorAll('.slide');
      totalOriginales = document.querySelectorAll('.slide:not(.clone)').length;
      calculateSlideWidth();
      currentPosition = 0;
      if (slideTrack) {
        slideTrack.style.transform = `translateX(0px)`;
      }
      speed = getSpeed();
      startCarousel();
    }
    
    // Eventos para pausar/reanudar
    slider.addEventListener('mouseenter', stopCarousel);
    slider.addEventListener('mouseleave', startCarousel);
    slider.addEventListener('touchstart', stopCarousel, { passive: true });
    slider.addEventListener('touchend', startCarousel);
    
    // Evento de redimensionamiento
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(refreshCarousel, 200);
    });
    
    // Inicializar
    calculateSlideWidth();
    startCarousel();
  }
});