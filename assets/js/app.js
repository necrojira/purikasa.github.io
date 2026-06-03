document.addEventListener('DOMContentLoaded', function () {
  // ================= SLIDER: Drag / Swipe =================
  const container = document.querySelector('.slider-container');
  const slider = document.querySelector('.slider');

  if (container && slider) {
    let isDown = false;
    let startX, scrollLeft, dragged;

    const onStart = (pageX) => {
      isDown = true;
      dragged = false;
      const rect = container.getBoundingClientRect();
      startX = pageX - rect.left;
      scrollLeft = container.scrollLeft;
      container.classList.add('grabbing');
    };

    const onMove = (pageX) => {
      if (!isDown) return;
      const rect = container.getBoundingClientRect();
      const x = pageX - rect.left;
      const walk = x - startX;
      if (Math.abs(walk) > 5) dragged = true;
      container.scrollLeft = scrollLeft - walk;
    };

    const onEnd = () => {
      isDown = false;
      container.classList.remove('grabbing');
    };

    slider.addEventListener('mousedown', e => onStart(e.pageX));
    slider.addEventListener('mousemove', e => onMove(e.pageX));
    slider.addEventListener('mouseup', onEnd);
    slider.addEventListener('mouseleave', onEnd);

    slider.addEventListener('touchstart', e => onStart(e.touches[0].pageX), { passive: true });
    slider.addEventListener('touchmove', e => onMove(e.touches[0].pageX), { passive: true });
    slider.addEventListener('touchend', onEnd);

    // Lightbox
    const images = container.querySelectorAll('.slide img');
    if (images.length) {
      const lb = document.createElement('div');
      lb.className = 'lightbox';
      const lbImg = document.createElement('img');
      lb.appendChild(lbImg);
      document.body.appendChild(lb);

      images.forEach(img => {
        img.addEventListener('click', () => {
          if (dragged) return;
          lbImg.src = img.src;
          lb.classList.add('active');
        });
      });

      lb.addEventListener('click', () => lb.classList.remove('active'));
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') lb.classList.remove('active');
      });
    }
  }

  // ================= BOTONES DE FILTROS =================
  const WA_NUMBER = '525529411623';
  const items = document.querySelectorAll('.filters-list li');

  items.forEach(li => {
    const img = li.querySelector('img');
    const div = li.querySelector('div');
    if (!img || !div) return;

    const productName = img.getAttribute('alt') || 'Producto';
    const pdfPath = li.getAttribute('data-pdf');

    const btns = document.createElement('div');
    btns.className = 'filter-buttons';

    if (pdfPath) {
      const pdfBtn = document.createElement('a');
      pdfBtn.href = pdfPath;
      pdfBtn.textContent = 'Ficha técnica';
      pdfBtn.className = 'btn-ficha';
      pdfBtn.target = '_blank';
      btns.appendChild(pdfBtn);
    }

    const waMsg = encodeURIComponent(`Hola, me interesa el producto: ${productName}`);
    const waBtn = document.createElement('a');
    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
    waBtn.textContent = 'Me interesa';
    waBtn.className = 'btn-whatsapp';
    waBtn.target = '_blank';
    btns.appendChild(waBtn);
    div.appendChild(btns);
  });
});
