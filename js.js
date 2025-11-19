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



 // Рабочий календарь с возможностью навигации по месяцам
        class EventCalendar {
            constructor() {
                this.currentDate = new Date();
                this.events = [
                    
                    { date: new Date(2025, 10, 22), title: 'Чемпионат Режа по шахматам', location: 'МБУК ДЮСОК Антей' },
                    
                    { date: new Date(2025, 10, 29), title: 'Чемпионат Режа по шахматам', location: 'МБУК ДЮСОК Антей' },
                    { date: new Date(2025, 10, 20), title: 'Первенство области по волейболу', location: 'МБУК ДО СШ Россия' },
                    { date: new Date(2025, 10, 21), title: 'Первенство области по волейболу', location: 'МБУК ДО СШ Россия' },
                    { date: new Date(2025, 10, 22), title: 'Первенство области по волейболу', location: 'МБУК ДО СШ Россия' },
                    { date: new Date(2025, 10, 23), title: 'Первенство области по волейболу', location: 'МБУК ДО СШ Россия' },
                    { date: new Date(2025, 10, 30), title: 'Личное первенство по быстрым шахматам', location: 'МБУК ДК Металлург' }
                ];
                this.init();
            }

            init() {
                this.renderCalendar();
                this.setupEventListeners();
            }

            renderCalendar() {
                const calendarElement = document.getElementById('calendar');
                const monthYearElement = document.getElementById('currentMonthYear');
                
                // Очищаем календарь (кроме дней недели)
                while (calendarElement.children.length > 7) {
                    calendarElement.removeChild(calendarElement.lastChild);
                }

                // Устанавливаем заголовок
                const monthNames = [
                    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ];
                monthYearElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

                // Получаем первый день месяца и количество дней
                const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Корректировка для Пн-Вс

                // Добавляем пустые ячейки для дней предыдущего месяца
                const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
                for (let i = 0; i < startingDay; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day other-month';
                    dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
                    calendarElement.appendChild(dayElement);
                }

                // Добавляем дни текущего месяца
                const today = new Date();
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    dayElement.textContent = i;

                    // Проверяем, является ли день сегодняшним
                    if (this.currentDate.getMonth() === today.getMonth() && 
                        this.currentDate.getFullYear() === today.getFullYear() && 
                        i === today.getDate()) {
                        dayElement.classList.add('today');
                    }

                    // Проверяем, есть ли события в этот день
                    const hasEvent = this.events.some(event => 
                        event.date.getDate() === i && 
                        event.date.getMonth() === this.currentDate.getMonth() && 
                        event.date.getFullYear() === this.currentDate.getFullYear()
                    );

                    if (hasEvent) {
                        dayElement.classList.add('event-day');
                    }

                    // Добавляем обработчик клика
                    dayElement.addEventListener('click', () => this.selectDay(i, dayElement));
                    calendarElement.appendChild(dayElement);
                }

                // Добавляем пустые ячейки для дней следующего месяца
                const totalCells = startingDay + daysInMonth;
                const remainingCells = 42 - totalCells; // 6 строк по 7 дней
                for (let i = 1; i <= remainingCells; i++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day other-month';
                    dayElement.textContent = i;
                    calendarElement.appendChild(dayElement);
                }
            }

            selectDay(day, element) {
                // Убираем выделение у всех дней
                document.querySelectorAll('.calendar-day').forEach(dayEl => {
                    dayEl.classList.remove('selected');
                });

                // Добавляем выделение выбранному дню
                element.classList.add('selected');

                // Показываем события для выбранного дня
                this.showEventsForDay(day);
            }

            showEventsForDay(day) {
                const eventsContainer = document.getElementById('calendarEvents');
                const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                
                const dayEvents = this.events.filter(event => 
                    event.date.getDate() === selectedDate.getDate() && 
                    event.date.getMonth() === selectedDate.getMonth() && 
                    event.date.getFullYear() === selectedDate.getFullYear()
                );

                eventsContainer.innerHTML = '';

                if (dayEvents.length > 0) {
                    dayEvents.forEach(event => {
                        const eventElement = document.createElement('div');
                        eventElement.className = 'calendar-event-item';
                        eventElement.innerHTML = `
                            <div>
                                <strong>${event.title}</strong>
                                <div style="font-size: 0.8rem; color: var(--gray); margin-top: 2px;">
                                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                                </div>
                            </div>
                        `;
                        eventsContainer.appendChild(eventElement);
                    });
                } else {
                    const noEventsElement = document.createElement('div');
                    noEventsElement.className = 'calendar-event-item';
                    noEventsElement.textContent = 'На этот день событий нет';
                    eventsContainer.appendChild(noEventsElement);
                }
            }

            changeMonth(direction) {
                this.currentDate.setMonth(this.currentDate.getMonth() + direction);
                this.renderCalendar();
                
                // Сбрасываем выделение дня при смене месяца
                document.querySelectorAll('.calendar-day').forEach(dayEl => {
                    dayEl.classList.remove('selected');
                });
                
                // Очищаем список событий
                document.getElementById('calendarEvents').innerHTML = 
                    '<div class="calendar-event-item">Выберите день для просмотра событий</div>';
            }

            setupEventListeners() {
                document.getElementById('prevMonth').addEventListener('click', () => {
                    this.changeMonth(-1);
                });

                document.getElementById('nextMonth').addEventListener('click', () => {
                    this.changeMonth(1);
                });
            }
        }

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация календаря
            const calendar = new EventCalendar();

            // Фильтрация контента
            const filterButtons = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('.card');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filterValue = this.textContent;
                    
                    cards.forEach(card => {
                        if (filterValue === 'Все') {
                            card.style.display = 'block';
                        } else {
                            const category = card.querySelector('.card-category').textContent;
                            if (category === filterValue) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
            
            // Имитация загрузки карты
            const mapPlaceholder = document.querySelector('.map-placeholder');
            setTimeout(() => {
                mapPlaceholder.innerHTML = '<i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i><br>Интерактивная карта загружается...';
            }, 1500);
            
            // Добавление анимации при прокрутке
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            cards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s, transform 0.5s';
                observer.observe(card);
            });
        });

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('.card');
            const noResultsMessage = document.getElementById('no-results');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Убираем активный класс со всех кнопок
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Добавляем активный класс к нажатой кнопке
                    this.classList.add('active');
                    
                    // Получаем значение фильтра
                    const filterValue = this.getAttribute('data-filter');
                    
                    let visibleCardsCount = 0;
                    
                    // Показываем/скрываем карточки в зависимости от фильтра
                    cards.forEach(card => {
                        if (filterValue === 'all') {
                            card.style.display = 'block';
                            visibleCardsCount++;
                        } else {
                            if (card.getAttribute('data-category') === filterValue) {
                                card.style.display = 'block';
                                visibleCardsCount++;
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                    
                    // Показываем или скрываем сообщение "Ничего не найдено"
                    if (visibleCardsCount === 0) {
                        noResultsMessage.style.display = 'block';
                    } else {
                        noResultsMessage.style.display = 'none';
                    }
                });
            });
        });
