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


// Функции для модальных окон
        function showModal(modalId) {
            document.getElementById(modalId).style.display = 'flex';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Функция для показа уведомлений
        function showNotification(message) {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notification-text');
            
            notificationText.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Обновление погоды (имитация)
        function updateWeather() {
            const weatherWidget = document.getElementById('weather-widget');
            const temperatures = ['+3°C', '+5°C', '+7°C', '+4°C', '+6°C'];
            const conditions = [
                {icon: 'fa-cloud-sun', text: 'Переменная облачность'},
                {icon: 'fa-sun', text: 'Ясно'},
                {icon: 'fa-cloud', text: 'Облачно'},
                {icon: 'fa-cloud-rain', text: 'Небольшой дождь'}
            ];
            
            const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            weatherWidget.innerHTML = `
                <div style="font-size: 2rem; color: var(--accent); margin-bottom: 0.5rem;">
                    <i class="fas ${randomCondition.icon}"></i>
                </div>
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">
                    ${randomTemp}
                </div>
                <div style="color: var(--gray); margin-top: 0.5rem;">
                    ${randomCondition.text}, ощущается как ${parseInt(randomTemp) - 2}°C
                </div>
                <button class="btn btn-outline" style="margin-top: 1rem; width: 100%;" onclick="updateWeather()">
                    <i class="fas fa-sync-alt"></i>Обновить
                </button>
            `;
            
            showNotification('Погода обновлена');
        }

        // Обработка формы обратной связи
        document.getElementById('feedback-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                category: document.getElementById('category').value,
                message: document.getElementById('message').value
            };
            
            // Имитация отправки данных
            console.log('Отправлены данные:', formData);
            
            // Показываем уведомление
            showNotification('Ваше сообщение отправлено! Мы ответим в течение 3 рабочих дней.');
            
            // Очищаем форму
            this.reset();
            
            // Закрываем модальное окно, если оно открыто
            closeModal('problems-modal');
        });

        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', function(e) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Анимация появления элементов при прокрутке
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

        // Применяем анимацию к карточкам
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.card, .service-card');
            cards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        });



        // Конфигурация валют
        const CURRENCIES = [
            { code: 'USD', name: 'Доллар США', flag: '🇺🇸', apiCode: 'USD' },
            { code: 'EUR', name: 'Евро', flag: '🇪🇺', apiCode: 'EUR' },
            { code: 'CNY', name: 'Юань', flag: '🇨🇳', apiCode: 'CNY' },
            { code: 'GBP', name: 'Фунт стерлингов', flag: '🇬🇧', apiCode: 'GBP' },
            { code: 'JPY', name: 'Иена', flag: '🇯🇵', apiCode: 'JPY' },
            { code: 'KZT', name: 'Тенге', flag: '🇰🇿', apiCode: 'KZT' }
        ];

        // Кэш курсов валют
        let exchangeRates = {};
        let updateInterval;

        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            loadExchangeRates();
            setupAutoUpdate();
            setupEventListeners();
        });

        // Загрузка курсов валют
        async function loadExchangeRates() {
            const refreshBtn = document.getElementById('refresh-rates');
            const currencyList = document.getElementById('currency-list');
            
            try {
                // Показываем состояние загрузки
                refreshBtn.classList.add('loading');
                refreshBtn.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> Загрузка...';

                // Получаем курсы валют (используем бесплатный API)
                const rates = await fetchExchangeRates();
                
                // Обновляем интерфейс
                updateCurrencyDisplay(rates);
                updateLastUpdateTime();
                
                showNotification('Курсы валют успешно обновлены');
                
            } catch (error) {
                console.error('Ошибка загрузки курсов валют:', error);
                showNotification('Ошибка загрузки курсов. Используются кэшированные данные.', 'error');
                
                // Если есть кэшированные данные, используем их
                if (Object.keys(exchangeRates).length > 0) {
                    updateCurrencyDisplay(exchangeRates);
                }
            } finally {
                refreshBtn.classList.remove('loading');
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить курсы';
            }
        }

        // Получение курсов валют с API
        async function fetchExchangeRates() {
            // Пробуем несколько бесплатных API
            const APIs = [
                'https://api.exchangerate-api.com/v4/latest/RUB',
                'https://api.frankfurter.app/latest?from=RUB'
            ];

            for (const apiUrl of APIs) {
                try {
                    const response = await fetch(apiUrl);
                    if (response.ok) {
                        const data = await response.json();
                        return processExchangeRates(data, apiUrl);
                    }
                } catch (error) {
                    console.warn(`API ${apiUrl} недоступен:`, error);
                    continue;
                }
            }

            // Если все API недоступны, используем fallback данные
            return getFallbackRates();
        }

        // Обработка данных от API
        function processExchangeRates(data, apiUrl) {
            const rates = {};
            
            CURRENCIES.forEach(currency => {
                let rate;
                
                if (apiUrl.includes('exchangerate-api')) {
                    // API: exchangerate-api.com
                    rate = data.rates && data.rates[currency.apiCode] ? 
                           (1 / data.rates[currency.apiCode]).toFixed(2) : null;
                } else if (apiUrl.includes('frankfurter')) {
                    // API: frankfurter.app
                    rate = data.rates && data.rates[currency.apiCode] ? 
                           (1 / data.rates[currency.apiCode]).toFixed(2) : null;
                }

                if (rate) {
                    // Генерируем случайное изменение для демонстрации
                    const previousRate = exchangeRates[currency.code]?.rate || parseFloat(rate);
                    const change = ((parseFloat(rate) - previousRate) / previousRate * 100).toFixed(2);
                    
                    rates[currency.code] = {
                        rate: parseFloat(rate),
                        change: parseFloat(change),
                        previousRate: previousRate
                    };
                }
            });

            // Сохраняем в кэш
            exchangeRates = rates;
            return rates;
        }

        // Fallback данные (если API недоступны)
        function getFallbackRates() {
            const fallbackRates = {
                'USD': { rate: 92.45, change: 0.25, previousRate: 92.20 },
                'EUR': { rate: 101.20, change: -0.15, previousRate: 101.35 },
                'CNY': { rate: 12.85, change: 0.10, previousRate: 12.75 },
                'GBP': { rate: 117.80, change: -0.30, previousRate: 118.10 },
                'JPY': { rate: 0.62, change: 0.05, previousRate: 0.617 },
                'KZT': { rate: 0.20, change: 0.02, previousRate: 0.198 }
            };

            exchangeRates = fallbackRates;
            return fallbackRates;
        }

        // Обновление отображения курсов
        function updateCurrencyDisplay(rates) {
            const currencyList = document.getElementById('currency-list');
            currencyList.innerHTML = '';

            CURRENCIES.forEach(currency => {
                const currencyData = rates[currency.code];
                if (!currencyData) return;

                const changeClass = currencyData.change > 0 ? 'positive' : 
                                  currencyData.change < 0 ? 'negative' : 'neutral';
                
                const changeIcon = currencyData.change > 0 ? 'fa-arrow-up' :
                                 currencyData.change < 0 ? 'fa-arrow-down' : 'fa-minus';

                const currencyItem = document.createElement('div');
                currencyItem.className = 'currency-item';
                currencyItem.style.borderLeftColor = currencyData.change > 0 ? 'var(--success)' : 
                                                   currencyData.change < 0 ? 'var(--danger)' : 'var(--gray)';

                currencyItem.innerHTML = `
                    <div class="currency-info">
                        <div style="font-size: 1.5rem;">${currency.flag}</div>
                        <div>
                            <div class="currency-name">${currency.name}</div>
                            <div class="currency-code">${currency.code}</div>
                        </div>
                    </div>
                    <div class="currency-rate">
                        <div class="rate-value">${currencyData.rate.toFixed(2)} ₽</div>
                        <div class="rate-change ${changeClass}">
                            <i class="fas ${changeIcon}"></i>
                            <span>${Math.abs(currencyData.change).toFixed(2)}%</span>
                        </div>
                    </div>
                `;

                currencyList.appendChild(currencyItem);
            });
        }

        // Обновление времени последнего обновления
        function updateLastUpdateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            document.getElementById('last-update-text').textContent = `Обновлено: ${timeString}`;
        }

        // Настройка автообновления
        function setupAutoUpdate() {
            const autoUpdateCheckbox = document.getElementById('auto-update');
            
            autoUpdateCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    startAutoUpdate();
                } else {
                    stopAutoUpdate();
                }
            });

            // Запускаем автообновление по умолчанию
            startAutoUpdate();
        }

        function startAutoUpdate() {
            stopAutoUpdate(); // Останавливаем предыдущий интервал
            updateInterval = setInterval(loadExchangeRates, 60000); // 60 секунд
        }

        function stopAutoUpdate() {
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
        }

        // Настройка обработчиков событий
        function setupEventListeners() {
            document.getElementById('refresh-rates').addEventListener('click', loadExchangeRates);
            
            // Обновляем при фокусе на странице
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden && document.getElementById('auto-update').checked) {
                    loadExchangeRates();
                }
            });
        }

        // Показать уведомление
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notification-text');
            
            notificationText.textContent = message;
            notification.style.background = type === 'error' ? 'var(--danger)' : 'var(--success)';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Имитация WebSocket для реального обновления (для демонстрации)
        function simulateRealTimeUpdates() {
            setInterval(() => {
                if (Object.keys(exchangeRates).length > 0) {
                    // Случайное обновление курсов для демонстрации
                    Object.keys(exchangeRates).forEach(currencyCode => {
                        const change = (Math.random() - 0.5) * 0.2; // ±0.1%
                        exchangeRates[currencyCode].rate *= (1 + change / 100);
                        exchangeRates[currencyCode].change = change;
                    });
                    
                    if (document.getElementById('auto-update').checked) {
                        updateCurrencyDisplay(exchangeRates);
                        updateLastUpdateTime();
                    }
                }
            }, 10000); // Каждые 10 секунд
        }

        // Запускаем симуляцию реального обновления
        simulateRealTimeUpdates();




        