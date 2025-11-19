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


// справочник

document.addEventListener('DOMContentLoaded', function() {
            const accordionItems = document.querySelectorAll('.containerr');
            
            // Добавляем обработчик клика на каждый заголовок
            accordionItems.forEach(item => {
                const header = item.querySelector('.name-tit');
                
                header.addEventListener('click', function() {
                    // Закрываем все другие вкладки
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            // Сбрасываем высоту у закрытых элементов
                            const otherInfo = otherItem.querySelector('.info');
                            otherInfo.style.maxHeight = '0';
                        }
                    });
                    
                    // Переключаем текущую вкладку
                    const isActive = item.classList.contains('active');
                    item.classList.toggle('active');
                    
                    const info = item.querySelector('.info');
                    
                    if (!isActive) {
                        // Открываем вкладку - устанавливаем точную высоту
                        const contentHeight = info.scrollHeight + 'px';
                        info.style.maxHeight = contentHeight;
                    } else {
                        // Закрываем вкладку
                        info.style.maxHeight = '0';
                    }
                });
            });
            
            // Опционально: закрытие при клике вне аккордеона
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.containerr')) {
                    accordionItems.forEach(item => {
                        item.classList.remove('active');
                        const info = item.querySelector('.info');
                        info.style.maxHeight = '0';
                    });
                }
            });
            
            // Автоматически устанавливаем высоту для активных вкладок при загрузке
            accordionItems.forEach(item => {
                if (item.classList.contains('active')) {
                    const info = item.querySelector('.info');
                    const contentHeight = info.scrollHeight + 'px';
                    info.style.maxHeight = contentHeight;
                }
            });
        });


