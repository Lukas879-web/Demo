// Physiotherapie Lindenhof – Konzeptprojekt von SIMIQO

document.addEventListener("DOMContentLoaded", () => {

  // ---------- Jahr im Footer ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobiles Menü ----------
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // ---------- Körperkarte ----------
  // Richtwerte für den Bewegungsumfang gesunder Erwachsener (Grad)
  const REGIONS = {
    nacken: {
      name: "Nacken",
      problems: "Verspannungen, Kopfschmerzen, die vom Nacken ausgehen, ein steifer Hals nach langen Bildschirmtagen.",
      therapy: "Manuelle Techniken, sanfte Mobilisation und ein kurzes Übungsprogramm für Ihren Arbeitsplatz.",
      degrees: 80,
      movement: "Kopf zur Seite drehen"
    },
    schulter: {
      name: "Schulter",
      problems: "Schmerzen beim Heben des Arms, Einschränkung nach Verletzung oder Operation, Spannung zwischen Schulter und Nacken.",
      therapy: "Beweglichkeit Schritt für Schritt zurückgewinnen, Muskulatur stabilisieren und die Belastung langsam steigern.",
      degrees: 180,
      movement: "Arm seitlich anheben"
    },
    ruecken: {
      name: "Rücken",
      problems: "Kreuzschmerzen, Hexenschuss, Beschwerden nach langem Sitzen oder schwerem Heben.",
      therapy: "Beweglichkeit und Kraft prüfen, manuell behandeln und den Rumpf mit passenden Übungen stabilisieren.",
      degrees: 60,
      movement: "Oberkörper nach vorn beugen"
    },
    ellbogen: {
      name: "Ellbogen",
      problems: "Tennis- oder Golferellbogen, Schmerzen beim Greifen, Tragen und Händeschütteln.",
      therapy: "Belastung anpassen, die Sehnen gezielt aufbauen und gemeinsam klären, was im Alltag mitspielt.",
      degrees: 145,
      movement: "Ellbogen beugen"
    },
    huefte: {
      name: "Hüfte",
      problems: "Steifigkeit, Schmerzen beim Gehen oder Treppensteigen, Begleitung nach einer Hüftoperation.",
      therapy: "Das Gelenk mobilisieren, das Gehen schulen und Gesäß und Oberschenkel kräftigen.",
      degrees: 120,
      movement: "Knie zur Brust heben"
    },
    knie: {
      name: "Knie",
      problems: "Schmerzen nach dem Sport, Beschwerden an der Kniescheibe, Reha nach Bandverletzung oder Operation.",
      therapy: "Kraft in klaren Etappen aufbauen, die Koordination verbessern und sicher in den Sport zurückkehren.",
      degrees: 135,
      movement: "Knie beugen"
    },
    sprunggelenk: {
      name: "Sprunggelenk",
      problems: "Umgeknickt, Schwellung, Unsicherheit beim Gehen auf unebenem Boden.",
      therapy: "Abschwellen, Beweglichkeit aufbauen und Gleichgewicht sowie Stabilität gezielt trainieren.",
      degrees: 20,
      movement: "Fußspitze zum Schienbein ziehen"
    }
  };

  // Positionen der Gelenkpunkte im Koordinatensystem der Figur (400 x 560)
  const SPOTS = [
    { region: "nacken",       x: 200, y: 112 },
    { region: "schulter",     x: 150, y: 146, hint: true },
    { region: "schulter",     x: 250, y: 146 },
    { region: "ruecken",      x: 200, y: 214 },
    { region: "ellbogen",     x: 112, y: 236 },
    { region: "ellbogen",     x: 288, y: 236 },
    { region: "huefte",       x: 160, y: 296 },
    { region: "huefte",       x: 240, y: 296 },
    { region: "knie",         x: 170, y: 420 },
    { region: "knie",         x: 230, y: 420 },
    { region: "sprunggelenk", x: 168, y: 516 },
    { region: "sprunggelenk", x: 232, y: 516 }
  ];

  const figure = document.getElementById("bmFigure");
  const chipList = document.getElementById("bmChips");
  const titleEl = document.getElementById("bmTitle");
  const problemsEl = document.getElementById("bmProblems");
  const therapyEl = document.getElementById("bmTherapy");
  const arcEl = document.getElementById("bmGaugeArc");
  const armEl = document.getElementById("bmGaugeArm");
  const valueEl = document.getElementById("bmGaugeValue");
  const labelEl = document.getElementById("bmGaugeLabel");

  const ARC_LENGTH = 251.33; // Halbkreis mit Radius 80
  const hotspots = [];
  const chips = {};
  let hintSpot = null;

  function select(key, byUser) {
    const r = REGIONS[key];
    if (!r) return;

    titleEl.textContent = r.name;
    problemsEl.textContent = r.problems;
    therapyEl.textContent = r.therapy;
    valueEl.textContent = r.degrees + "°";
    labelEl.textContent = r.movement;

    arcEl.style.strokeDashoffset = String(ARC_LENGTH * (1 - r.degrees / 180));
    armEl.style.transform = "rotate(" + r.degrees + "deg)";

    Object.keys(chips).forEach(k => chips[k].setAttribute("aria-pressed", String(k === key)));
    hotspots.forEach(h => h.el.classList.toggle("is-active", h.region === key));

    if (byUser && hintSpot) {
      hintSpot.classList.remove("hint");
      hintSpot = null;
    }
  }

  // Auswahl-Chips (zugänglich per Tastatur und Screenreader)
  Object.keys(REGIONS).forEach(key => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = REGIONS[key].name;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => select(key, true));
    li.appendChild(btn);
    chipList.appendChild(li);
    chips[key] = btn;
  });

  // Gelenkpunkte auf der Figur (zusätzlich zum Antippen, für Tastatur sind die Chips da)
  SPOTS.forEach(spot => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hotspot";
    btn.tabIndex = -1;
    btn.setAttribute("aria-hidden", "true");
    btn.style.left = (spot.x / 400 * 100) + "%";
    btn.style.top = (spot.y / 560 * 100) + "%";
    if (spot.hint) {
      btn.classList.add("hint");
      hintSpot = btn;
    }
    btn.addEventListener("click", () => select(spot.region, true));
    figure.appendChild(btn);
    hotspots.push({ region: spot.region, el: btn });
  });

  // Startzustand: Schulter, das Messgerät fährt kurz nach dem Laden ein
  window.setTimeout(() => select("schulter", false), 250);

  // ---------- Formular (nur Demo, sendet nichts) ----------
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  const fields = {
    name:    { input: document.getElementById("name"),    error: document.getElementById("nameError") },
    email:   { input: document.getElementById("email"),   error: document.getElementById("emailError") },
    privacy: { input: document.getElementById("privacy"), error: document.getElementById("privacyError") }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

    if (fields.name.input.value.trim().length < 2) {
      setError("name", "Bitte geben Sie Ihren Namen ein.");
      firstInvalid = firstInvalid || fields.name.input;
    } else {
      setError("name", "");
    }

    if (!emailPattern.test(fields.email.input.value.trim())) {
      setError("email", "Bitte geben Sie eine gültige E-Mail-Adresse ein, zum Beispiel name@beispiel.at.");
      firstInvalid = firstInvalid || fields.email.input;
    } else {
      setError("email", "");
    }

    if (!fields.privacy.input.checked) {
      setError("privacy", "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu, damit wir antworten können.");
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
    success.textContent = "Anfrage gesendet. In dieser Konzeptversion wurde nichts verschickt, so würde die Bestätigung aussehen.";
    success.hidden = false;
    form.reset();
  });

  // Fehler verschwinden, sobald das jeweilige Feld stimmt
  fields.name.input.addEventListener("input", () => {
    if (fields.name.error.textContent && fields.name.input.value.trim().length >= 2) setError("name", "");
  });
  fields.email.input.addEventListener("input", () => {
    if (fields.email.error.textContent && emailPattern.test(fields.email.input.value.trim())) setError("email", "");
  });
  fields.privacy.input.addEventListener("change", () => {
    if (fields.privacy.error.textContent && fields.privacy.input.checked) setError("privacy", "");
  });
});
