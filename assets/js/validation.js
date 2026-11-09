/**
 * Microgreen — клієнтська валідація форми зворотного зв'язку (ЛР №9).
 *
 * Логіка:
 *  - поле не показує помилку, доки користувач з ним не взаємодіяв (touched);
 *  - blur  — фінальна перевірка поля і позначка touched;
 *  - input — оновлення стану поля, якщо воно вже touched;
 *  - submit — перевірка всіх полів; якщо хоч одне невалідне — форма не надсилається.
 *
 * Реального надсилання на сервер немає: після успішної валідації форма
 * очищується і показується модальне вікно «Демонстрація успішного надсилання».
 */
(function () {
  "use strict";

  /* ---------- 1. Регулярні вирази та конфігурація ---------- */

  // Ім'я: 2–50 символів — українські/латинські літери, пробіл, дефіс, апостроф.
  const REGEX_NAME = /^[A-Za-zА-ЩЬЮЯҐЄІЇа-щьюяґєії'ʼ’\- ]{2,50}$/u;

  // Email: локальна частина @ домен . зона з 2+ літер, без пробілів.
  const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

  // Телефон: строго +380 і рівно 9 цифр після нього.
  const REGEX_PHONE = /^\+380\d{9}$/;

  const MESSAGE_MIN = 10;
  const MESSAGE_MAX = 1000;

  const ERRORS = {
    nameEmpty: "Введіть ім'я.",
    nameShort: "Ім'я має містити щонайменше 2 символи.",
    nameChars: "Використовуйте лише літери, пробіл, дефіс або апостроф.",
    emailEmpty: "Введіть електронну пошту.",
    emailFormat: "Введіть коректну адресу, наприклад user@gmail.com.",
    phoneEmpty: "Введіть номер телефону.",
    phoneFormat: "Номер має бути у форматі +380XXXXXXXXX (9 цифр після +380).",
    subjectEmpty: "Оберіть тему звернення.",
    messageShort: `Повідомлення має містити щонайменше ${MESSAGE_MIN} символів.`,
    agreement: "Потрібна згода з політикою конфіденційності.",
  };

  const form = document.getElementById("feedbackForm");
  if (!form) return;

  const fields = {
    username: document.getElementById("username"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message"),
    agreement: document.getElementById("agreement"),
  };
  const submitBtn = document.getElementById("submitBtn");
  const phoneHint = document.getElementById("phoneHint");
  const messageCounter = document.getElementById("messageCounter");
  const modal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const successName = document.getElementById("successName");

  // Поля, з якими користувач уже взаємодіяв.
  const touched = new Set();

  /* ---------- 2. Керування UI-станами поля ---------- */

  const NORMAL = ["border-line-control"];
  const ERROR = ["border-red-600", "bg-red-50"];
  const SUCCESS = ["border-green-600"];

  function getErrorEl(input) {
    return document.getElementById(input.id + "Error");
  }

  function getOkIcon(input) {
    return input.parentElement.querySelector(".field-ok");
  }

  // Повертає поле у стан Normal (без помилки й без успіху).
  function clearError(input) {
    const errorEl = getErrorEl(input);
    input.classList.remove(...ERROR, ...SUCCESS);
    if (input.type !== "checkbox") input.classList.add(...NORMAL);
    input.setAttribute("aria-invalid", "false");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    const ok = getOkIcon(input);
    if (ok) ok.classList.add("hidden");
  }

  // Стан Error: червона рамка, світлий фон, текст під полем, aria-invalid="true".
  function showError(input, message) {
    clearError(input);
    if (input.type !== "checkbox") {
      input.classList.remove(...NORMAL);
      input.classList.add(...ERROR);
    }
    input.setAttribute("aria-invalid", "true");
    const errorEl = getErrorEl(input);
    errorEl.textContent = message; // textContent — без вставки HTML
    errorEl.classList.remove("hidden");
  }

  // Стан Success: зелена рамка та галочка.
  function showSuccess(input) {
    clearError(input);
    if (input.type !== "checkbox") {
      input.classList.remove(...NORMAL);
      input.classList.add(...SUCCESS);
    }
    const ok = getOkIcon(input);
    if (ok) ok.classList.remove("hidden");
  }

  // Застосовує результат перевірки: null — валідно, рядок — текст помилки.
  function applyResult(input, error) {
    if (error) {
      showError(input, error);
      return false;
    }
    showSuccess(input);
    return true;
  }

  /* ---------- 3. Функції валідації (повертають текст помилки або null) ---------- */

  function validateName() {
    const value = fields.username.value.trim();
    if (value === "") return ERRORS.nameEmpty;
    if (value.length < 2) return ERRORS.nameShort;
    if (!REGEX_NAME.test(value)) return ERRORS.nameChars;
    return null;
  }

  function validateEmail() {
    const value = fields.email.value.trim();
    if (value === "") return ERRORS.emailEmpty;
    if (!REGEX_EMAIL.test(value)) return ERRORS.emailFormat;
    return null;
  }

  function validatePhone() {
    const value = fields.phone.value.trim();
    if (value === "") return ERRORS.phoneEmpty;
    if (!REGEX_PHONE.test(value)) return ERRORS.phoneFormat;
    return null;
  }

  function validateSubject() {
    return fields.subject.value === "" ? ERRORS.subjectEmpty : null;
  }

  function validateMessage() {
    const value = fields.message.value.trim();
    if (value.length < MESSAGE_MIN) return ERRORS.messageShort;
    return null;
  }

  function validateAgreement() {
    return fields.agreement.checked ? null : ERRORS.agreement;
  }

  const validators = {
    username: validateName,
    email: validateEmail,
    phone: validatePhone,
    subject: validateSubject,
    message: validateMessage,
    agreement: validateAgreement,
  };

  function validateField(key) {
    return applyResult(fields[key], validators[key]());
  }

  /* ---------- 4. Телефон: м'яка нормалізація (UX-функція, не частина RegEx) ---------- */

  // На blur прибирає пробіли, дужки й дефіси та перетворює 0XXXXXXXXX у +380XXXXXXXXX.
  // Користувача не блокуємо під час введення; про зміну повідомляємо підказкою.
  function normalizePhone() {
    const raw = fields.phone.value;
    let value = raw.trim().replace(/[\s()\-]/g, "");
    if (/^0\d{9}$/.test(value)) value = "+38" + value;
    else if (/^380\d{9}$/.test(value)) value = "+" + value;

    if (value !== raw) {
      fields.phone.value = value;
      phoneHint.textContent = "Номер приведено до формату +380XXXXXXXXX — перевірте його.";
    } else {
      phoneHint.textContent = "Формат: +380XXXXXXXXX";
    }
  }

  /* ---------- 5. Динамічна валідація: input / blur / change ---------- */

  Object.keys(fields).forEach((key) => {
    const input = fields[key];
    const isChoice = input.type === "checkbox" || input.tagName === "SELECT";

    // blur — фінальна перевірка поля.
    input.addEventListener("blur", () => {
      if (key === "phone") normalizePhone();
      // Порожнє поле, яке лише пройшли табом, не підсвічуємо червоним.
      if (!touched.has(key) && (input.type === "checkbox" || input.value === "")) return;
      touched.add(key);
      validateField(key);
    });

    // input / change — оновлення стану, але тільки після першої взаємодії.
    input.addEventListener(isChoice ? "change" : "input", () => {
      if (isChoice) touched.add(key);
      if (touched.has(key)) validateField(key);
    });
  });

  // Лічильник символів повідомлення.
  fields.message.addEventListener("input", () => {
    messageCounter.textContent = `${fields.message.value.length} / ${MESSAGE_MAX}`;
  });

  /* ---------- 6. Модальне вікно ---------- */

  let lastFocused = null;

  function getFocusable() {
    return modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  }

  function openModal(name) {
    lastFocused = document.activeElement;
    successName.textContent = name;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden"); // фон не прокручується
    closeModalBtn.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    submitBtn.disabled = false;
    if (lastFocused) lastFocused.focus();
  }

  closeModalBtn.addEventListener("click", closeModal);

  // Клік по затемненню закриває вікно, клік усередині картки — ні.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (modal.classList.contains("hidden")) return;
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    // Утримання фокуса всередині вікна (focus trap).
    if (event.key === "Tab") {
      const items = getFocusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- 7. Submit ---------- */

  function resetForm() {
    form.reset();
    touched.clear();
    Object.values(fields).forEach(clearError);
    messageCounter.textContent = `0 / ${MESSAGE_MAX}`;
    phoneHint.textContent = "Формат: +380XXXXXXXXX";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // без перезавантаження сторінки і без надсилання на сервер
    if (submitBtn.disabled) return; // захист від повторного натискання

    normalizePhone();
    Object.keys(fields).forEach((key) => touched.add(key));
    const results = Object.keys(fields).map(validateField);
    const firstInvalid = Object.keys(fields).find((key, i) => !results[i]);

    if (firstInvalid) {
      fields[firstInvalid].focus(); // фокус на перше поле з помилкою
      return;
    }

    submitBtn.disabled = true;
    const name = fields.username.value.trim();
    resetForm();
    openModal(name);
  });
})();
