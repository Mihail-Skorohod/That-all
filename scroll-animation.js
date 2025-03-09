document.addEventListener('DOMContentLoaded', function() {
    // Вибір всіх елементів, які потрібно анімувати
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Опції для Intersection Observer
    const observerOptions = {
        root: null, // використовуємо viewport як контейнер
        rootMargin: '0px', // без відступів
        threshold: 0.15 // елемент буде вважатися видимим, коли 15% його буде в зоні видимості
    };
    
    // Функція, яка буде викликатися при перетині елемента з viewport
    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            // Якщо елемент видимий
            if (entry.isIntersecting) {
                // Додаємо клас для анімації
                entry.target.classList.add('animated');
                
                // Якщо елемент має спеціальний клас анімації, додаємо його
                if (entry.target.dataset.animation) {
                    entry.target.classList.add(entry.target.dataset.animation);
                }
                
                // Перестаємо спостерігати за елементом після анімації
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Створюємо Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Починаємо спостерігати за всіма елементами
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Додаємо класи анімації до елементів, які вже видимі при завантаженні
    setTimeout(() => {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('animated');
                if (element.dataset.animation) {
                    element.classList.add(element.dataset.animation);
                }
                observer.unobserve(element);
            }
        });
    }, 100);
});

// Додаткова функція для ручного запуску анімації для нових елементів
function initScrollAnimations() {
    const newElements = document.querySelectorAll('.animate-on-scroll:not(.observed)');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.dataset.animation) {
                    entry.target.classList.add(entry.target.dataset.animation);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    newElements.forEach(element => {
        element.classList.add('observed');
        observer.observe(element);
    });
}
