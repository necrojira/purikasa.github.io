// script.js - Carrusel infinito

document.addEventListener('DOMContentLoaded', function() {
  
  // ================= ACORDEÓN =================
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', function(e) {
      if (e.target.closest('.btn-comprar')) return;
      
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      item.classList.toggle('active');
    });
  });
  
  // ================= CARRUSEL INFINITO =================
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
    let isTransitioning = false;
    
    // Clonar slides para loop infinito
    function initSlides() {
      const slidesOriginales = document.querySelectorAll('.slide');
      slidesOriginales.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('clone');
        slideTrack.appendChild(clone);
      });
    }
    initSlides();
    
    function getSpeed() {
      if (window.innerWidth <= 480) return 0.3;
      if (window.innerWidth <= 768) return 0.4;
      return 0.5;
    }
    
    function getSlidesToShow() {
      const width = window.innerWidth;
      if (width <= 480) return 1;
      if (width <= 768) return 2;
      if (width <= 1024) return 3;
      return 4;
    }
    
    function calculateSlideWidth() {
      if (!sliderContainer) return;
      const containerWidth = sliderContainer.clientWidth;
      const slidesToShow = getSlidesToShow();
      slideWidth = containerWidth / slidesToShow;
      
      const allSlides = slideTrack.querySelectorAll('.slide');
      allSlides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.flex = `0 0 ${slideWidth}px`;
        slide.style.height = 'auto';
      });
      
      if (slideTrack) {
        slideTrack.style.width = `${slideWidth * allSlides.length}px`;
      }
    }
    
    function moveCarousel() {
      if (!isPlaying) return;
      
      const limite = slideWidth * totalOriginales;
      
      currentPosition -= speed;
      
      // Reset instantáneo sin transición para loop infinito
      if (Math.abs(currentPosition) >= limite) {
        currentPosition = 0;
        slideTrack.style.transition = 'none';
      } else {
        slideTrack.style.transition = 'transform 0.3s linear';
      }
      
      slideTrack.style.transform = `translateX(${currentPosition}px)`;
    }
    
    function startCarousel() {
      if (intervalId) clearInterval(intervalId);
      isPlaying = true;
      speed = getSpeed();
      intervalId = setInterval(moveCarousel, 16);
    }
    
    function stopCarousel() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      isPlaying = false;
    }
    
    function refreshCarousel() {
      stopCarousel();
      slides = document.querySelectorAll('.slide');
      totalOriginales = slides.length;
      
      // Remover clones anteriores
      slideTrack.querySelectorAll('.clone').forEach(clone => clone.remove());
      initSlides();
      
      calculateSlideWidth();
      currentPosition = 0;
      slideTrack.style.transition = 'none';
      slideTrack.style.transform = `translateX(0px)`;
      speed = getSpeed();
      startCarousel();
    }
    
    slider.addEventListener('mouseenter', stopCarousel);
    slider.addEventListener('mouseleave', startCarousel);
    slider.addEventListener('touchstart', stopCarousel, { passive: true });
    slider.addEventListener('touchend', startCarousel);
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(refreshCarousel, 200);
    });
    
    calculateSlideWidth();
    startCarousel();
  }
});