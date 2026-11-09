/**
 * Microgreen — ініціалізація JS-плагінів (ЛР №10).
 * Бібліотеки підключено через CDN jsDelivr в кінці <body>:
 *   Swiper.js 11, Fancybox v5 (@fancyapps/ui), Typed.js 2.
 * Уся ініціалізація — після побудови DOM (DOMContentLoaded).
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Користувачі, які вимкнули анімації в ОС, отримують статичну версію.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Swiper.js — слайдер «Ферма зсередини» ---------- */
  if (typeof Swiper !== "undefined" && document.querySelector(".farm-swiper")) {
    // Об'єкт конфігурації: поведінка, навігація, пагінація, брейкпоінти.
    const farmSwiper = new Swiper(".farm-swiper", {
      loop: true, // після останнього слайда — знову перший
      speed: 600, // тривалість анімації перегортання, мс
      spaceBetween: 16,
      grabCursor: true,
      keyboard: { enabled: true, onlyInViewport: true }, // стрілки ← →
      a11y: {
        prevSlideMessage: "Попередній слайд",
        nextSlideMessage: "Наступний слайд",
        paginationBulletMessage: "Перейти до слайда {{index}}",
      },
      autoplay: reduceMotion
        ? false
        : {
            delay: 3500, // пауза між перегортаннями, мс
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // зупинка при наведенні миші
          },
      pagination: {
        el: ".farm-swiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".gallery-next",
        prevEl: ".gallery-prev",
      },
      // Mobile-first: кількість слайдів залежить від ширини екрана.
      breakpoints: {
        320: { slidesPerView: 1.15, spaceBetween: 12 },
        640: { slidesPerView: 2, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      },
    });

    // Посилання для Fancybox: поки відкрита галерея, автопрогортання на паузі.
    window.farmSwiper = farmSwiper;
  }

  /* ---------- 2. Fancybox v5 — альбом із тих самих фото ---------- */
  if (typeof Fancybox !== "undefined") {
    Fancybox.bind('[data-fancybox="farm-gallery"]', {
      Carousel: { transition: "fade" }, // плавне згасання між фото
      Images: { zoom: true, Panzoom: { maxScale: 3 } }, // зум до 300 %
      Thumbs: { type: "classic" }, // мініатюри внизу
      on: {
        init: () => window.farmSwiper && window.farmSwiper.autoplay && window.farmSwiper.autoplay.stop(),
        destroy: () => window.farmSwiper && window.farmSwiper.autoplay && !reduceMotion && window.farmSwiper.autoplay.start(),
      },
    });
  }

  /* ---------- 3. Typed.js — слоган у Hero ---------- */
  const typedTarget = document.getElementById("typed-text");
  if (typeof Typed !== "undefined" && typedTarget && !reduceMotion) {
    typedTarget.textContent = "";
    new Typed("#typed-text", {
      strings: [
        "Міська вертикальна ферма",
        "Зрізаємо в день доставки",
        "Номер партії на кожному лотку",
      ],
      typeSpeed: 50, // швидкість друкування, мс на символ
      backSpeed: 30, // швидкість стирання
      backDelay: 1800, // пауза перед стиранням
      loop: true,
      smartBackspace: true,
    });
  }
});
