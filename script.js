/* =============================================
   ELMED Online Academy — Under Construction Page
   ============================================= */

(function () {
  "use strict";

  // ---- Countdown Timer ----
  // Set launch date: 3 months from now by default
  // You can change this to any specific date: new Date("2026-09-01T00:00:00")
  const launchDate = new Date();
  launchDate.setMonth(launchDate.getMonth() + 3);
  launchDate.setHours(0, 0, 0, 0);

  const countdownDays = document.getElementById("countdown-days");
  const countdownHours = document.getElementById("countdown-hours");
  const countdownMinutes = document.getElementById("countdown-minutes");
  const countdownSeconds = document.getElementById("countdown-seconds");

  function updateCountdown() {
    const now = new Date();
    const diff = launchDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Launch date has passed — hide countdown
      const countdownEl = document.getElementById("countdown");
      if (countdownEl) countdownEl.classList.add("hidden");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (countdownDays) countdownDays.textContent = String(days).padStart(2, "0");
    if (countdownHours) countdownHours.textContent = String(hours).padStart(2, "0");
    if (countdownMinutes) countdownMinutes.textContent = String(minutes).padStart(2, "0");
    if (countdownSeconds) countdownSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---- Email Signup Form ----
  const form = document.getElementById("signup-form");
  const submitBtn = document.getElementById("submit-btn");
  const emailInput = document.getElementById("email");
  const successMsg = document.getElementById("success-message");
  const emailError = document.getElementById("email-error");
  const consentCheckbox = document.getElementById("consent-checkbox");

  if (!form || !submitBtn || !emailInput || !successMsg || !emailError || !consentCheckbox) return;

  // ---- Inline Email Validation ----
  function validateEmail(value) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return { valid: false, message: "" }; // No message for empty — rely on required
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: "Please enter a valid email address" };
    }

    return { valid: true, message: "" };
  }

  function showError(message) {
    if (message) {
      emailError.textContent = message;
      emailError.classList.add("is-visible");
      emailInput.classList.add("input-error-state");
    } else {
      emailError.textContent = "";
      emailError.classList.remove("is-visible");
      emailInput.classList.remove("input-error-state");
    }
  }

  // Validate on input (real-time)
  emailInput.addEventListener("input", function () {
    const result = validateEmail(this.value);
    if (this.value.trim().length > 0) {
      showError(result.valid ? "" : result.message);
    } else {
      showError("");
    }
  });

  // Validate on blur (when user leaves the field)
  emailInput.addEventListener("blur", function () {
    const result = validateEmail(this.value);
    if (this.value.trim().length > 0 && !result.valid) {
      showError(result.message);
    } else {
      showError("");
    }
  });

  // ---- Consent error display ----
  const consentError = document.createElement("span");
  consentError.className = "input-error";
  consentError.id = "consent-error";
  consentError.setAttribute("aria-live", "polite");
  consentCheckbox.closest(".consent-label").after(consentError);

  function showConsentError(message) {
    if (message) {
      consentError.textContent = message;
      consentError.classList.add("is-visible");
    } else {
      consentError.textContent = "";
      consentError.classList.remove("is-visible");
    }
  }

  // Clear consent error when checkbox is checked
  consentCheckbox.addEventListener("change", function () {
    if (this.checked) {
      showConsentError("");
    }
  });

  // ---- Form Submission ----
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate email
    const emailResult = validateEmail(emailInput.value);
    if (!emailResult.valid) {
      showError(emailResult.message || "Please enter your email address");
      emailInput.focus();
      return;
    }

    // Check consent
    if (!consentCheckbox.checked) {
      showConsentError("You must agree to the Privacy Policy to continue.");
      consentCheckbox.focus();
      return;
    }

    // Clear any errors
    showError("");
    showConsentError("");

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending\u2026";

    const email = emailInput.value.trim();

    try {
      await fetch("https://formspree.io/f/xrewogzv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
    } catch {
      // Silently absorb errors — submission will still show success
    }

    // Replace form with success message
    form.querySelector(".form-row").classList.add("hidden");
    form.querySelector(".consent-row").classList.add("hidden");
    submitBtn.classList.add("hidden");
    successMsg.classList.remove("hidden");
  });
})();