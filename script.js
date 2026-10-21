// Physiotherapie Lindenhof – Konzeptprojekt von SIMIQO

document.addEventListener("DOMContentLoaded", () => {

  // Jahr im Footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobiles Menü ----------
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Menü schließen: Klick auf Link, Escape
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // ---------- Formular (nur Demo, sendet nichts) ----------
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  const fields = {
    name:    { input: document.getElementById("name"),    error: document.getElementById("nameError") },
    email:   { input: document.getElementById("email"),   error: document.getElementById("emailError") },
    privacy: { input: document.getElementById("privacy"), error: document.getElementById("privacyError") }
  };

  function setError(key, message) {
    const { input, error } = fields[key];
    error.textContent = message;
    input.closest(".field").classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) {
      input.setAttribute("aria-describedby", error.id);
    } else {
      input.removeAttribute("aria-describedby");
    }
  }

  function validate() {
    let firstInvalid = null;

    const name = fields.name.input.value.trim();
    if (name.length < 2) {
      setError("name", "Bitte geben Sie Ihren Namen ein.");
      firstInvalid = firstInvalid || fields.name.input;
    } else {
      setError("name", "");
    }

    const email = fields.email.input.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!emailOk) {
      setError("email", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      firstInvalid = firstInvalid || fields.email.input;
    } else {
      setError("email", "");
    }

    if (!fields.privacy.input.checked) {
      setError("privacy", "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.");
      firstInvalid = firstInvalid || fields.privacy.input;
    } else {
      setError("privacy", "");
    }

    return firstInvalid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.hidden = true;

    const firstInvalid = validate();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Konzeptversion: hier wird bewusst nichts gesendet.
    // Bei einem echten Kundenprojekt kommt an dieser Stelle der Versand hin
    // (z. B. über einen datenschutzkonformen Formular-Dienst oder ein eigenes Backend).
    success.textContent = "Danke! In dieser Konzeptversion wurde nichts gesendet – so würde die Bestätigung aussehen.";
    success.hidden = false;
    form.reset();
  });

  // Fehler live entfernen, sobald das jeweilige Feld korrekt ist
  // (andere Felder werden dabei nicht angefasst)
  fields.name.input.addEventListener("input", () => {
    if (fields.name.error.textContent && fields.name.input.value.trim().length >= 2) {
      setError("name", "");
    }
  });
  fields.email.input.addEventListener("input", () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.input.value.trim());
    if (fields.email.error.textContent && ok) setError("email", "");
  });
  fields.privacy.input.addEventListener("change", () => {
    if (fields.privacy.error.textContent && fields.privacy.input.checked) setError("privacy", "");
  });
});
