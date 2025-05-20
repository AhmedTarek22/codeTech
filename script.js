function setupCarousel(carouselElement, indicatorsElement) {
  const track = carouselElement.querySelector(".carousel-track");
  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  const slideCount = slides.length;
  let currentIndex = 0;
  let autoScrollInterval;

  // Clone first and last slides for infinite effect
  const firstSlideClone = slides[0].cloneNode(true);
  const lastSlideClone = slides[slideCount - 1].cloneNode(true);

  track.appendChild(firstSlideClone);
  track.insertBefore(lastSlideClone, slides[0]);

  // Create indicators
  slides.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    indicator.addEventListener("click", () => {
      goToSlide(index);
    });
    indicatorsElement.appendChild(indicator);
  });

  const indicators = Array.from(
    indicatorsElement.querySelectorAll(".carousel-indicator")
  );

  // Set initial position
  track.style.transform = `translateX(-${100}%)`;
  updateIndicators(0);

  // Start auto-scroll
  startAutoScroll();

  function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
      nextSlide();
    }, 4000);
  }

  function goToSlide(index) {
    const adjustedPosition = (index + 1) * 100;
    track.style.transition = "transform 0.7s ease-in-out";
    track.style.transform = `translateX(-${adjustedPosition}%)`;
    currentIndex = index;
    updateIndicators(currentIndex);
    startAutoScroll();
  }

  function nextSlide() {
    if (currentIndex >= slideCount - 1) {
      goToSlide(slideCount - 1 + 1);

      setTimeout(() => {
        track.style.transition = "none";
        track.style.transform = `translateX(-${100}%)`;
        currentIndex = 0;
        updateIndicators(currentIndex);

        setTimeout(() => {
          track.style.transition = "transform 0.7s ease-in-out";
        }, 50);
      }, 700);
    } else {
      goToSlide(currentIndex + 1);
    }
  }

  function updateIndicators(activeIndex) {
    indicators.forEach((indicator, index) => {
      if (index === activeIndex) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  // Handle transition end
  track.addEventListener("transitionend", () => {
    if (currentIndex >= slideCount) {
      track.style.transition = "none";
      track.style.transform = `translateX(-${100}%)`;
      currentIndex = 0;
      updateIndicators(currentIndex);

      setTimeout(() => {
        track.style.transition = "transform 0.7s ease-in-out";
      }, 50);
    }

    if (currentIndex < 0) {
      track.style.transition = "none";
      track.style.transform = `translateX(-${slideCount * 100}%)`;
      currentIndex = slideCount - 1;
      updateIndicators(currentIndex);

      setTimeout(() => {
        track.style.transition = "transform 0.7s ease-in-out";
      }, 50);
    }
  });

  // Pause on hover
  carouselElement.addEventListener("mouseenter", () => {
    clearInterval(autoScrollInterval);
  });

  carouselElement.addEventListener("mouseleave", () => {
    startAutoScroll();
  });

  // Touch support
  let startX, moveX;
  let isDragging = false;

  carouselElement.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoScrollInterval);
    },
    { passive: true }
  );

  carouselElement.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      moveX = e.touches[0].clientX;
      const diffX = moveX - startX;
      const currentTransform = -(currentIndex + 1) * 100;

      track.style.transition = "none";
      track.style.transform = `translateX(calc(${currentTransform}% + ${diffX}px))`;
    },
    { passive: true }
  );

  carouselElement.addEventListener("touchend", () => {
    if (!isDragging) return;

    const diffX = moveX - startX;

    if (diffX > 50 && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else if (diffX < -50 && currentIndex < slideCount - 1) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(currentIndex);
    }

    isDragging = false;
    startAutoScroll();
  });
}

// Initialize the carousel
document.addEventListener("DOMContentLoaded", () => {
  setupCarousel(
    document.querySelector("#imageCarousel"),
    document.querySelector("#carouselIndicators")
  );
});

//// Companies
document.addEventListener("DOMContentLoaded", () => {
  const company = document.querySelector(".company");
  const cards = document.querySelectorAll(".card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let index = 0;
  const visibleCards = 5;
  const totalCards = cards.length;

  // استنساخ الكروت لإعطاء تأثير دائري
  const cloneCards = [...cards].map((card) => card.cloneNode(true));
  cloneCards.forEach((clone) => company.appendChild(clone));

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth + 20;
    const moveAmount = index * cardWidth;
    company.style.transform = `translateX(-${moveAmount}px)`;

    // إزالة التمييز عن جميع الكروت
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("active-card");
    });

    // تحديد الكارت الأوسط
    const allCards = document.querySelectorAll(".card");
    const currentVisibleCards = [...allCards].slice(
      index,
      index + visibleCards
    );
    const middleIndex = Math.floor(currentVisibleCards.length / 2);
    const middleCard = currentVisibleCards[middleIndex];

    if (middleCard) {
      middleCard.classList.add("active-card");
    }
  }

  function nextSlide() {
    const cardWidth = cards[0].offsetWidth + 20;
    index++;
    company.style.transition = "transform 0.5s ease-in-out";
    updateSlider();

    if (index === totalCards) {
      setTimeout(() => {
        company.style.transition = "none";
        index = 0;
        updateSlider();
      }, 510);
    }
  }

  function prevSlide() {
    const cardWidth = cards[0].offsetWidth + 20;
    if (index === 0) {
      company.style.transition = "none";
      index = totalCards;
      updateSlider();
      setTimeout(() => {
        company.style.transition = "transform 0.5s ease-in-out";
        index--;
        updateSlider();
      }, 20);
    } else {
      index--;
      company.style.transition = "transform 0.5s ease-in-out";
      updateSlider();
    }
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // تشغيل تلقائي
  let autoSlide = setInterval(nextSlide, 3000);

  // إيقاف التشغيل عند تمرير الماوس
  document
    .querySelector(".company-section")
    .addEventListener("mouseenter", () => {
      clearInterval(autoSlide);
    });

  document
    .querySelector(".company-section")
    .addEventListener("mouseleave", () => {
      autoSlide = setInterval(nextSlide, 3000);
    });
});

//// Choose codeTech
// document.addEventListener("DOMContentLoaded", () => {
//   const codeTech_cards = document.querySelector(".codeTech_cards");
//   const cards = document.querySelectorAll(".codeTeck_card");
//   const prevBtn = document.getElementById("prevBtn2");
//   const nextBtn = document.getElementById("nextBtn2");

//   let index = 0;
//   const visibleCards = 4;
//   const totalCards = cards.length;

//   // استنساخ الكروت لإعطاء تأثير دائري
//   const cloneCards = [...cards].map((card) => card.cloneNode(true));
//   cloneCards.forEach((clone) => codeTech_cards.appendChild(clone));

//   function updateSlider() {
//     const cardWidth = cards[0].offsetWidth + 15;
//     const moveAmount = index * cardWidth;
//     codeTech_cards.style.transform = `translateX(-${moveAmount}px)`;
//   }

//   function nextSlide() {
//     index++;
//     codeTech_cards.style.transition = "transform 0.5s ease-in-out";
//     updateSlider();

//     if (index === totalCards) {
//       setTimeout(() => {
//         codeTech_cards.style.transition = "none";
//         index = 0;
//         updateSlider();
//       }, 510);
//     }
//   }

//   function prevSlide() {
//     if (index === 0) {
//       codeTech_cards.style.transition = "none";
//       index = totalCards;
//       updateSlider();
//       setTimeout(() => {
//         codeTech_cards.style.transition = "transform 0.5s ease-in-out";
//         index--;
//         updateSlider();
//       }, 20);
//     } else {
//       index--;
//       codeTech_cards.style.transition = "transform 0.5s ease-in-out";
//       updateSlider();
//     }
//   }

//   nextBtn.addEventListener("click", nextSlide);
//   prevBtn.addEventListener("click", prevSlide);

//   // تشغيل تلقائي
//   let autoSlide = setInterval(nextSlide, 3000);
// });


document.addEventListener("DOMContentLoaded", () => {
  const codeTech_cards = document.querySelector(".codeTech_cards");
  const prevBtn = document.getElementById("prevBtn2");
  const nextBtn = document.getElementById("nextBtn2");

  let index = 0;

  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 992) return 2;
    if (width < 1200) return 3;
    return 4;
  }

  const originalCards = Array.from(document.querySelectorAll(".codeTeck_card"));
  const totalCards = originalCards.length;

  // استنساخ الكروت لإعطاء تأثير دائري
  const cloneCards = originalCards.map((card) => card.cloneNode(true));
  cloneCards.forEach((clone) => codeTech_cards.appendChild(clone));

  function updateSlider() {
    const cardWidth = originalCards[0].offsetWidth + 30; // 30 = gap
    const moveAmount = index * cardWidth;
    codeTech_cards.style.transform = `translateX(-${moveAmount}px)`;
  }

  function nextSlide() {
    index++;
    const visibleCards = getVisibleCardsCount();
    codeTech_cards.style.transition = "transform 0.5s ease-in-out";
    updateSlider();

    if (index === totalCards) {
      setTimeout(() => {
        codeTech_cards.style.transition = "none";
        index = 0;
        updateSlider();
      }, 510);
    }
  }

  function prevSlide() {
    const visibleCards = getVisibleCardsCount();
    if (index === 0) {
      codeTech_cards.style.transition = "none";
      index = totalCards;
      updateSlider();
      setTimeout(() => {
        codeTech_cards.style.transition = "transform 0.5s ease-in-out";
        index--;
        updateSlider();
      }, 20);
    } else {
      index--;
      codeTech_cards.style.transition = "transform 0.5s ease-in-out";
      updateSlider();
    }
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // تشغيل تلقائي
  let autoSlide = setInterval(nextSlide, 3000);

  // عند تغيير حجم الشاشة، أعد حساب التمرير
  window.addEventListener("resize", () => {
    updateSlider();
  });
});
