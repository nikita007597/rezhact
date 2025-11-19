// часы

function updateHeaderClock() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const time = now.toLocaleTimeString('ru-RU', options);
    document.getElementById('clock').textContent = time;
}

// запуск
setInterval(updateHeaderClock, 1000);
updateHeaderClock();

// Слайдер

let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const slideInterval = 3000;
function changeSlide() {
    slides[currentIndex].style.opacity = 0;
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].style.opacity = 1;
}
setInterval(changeSlide, slideInterval);


