// script.js - Acordeón

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
  

});