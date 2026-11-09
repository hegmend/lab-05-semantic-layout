(function () {
  "use strict";

  const form = document.getElementById("norm-calc-form");
  if (!form) return;

  const weightInput = document.getElementById("weight");
  const ageInput = document.getElementById("age");
  const weightError = document.getElementById("error-weight");
  const ageError = document.getElementById("error-age");
  const goalsError = document.getElementById("error-goals");
  const dailyOutput = document.getElementById("norm-daily");
  const weeklyOutput = document.getElementById("norm-weekly");
  const setOutput = document.getElementById("norm-set");
  const mixOutput = document.getElementById("norm-mix");
  const statusOutput = document.getElementById("calc-status");

  const requiredElements = [
    weightInput,
    ageInput,
    weightError,
    ageError,
    goalsError,
    dailyOutput,
    weeklyOutput,
    setOutput,
    mixOutput,
    statusOutput,
  ];

  if (requiredElements.some((element) => !element)) {
    console.error("Калькулятор мікрозелені: у розмітці відсутні обов’язкові елементи.");
    return;
  }

  const MIN_WEIGHT = 30;
  const MAX_WEIGHT = 200;
  const MIN_AGE = 14;
  const MAX_AGE = 100;
  const MIN_DAILY_NORM = 20;
  const MAX_DAILY_NORM = 60;
  const MAX_GOALS = 2;

  const ACTIVITY_FACTORS = {
    low: 1.0,
    medium: 1.15,
    high: 1.3,
  };

  const GOAL_MIXES = {
    balance: ["броколі"],
    activity: ["горох", "соняшник"],
    energy: ["редис", "гірчиця"],
    habit: ["горох", "редис"],
  };

  const SETS = [
    { maxWeekly: 150, name: "Щоденний мікс", trays: 3, price: 240 },
    { maxWeekly: 200, name: "Спортивний мікс", trays: 4, price: 320 },
    { maxWeekly: 300, name: "Родинний мікс", trays: 6, price: 450 },
    { maxWeekly: null, name: "Мікс для кухні", trays: 12, price: 840 },
  ];

  weightInput.min = String(MIN_WEIGHT);
  weightInput.max = String(MAX_WEIGHT);
  ageInput.min = String(MIN_AGE);
  ageInput.max = String(MAX_AGE);

  function setFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function getWeight() {
    const rawValue = weightInput.value.trim();
    const value = weightInput.valueAsNumber;

    if (rawValue === "") return { value: null, error: "Вкажіть вагу." };
    if (!Number.isFinite(value)) return { value: null, error: "Введіть коректне число." };
    if (value < MIN_WEIGHT || value > MAX_WEIGHT) {
      return { value: null, error: `Вага має бути від ${MIN_WEIGHT} до ${MAX_WEIGHT} кг.` };
    }

    return { value, error: "" };
  }

  function getAgeFactor() {
    const rawValue = ageInput.value.trim();
    const value = ageInput.valueAsNumber;

    if (rawValue === "") return { factor: null, error: "Вкажіть вік." };
    if (!Number.isFinite(value)) return { factor: null, error: "Введіть коректний вік." };
    if (!Number.isInteger(value)) return { factor: null, error: "Вік потрібно вказати повними роками." };
    if (value < MIN_AGE || value > MAX_AGE) {
      return { factor: null, error: `Вік має бути від ${MIN_AGE} до ${MAX_AGE} років.` };
    }

    if (value <= 17) return { factor: 0.8, error: "" };
    if (value <= 64) return { factor: 1.0, error: "" };
    return { factor: 0.9, error: "" };
  }

  function getSelectedGoals() {
    return Array.from(form.querySelectorAll('input[name="goal"]:checked'));
  }

  function getActivityFactor() {
    const selectedActivity = form.querySelector('input[name="activity"]:checked');
    return selectedActivity ? ACTIVITY_FACTORS[selectedActivity.value] : null;
  }

  function getMix(goals) {
    if (goals.length === 0) return "Броколі, горох, редис";

    const ingredients = new Set();
    goals.forEach((goal) => {
      const mix = GOAL_MIXES[goal.value];
      if (mix) mix.forEach((ingredient) => ingredients.add(ingredient));
    });

    const mixText = Array.from(ingredients).join(", ");
    return mixText ? mixText[0].toLocaleUpperCase("uk-UA") + mixText.slice(1) : "—";
  }

  function clearResult() {
    dailyOutput.textContent = "—";
    weeklyOutput.textContent = "Заповніть коректні вагу та вік і перевірте цілі, щоб побачити розрахунок.";
    setOutput.textContent = "—";
    mixOutput.textContent = "—";
  }

  function updateCalculator() {
    const weight = getWeight();
    const age = getAgeFactor();
    const goals = getSelectedGoals();
    const activityFactor = getActivityFactor();
    const goalsErrorMessage =
      goals.length > MAX_GOALS ? `Оберіть не більше ${MAX_GOALS} цілей.` : "";

    setFieldError(weightInput, weightError, weight.error);
    setFieldError(ageInput, ageError, age.error);
    goalsError.textContent = goalsErrorMessage;

    if (weight.error || age.error || goalsErrorMessage || !Number.isFinite(activityFactor)) {
      clearResult();
      statusOutput.textContent = !Number.isFinite(activityFactor)
        ? "Оберіть рівень активності."
        : "";
      return;
    }

    const rawNorm = weight.value * 0.4 * activityFactor * age.factor;
    if (!Number.isFinite(rawNorm) || rawNorm < 0) {
      clearResult();
      statusOutput.textContent = "Не вдалося виконати розрахунок. Перевірте введені дані.";
      return;
    }

    const roundedNorm = Math.round(rawNorm / 5) * 5;
    const dailyNorm = Math.min(MAX_DAILY_NORM, Math.max(MIN_DAILY_NORM, roundedNorm));
    const weeklyNorm = dailyNorm * 7;
    const recommendedSet = SETS.find(
      (set) => set.maxWeekly === null || weeklyNorm <= set.maxWeekly,
    );

    dailyOutput.textContent = `${dailyNorm} г/день`;
    weeklyOutput.textContent = `${weeklyNorm} г/тиждень`;
    const trayLabel = recommendedSet.trays >= 5 ? "лотків" : "лотки";
    setOutput.textContent = `${recommendedSet.name} — ${recommendedSet.trays} ${trayLabel}, ${recommendedSet.price} грн`;
    mixOutput.textContent = getMix(goals);
    statusOutput.textContent =
      roundedNorm < MIN_DAILY_NORM || roundedNorm > MAX_DAILY_NORM
        ? `Денну норму обмежено діапазоном ${MIN_DAILY_NORM}–${MAX_DAILY_NORM} г.`
        : "";
  }

  function handleFormUpdate(event) {
    const target = event.target;
    const isGoalCheckbox =
      target instanceof HTMLInputElement &&
      target.type === "checkbox" &&
      target.name === "goal";

    if (isGoalCheckbox && target.checked && getSelectedGoals().length > MAX_GOALS) {
      target.checked = false;
      updateCalculator();
      goalsError.textContent = `Оберіть не більше ${MAX_GOALS} цілей.`;
      statusOutput.textContent = `Можна обрати не більше ${MAX_GOALS} цілей.`;
      return;
    }

    updateCalculator();
  }

  form.addEventListener("input", handleFormUpdate);
  form.addEventListener("change", handleFormUpdate);
  updateCalculator();
})();
