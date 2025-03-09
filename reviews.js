document.addEventListener("DOMContentLoaded", () => {
    // Ініціалізація змінних
    let currentIndex = 0
    let interval
    let currentRating = 0
  
    // Завантаження збережених відгуків
    const reviews = JSON.parse(localStorage.getItem("reviews")) || []
  
    // Функція для відображення відгуків
    function displayReviews() {
      const track = document.getElementById("reviewsTrack")
      const dotsContainer = document.getElementById("reviewDots")
  
      track.innerHTML = ""
      dotsContainer.innerHTML = ""
  
      reviews.forEach((review, index) => {
        // Створення карточки відгуку
        const card = document.createElement("div")
        card.className = "review-card animate-on-scroll review-animation"
        card.style.setProperty("--animation-order", index)
        card.innerHTML = `
              <div class="review-header">
                  <img src="${review.image || "/placeholder.svg?height=80&width=80"}" alt="Фото клієнта" class="review-avatar">
                  <div class="review-info">
                      <h3>${review.name}</h3>
                      <div class="review-stars">
                          ${getStarsHTML(review.rating)}
                      </div>
                  </div>
              </div>
              <p class="review-text">"${review.text}"</p>
              <p class="review-car">Придбано: ${review.car}</p>
          `
        track.appendChild(card)
  
        // Створення точки для навігації
        const dot = document.createElement("span")
        dot.className = `dot ${index === currentIndex ? "active" : ""}`
        dot.addEventListener("click", () => goToSlide(index))
        dotsContainer.appendChild(dot)
      })
  
      updateSlider()
  
      // Ініціалізуємо анімації для нових елементів
      initScrollAnimations()
    }
  
    // Функція для отримання HTML зірочок рейтингу
    function getStarsHTML(rating) {
      let stars = ""
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          stars += '<i class="fas fa-star"></i>'
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
          stars += '<i class="fas fa-star-half-alt"></i>'
        } else {
          stars += '<i class="far fa-star"></i>'
        }
      }
      return stars
    }
  
    // Обробка форми додавання відгуку
    const reviewForm = document.getElementById("reviewForm")
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const newReview = {
        name: document.getElementById("reviewName").value,
        car: document.getElementById("reviewCar").value,
        text: document.getElementById("reviewText").value,
        rating: currentRating,
        image: await getImageData(),
      }
  
      reviews.push(newReview)
      localStorage.setItem("reviews", JSON.stringify(reviews))
  
      displayReviews()
      toggleReviewForm()
      reviewForm.reset()
      currentRating = 0
      updateRatingDisplay()
    })
  
    // Обробка рейтингу
    const ratingStars = document.querySelectorAll(".rating i")
    ratingStars.forEach((star) => {
      star.addEventListener("click", function () {
        currentRating = Number.parseInt(this.dataset.rating)
        updateRatingDisplay()
      })
    })
  
    function updateRatingDisplay() {
      ratingStars.forEach((star) => {
        const rating = Number.parseInt(star.dataset.rating)
        star.className = rating <= currentRating ? "fas fa-star" : "far fa-star"
      })
    }
  
    // Функція для конвертації зображення в base64
    async function getImageData() {
      const input = document.getElementById("reviewImage")
      if (input.files && input.files[0]) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = () => reject(null)
          reader.readAsDataURL(input.files[0])
        })
      }
      return null
    }
  
    // Функції для слайдера
    function updateSlider() {
      const track = document.querySelector(".reviews-track")
      const cards = document.querySelectorAll(".review-card")
      if (cards.length === 0) return
  
      const cardWidth = cards[0].offsetWidth + 32
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`
  
      document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
      })
    }
  
    function goToSlide(index) {
      currentIndex = index
      updateSlider()
      resetAutoSlide()
    }
  
    function nextSlide() {
      const totalSlides = document.querySelectorAll(".review-card").length
      currentIndex = (currentIndex + 1) % totalSlides
      updateSlider()
    }
  
    function prevSlide() {
      const totalSlides = document.querySelectorAll(".review-card").length
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
      updateSlider()
    }
  
    // Автоматичне прокручування
    function startAutoSlide() {
      interval = setInterval(nextSlide, 5000)
    }
  
    function stopAutoSlide() {
      clearInterval(interval)
    }
  
    function resetAutoSlide() {
      stopAutoSlide()
      startAutoSlide()
    }
  
    // Обробники подій для кнопок навігації
    document.querySelector(".review-nav.prev").addEventListener("click", () => {
      prevSlide()
      resetAutoSlide()
    })
  
    document.querySelector(".review-nav.next").addEventListener("click", () => {
      nextSlide()
      resetAutoSlide()
    })
  
    // Зупинка автопрокрутки при наведенні
    const track = document.querySelector(".reviews-track")
    track.addEventListener("mouseenter", stopAutoSlide)
    track.addEventListener("mouseleave", startAutoSlide)
  
    // Ініціалізація слайдера
    displayReviews()
    startAutoSlide()
  
    // Оновлення слайдера при зміні розміру вікна
    window.addEventListener("resize", updateSlider)
  
    // Робимо функцію доступною глобально
    window.displayReviews = displayReviews
  
    // Dummy function for initScrollAnimations
    function initScrollAnimations() {
      // This function should contain the actual implementation for initializing scroll animations.
      // For now, it's a placeholder.
      console.log("Scroll animations initialized (placeholder)")
    }
  })
  
  // Функція для показу/приховання форми
  function toggleReviewForm() {
    const form = document.getElementById("reviewForm")
    form.classList.toggle("hidden")
  }
  
  