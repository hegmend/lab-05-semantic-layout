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
- Tailwind CSS v3 — зібраний статичний файл `css/tailwind.css` (конфігурація в `tailwind.config.js`) + `css/style.css` для шрифтів, псевдоелементів і анімацій
- Git, GitHub, GitHub Pages, Netlify

## Структура
```
index.html        — сторінка лендингу
css/style.css     — кастомні стилі
assets/images/    — зображення (webp, svg)
assets/fonts/     — шрифти Inter і Manrope (woff2)
assets/icons/     — іконки переваг
assets/js/validation.js — валідація форми зворотного зв'язку
assets/js/main.js — ініціалізація Swiper, Fancybox, Typed.js
assets/js/widget.js — калькулятор норми Smart (ЛР №11)
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

## Калькулятор норми Smart (ЛР №11)
Секція `#calculator`: вага (30–200 кг), вік (14–100), цілі (до двох), рівень активності → денна й тижнева норма, рекомендований набір, акцент складу.
Формула: `вага × 0,4 × активність (1 / 1,15 / 1,3) × вік (0,8 / 1 / 0,9)`, округлення до 5 г, межі 20–60 г.
Захист від Edge Cases: порожні поля, 0, від'ємні, надвеликі, дробовий вік, нечисловий ввід, третя ціль, підмінене значення radio — без NaN/Infinity, помилки під полями з червоною рамкою, вивід лише через `textContent`.

## Оптимізація та CI/CD (ЛР №12)
Аудит Google Lighthouse (Mobile, Navigation) і виправлення за його зауваженнями:
- **Performance:** Tailwind зібрано в `css/tailwind.css` замість скрипта `cdn.tailwindcss.com`; шрифти Inter і Manrope лежать локально в `assets/fonts/` (woff2, `font-display: swap`); іконки — вбудовані SVG замість шрифту Font Awesome; скрипти плагінів з `defer`, їхні стилі не блокують рендер; зображення мають `srcset` (640 / 768 px) і `width`/`height`; віджет погоди підвантажується лише біля екрана.
- **Accessibility:** контраст вибраного рівня активності (токен `accent-strong`), зона натискання точок пагінації слайдера 24 × 24 px.
- **Best Practices / SEO:** `favicon.ico`, `canonical`, Open Graph (`og:url`, `og:image`), `robots.txt`, `sitemap.xml`.

Перезбирання стилів після зміни класів у HTML/JS:
```
npx tailwindcss@3.4.17 -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify
```

Автодеплой: `.github/workflows/deploy.yml` — при кожному `push` у `main` GitHub Actions перевіряє наявність файлів і синтаксис JavaScript, після чого публікує сайт на Vercel (секрети `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).

## Запуск локально
Відкрити `index.html` у браузері або через розширення Live Server у VS Code.

---
Навчальний проєкт курсу «Технології веб-розробки та дизайну», НУ «Львівська політехніка».
Автор: Баженов Артур, гр. ПП-21.
