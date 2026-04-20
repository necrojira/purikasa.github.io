// script.js - Con animación suave asegurada

document.addEventListener('DOMContentLoaded', function() {
  
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
  
  // Forzar reflow para asegurar animación en elementos nuevos (si es necesario)
  const style = document.createElement('style');
  style.textContent = `
    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .accordion-item.active .accordion-content {
      max-height: 800px;
    }
  `;
  document.head.appendChild(style);
  
});
/// script.js - Carrusel definitivo para pantallas pequeñas

document.addEventListener('DOMContentLoaded', function() {
  
  const sliderContainer = document.querySelector('.slider-container');
  const slider = document.querySelector('.slider');
  const slideTrack = document.querySelector('.slide-track');
  let slides = document.querySelectorAll('.slide');
  
  if (!slider || !slideTrack || slides.length === 0) return;
  
  // Detectar pantalla pequeña
  const isSmallScreen = window.innerWidth <= 413;
  
  // Variables
  let slideWidth = 0;
  let currentPosition = 0;
  let intervalId = null; // Usar setInterval en lugar de requestAnimationFrame
  let speed = 0.5;
  let totalOriginales = slides.length;
  let isPlaying = true;
  
  console.log('📱 Iniciando carrusel - Pantalla:', window.innerWidth, 'px');
  
  // Función para obtener cuántas slides mostrar
  function getSlidesToShow() {
    const width = window.innerWidth;
    
    if (width <= 413) {
      return 1;
    } else if (width <= 768) {
      return 1;
    } else if (width <= 1024) {
      return 2;
    } else {
      return 4;
    }
  }
  
  // Función para obtener velocidad
  function getSpeed() {
    const width = window.innerWidth;
    
    if (width <= 413) {
      return 0.8;
    } else if (width <= 768) {
      return 0.7;
    } else if (width <= 1024) {
      return 0.6;
    } else {
      return 0.5;
    }
  }
  
  // Reconstruir el slide track
  function rebuildSlideTrack() {
    if (!slideTrack) return;
    
    const originalSlides = document.querySelectorAll('.slide:not(.clone)');
    const imagenes = [];
    
    originalSlides.forEach(slide => {
      imagenes.push(slide.cloneNode(true));
    });
    
    slideTrack.innerHTML = '';
    
    // Agregar muchas copias para efecto infinito
    for (let i = 0; i < 6; i++) {
      imagenes.forEach(img => {
        const clone = img.cloneNode(true);
        clone.classList.add('clone');
        slideTrack.appendChild(clone);
      });
    }
    
    slides = document.querySelectorAll('.slide');
    totalOriginales = imagenes.length;
  }
  
  // Calcular el ancho de cada slide
  function calculateSlideWidth() {
    if (!sliderContainer) return;
    
    const containerWidth = sliderContainer.clientWidth;
    const slidesToShow = getSlidesToShow();
    slideWidth = containerWidth / slidesToShow;
    
    slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.height = `${slideWidth * 0.6}px`;
    });
    
    slideTrack.style.width = `${slideWidth * slides.length}px`;
  }
  
  // Mover carrusel
  function moveCarousel() {
    if (!isPlaying) return;
    if (!slideTrack) return;
    
    const anchoTotalOriginales = slideWidth * totalOriginales;
    currentPosition -= speed;
    
    // Reinicio infinito
    if (Math.abs(currentPosition) >= anchoTotalOriginales) {
      currentPosition = 0;
    }
    
    slideTrack.style.transform = `translateX(${currentPosition}px)`;
  }
  
  // Iniciar
  function startCarousel() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    isPlaying = true;
    speed = getSpeed();
    intervalId = setInterval(moveCarousel, 20); // 20ms para más suavidad
    console.log('▶️ Carrusel INICIADO');
  }
  
  // Detener
  function stopCarousel() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isPlaying = false;
    console.log('⏸️ Carrusel DETENIDO');
  }
  
  // Refrescar
  function refreshCarousel() {
    console.log('🔄 Refrescando carrusel...');
    
    const wasPlaying = isPlaying;
    
    stopCarousel();
    
    rebuildSlideTrack();
    calculateSlideWidth();
    currentPosition = 0;
    slideTrack.style.transform = `translateX(0px)`;
    speed = getSpeed();
    
    if (wasPlaying) {
      startCarousel();
    }
  }
  
  // ================= EVENTOS =================
  
  // Función para pausar (con feedback visual)
  function pauseCarousel(e) {
    if (isPlaying) {
      stopCarousel();
      // Feedback visual: reducir opacidad ligeramente
      slider.style.opacity = '0.7';
      setTimeout(() => {
        if (!isPlaying) {
          slider.style.opacity = '1';
        }
      }, 200);
      console.log('👆 Pausado por:', e.type);
    }
  }
  
  // Función para reanudar
  function resumeCarousel(e) {
    if (!isPlaying) {
      startCarousel();
      slider.style.opacity = '1';
      console.log('👆 Reanudado por:', e.type);
    }
  }
  
  // EVENTOS PARA MOUSE
  slider.addEventListener('mouseenter', pauseCarousel);
  slider.addEventListener('mouseleave', resumeCarousel);
  
  // EVENTOS PARA TACTIL (CELULAR)
  slider.addEventListener('touchstart', pauseCarousel, { passive: true });
  slider.addEventListener('touchend', resumeCarousel);
  slider.addEventListener('touchcancel', resumeCarousel);
  
  // También para clic (como respaldo)
  slider.addEventListener('click', function(e) {
    console.log('🖱️ Click detectado - isPlaying:', isPlaying);
    if (isPlaying) {
      stopCarousel();
    } else {
      startCarousel();
    }
  });
  
  // Cambio de tamaño
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refreshCarousel, 200);
  });
  
  // Cambio de orientación
  window.addEventListener('orientationchange', function() {
    setTimeout(refreshCarousel, 100);
  });
  
  // Inicializar
  rebuildSlideTrack();
  calculateSlideWidth();
  startCarousel();
  
  console.log('✅ Carrusel listo - Velocidad:', speed);
});