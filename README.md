# Microgreen — підписка на живу мікрозелень

Лендинг міської вертикальної ферми у Львові: підписка на живі лотки мікрозелені
з калькулятором добової норми Smart, номером партії на кожному лотку та
керуванням підпискою (Pause / Skip / Swap).

## Демо
- GitHub Pages: https://hegmend.github.io/lab-05-semantic-layout/
- Netlify: https://microgreen67.netlify.app
- Vercel: https://microgreen-lviv.vercel.app
- Репозиторій: https://github.com/hegmend/lab-05-semantic-layout

## Стек
- HTML5 (семантична розмітка, WCAG 2.2 AA)
- Tailwind CSS (CDN v3) + `css/style.css` для псевдоелементів і анімацій
- Git, GitHub, GitHub Pages, Netlify

## Структура
```
index.html        — сторінка лендингу
css/style.css     — кастомні стилі
assets/images/    — зображення (webp, svg)
assets/icons/     — іконки переваг
assets/js/validation.js — валідація форми зворотного зв'язку
assets/js/main.js — ініціалізація Swiper, Fancybox, Typed.js
```

## Форма зворотного зв'язку (ЛР №9)
Секція `#feedback`: ім'я, email, телефон, тема, повідомлення, згода.
Клієнтська валідація на Vanilla JS + RegEx, стани normal / focus / error / success,
`aria-invalid` і `aria-describedby`, доступне модальне вікно (Escape, focus trap).

| Поле | Правило |
|---|---|
| Ім'я | 2–50 символів: літери, пробіл, дефіс, апостроф |
| Email | `^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$` |
| Телефон | `^\+380\d{9}$` |
| Тема | обов'язковий вибір |
| Повідомлення | ≥ 10 символів |
| Згода | checked |

Бекенд не підключено: після валідації показується демонстраційне вікно успіху.

## JS-плагіни (ЛР №10)
Підключені через CDN jsDelivr: CSS — у `<head>`, JS — у кінці `<body>`, ініціалізація в `assets/js/main.js` після `DOMContentLoaded`.
- **Swiper.js 11** — слайдер «Ферма зсередини» (`#gallery`): 6 слайдів, loop, autoplay 3,5 с з паузою при наведенні, стрілки, пагінація, брейкпоінти 1 / 2 / 3 слайди.
- **Fancybox v5** — ті самі фото відкриваються альбомом `data-fancybox="farm-gallery"`: fade, зум, мініатюри, свайпи.
- **Typed.js 2** — анімований слоган у Hero; за `prefers-reduced-motion` анімації вимикаються.

## Запуск локально
Відкрити `index.html` у браузері або через розширення Live Server у VS Code.

---
Навчальний проєкт курсу «Технології веб-розробки та дизайну», НУ «Львівська політехніка».
Автор: Баженов Артур, гр. ПП-21.
