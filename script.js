(() => {
  "use strict";

  const FORM_ENDPOINT = "https://formspree.io/f/xeajkvqp";
  const ELEVATOR_DURATION = 26.958;
  const FLOOR_LABELS = ["PB", "01", "02", "03", "04", "05", "06", "PH"];
  const TICKET_STORAGE_KEY = "diama-penthouse-ticket-v1";

  const elements = {
    lobby: document.querySelector("#lobby"),
    elevator: document.querySelector("#elevator"),
    invitation: document.querySelector("#invitation"),
    startRide: document.querySelector("#startRide"),
    enterSilent: document.querySelector("#enterSilent"),
    toggleSound: document.querySelector("#toggleSound"),
    toggleAmbience: document.querySelector("#toggleAmbience"),
    skipRide: document.querySelector("#skipRide"),
    floorNumber: document.querySelector("#floorNumber"),
    rideProgress: document.querySelector("#rideProgress"),
    registrationForm: document.querySelector("#registrationForm"),
    submitRegistration: document.querySelector("#submitRegistration"),
    formError: document.querySelector("#formError"),
    restoreTicket: document.querySelector("#restoreTicket"),
    ticketOverlay: document.querySelector("#ticketOverlay"),
    ticketControls: document.querySelector("#ticketControls"),
    ticketName: document.querySelector("#ticketName"),
    ticketToken: document.querySelector("#ticketToken"),
    ticketQr: document.querySelector("#ticketQr"),
    screenshotMode: document.querySelector("#screenshotMode"),
    closeTicket: document.querySelector("#closeTicket"),
    cleanHint: document.querySelector("#cleanHint"),
    elevatorAudio: document.querySelector("#elevatorAudio"),
    bellAudio: document.querySelector("#bellAudio"),
    invitationAmbience: document.querySelector("#invitationAmbience"),
  };

  let ticket = null;
  let soundEnabled = true;
  let currentStage = "lobby";
  let animationFrame = null;
  let rideTimers = [];

  const clearRideTimers = () => {
    rideTimers.forEach((timer) => window.clearTimeout(timer));
    rideTimers = [];
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  const playMedia = (media) => {
    try {
      const playback = media.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
          // El control SOUND permite reintentar desde otro gesto del usuario.
        });
      }
    } catch {
      // Algunos navegadores internos bloquean audio hasta el siguiente toque.
    }
  };

  const primeMedia = (media, volume) => {
    media.volume = volume;
    media.muted = true;
    media.currentTime = 0;

    try {
      const playback = media.play();
      const finishPrime = () => {
        media.pause();
        media.currentTime = 0;
        media.muted = false;
      };

      if (playback && typeof playback.then === "function") {
        playback.then(finishPrime).catch(() => {
          media.muted = false;
        });
      } else {
        finishPrime();
      }
    } catch {
      media.muted = false;
    }
  };

  const stopElevatorAudio = ({ preserveBell = false } = {}) => {
    elements.elevatorAudio.pause();
    if (!preserveBell) {
      elements.bellAudio.pause();
      elements.bellAudio.currentTime = 0;
    }
  };

  const pauseInvitationAmbience = () => {
    elements.invitationAmbience.pause();
  };

  const playInvitationAmbience = () => {
    if (currentStage !== "invitation" || !soundEnabled || document.hidden) return;
    elements.invitationAmbience.loop = true;
    elements.invitationAmbience.volume = 0.38;
    elements.invitationAmbience.muted = false;
    playMedia(elements.invitationAmbience);
  };

  const updateSoundControls = () => {
    const label = soundEnabled ? "SOUND ON" : "SOUND OFF";
    const ariaLabel = soundEnabled ? "Silenciar audio" : "Activar audio";
    elements.toggleSound.textContent = label;
    elements.toggleSound.setAttribute("aria-label", ariaLabel);
    elements.toggleAmbience.textContent = label;
    elements.toggleAmbience.setAttribute("aria-label", ariaLabel);
  };

  const setStage = (stage) => {
    currentStage = stage;
    elements.lobby.hidden = stage !== "lobby";
    elements.elevator.hidden = stage !== "elevator";
    elements.invitation.hidden = stage !== "invitation";
  };

  const showInvitation = ({ preserveBell = false } = {}) => {
    clearRideTimers();
    stopElevatorAudio({ preserveBell });
    setStage("invitation");
    window.scrollTo({ top: 0, behavior: "auto" });
    playInvitationAmbience();
  };

  const playArrivalBell = () => {
    if (!soundEnabled) return;
    elements.bellAudio.currentTime = 0;
    elements.bellAudio.volume = 0.95;
    elements.bellAudio.muted = false;
    playMedia(elements.bellAudio);
  };

  const beginRideClock = (duration) => {
    clearRideTimers();
    setStage("elevator");
    elements.elevator.classList.remove("is-arrived");
    elements.skipRide.hidden = true;
    elements.floorNumber.textContent = "PB";
    elements.rideProgress.style.transform = "scaleX(0)";

    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / (duration * 1000), 1);
      const floorIndex = Math.min(
        FLOOR_LABELS.length - 1,
        Math.floor(progress * FLOOR_LABELS.length),
      );
      elements.floorNumber.textContent = FLOOR_LABELS[floorIndex];
      elements.rideProgress.style.transform = `scaleX(${progress})`;
      if (progress < 1) animationFrame = window.requestAnimationFrame(tick);
    };
    animationFrame = window.requestAnimationFrame(tick);

    rideTimers.push(
      window.setTimeout(() => {
        elements.skipRide.hidden = false;
      }, 4200),
      window.setTimeout(playArrivalBell, Math.max(0, duration * 1000 - 1000)),
      window.setTimeout(() => {
        elements.floorNumber.textContent = "PH";
        elements.rideProgress.style.transform = "scaleX(1)";
        elements.skipRide.hidden = true;
        elements.elevator.classList.add("is-arrived");
      }, duration * 1000),
      window.setTimeout(
        () => showInvitation({ preserveBell: true }),
        duration * 1000 + 1550,
      ),
    );
  };

  const startRide = () => {
    elements.startRide.disabled = true;
    elements.startRide.querySelector("span").textContent = "PREPARANDO";
    soundEnabled = true;
    updateSoundControls();
    stopElevatorAudio();
    pauseInvitationAmbience();

    // Estos play() ocurren dentro del toque inicial para desbloquear los tres
    // reproductores en iOS, Android y navegadores internos de redes sociales.
    primeMedia(elements.bellAudio, 0.95);
    primeMedia(elements.invitationAmbience, 0.38);
    elements.elevatorAudio.currentTime = 0;
    elements.elevatorAudio.volume = 0.9;
    elements.elevatorAudio.muted = false;
    playMedia(elements.elevatorAudio);

    const mediaDuration = Number(elements.elevatorAudio.duration);
    const rideDuration = Number.isFinite(mediaDuration) && mediaDuration > 1
      ? mediaDuration
      : ELEVATOR_DURATION;
    beginRideClock(rideDuration);

    elements.startRide.disabled = false;
    elements.startRide.querySelector("span").textContent = "SUBIR AL PENTHOUSE";
  };

  const toggleSound = () => {
    soundEnabled = !soundEnabled;
    elements.elevatorAudio.muted = !soundEnabled;
    elements.bellAudio.muted = !soundEnabled;
    updateSoundControls();

    if (currentStage === "invitation") {
      if (soundEnabled) playInvitationAmbience();
      else pauseInvitationAmbience();
    }
  };

  const enterWithoutAudio = () => {
    soundEnabled = false;
    updateSoundControls();
    pauseInvitationAmbience();
    showInvitation();
  };

  const createTicketToken = () => {
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const characters = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]);
    return `PH-${characters.slice(0, 4).join("")}-${characters.slice(4).join("")}`;
  };

  const normalizeName = (value) => value.trim().replace(/\s+/g, " ");

  const updateRestoreButton = () => {
    elements.restoreTicket.hidden = !ticket;
    if (ticket) {
      elements.restoreTicket.textContent = `VER MI BOLETO GUARDADO · ${ticket.token}`;
    }
  };

  const renderTicket = async () => {
    if (!ticket) return;
    elements.ticketName.textContent = ticket.name;
    elements.ticketToken.textContent = ticket.token;
    elements.ticketQr.alt = `Código QR del acceso ${ticket.token}`;

    try {
      elements.ticketQr.src = await window.QRCode.toDataURL(
        `Diama. PENTHOUSE\nTOKEN: ${ticket.token}`,
        {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 640,
          color: { dark: "#172416", light: "#f5f6e9" },
        },
      );
    } catch {
      elements.ticketQr.removeAttribute("src");
    }
  };

  const showTicket = async () => {
    if (!ticket) return;
    await renderTicket();
    elements.ticketOverlay.hidden = false;
    elements.ticketOverlay.classList.remove("is-clean");
    elements.ticketControls.hidden = false;
    elements.cleanHint.hidden = true;
    document.body.style.overflow = "hidden";
  };

  const closeTicket = () => {
    elements.ticketOverlay.hidden = true;
    elements.ticketOverlay.classList.remove("is-clean");
    elements.ticketControls.hidden = false;
    elements.cleanHint.hidden = true;
    document.body.style.overflow = "";
  };

  const enterScreenshotMode = () => {
    elements.ticketOverlay.classList.add("is-clean");
    elements.ticketControls.hidden = true;
    elements.cleanHint.hidden = false;
    window.setTimeout(() => {
      elements.cleanHint.hidden = true;
    }, 1500);
  };

  const exitScreenshotMode = () => {
    elements.ticketOverlay.classList.remove("is-clean");
    elements.ticketControls.hidden = false;
    elements.cleanHint.hidden = true;
  };

  const showFormError = (message) => {
    elements.formError.textContent = message;
    elements.formError.hidden = !message;
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (elements.submitRegistration.disabled) return;
    showFormError("");

    const formData = new FormData(elements.registrationForm);
    const name = normalizeName(String(formData.get("name") || ""));
    const instagram = String(formData.get("instagram") || "").trim();
    const gotcha = String(formData.get("_gotcha") || "");

    if (name.length < 2) {
      showFormError("Escribe el nombre que presentarás en la entrada.");
      return;
    }

    const nextTicket = {
      name,
      instagram: instagram || undefined,
      token: createTicketToken(),
      registeredAt: new Date().toISOString(),
    };

    const submission = new FormData();
    submission.append("name", nextTicket.name);
    submission.append("instagram", nextTicket.instagram || "—");
    submission.append("access_token", nextTicket.token);
    submission.append("registered_at", nextTicket.registeredAt);
    submission.append("event", "Diama. Penthouse — 22 de agosto 2026");
    submission.append("subject", `Nuevo acceso ${nextTicket.token}`);
    submission.append("_gotcha", gotcha);

    elements.submitRegistration.disabled = true;
    elements.submitRegistration.querySelector("span").textContent = "GENERANDO";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: submission,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Registro rechazado");

      ticket = nextTicket;
      localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(ticket));
      updateRestoreButton();
      elements.registrationForm.reset();
      await showTicket();
    } catch {
      showFormError(
        "No pudimos generar tu acceso. Revisa tu conexión e inténtalo otra vez.",
      );
    } finally {
      elements.submitRegistration.disabled = false;
      elements.submitRegistration.querySelector("span").textContent = "GENERAR MI ACCESO";
    }
  };

  elements.startRide.addEventListener("click", startRide);
  elements.enterSilent.addEventListener("click", enterWithoutAudio);
  elements.toggleSound.addEventListener("click", toggleSound);
  elements.toggleAmbience.addEventListener("click", toggleSound);
  elements.skipRide.addEventListener("click", () => showInvitation());
  elements.registrationForm.addEventListener("submit", handleRegistration);
  elements.restoreTicket.addEventListener("click", showTicket);
  elements.screenshotMode.addEventListener("click", enterScreenshotMode);
  elements.closeTicket.addEventListener("click", closeTicket);
  elements.ticketOverlay.addEventListener("click", (event) => {
    if (elements.ticketOverlay.classList.contains("is-clean")) {
      event.preventDefault();
      exitScreenshotMode();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.ticketOverlay.hidden) closeTicket();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseInvitationAmbience();
    else playInvitationAmbience();
  });
  window.addEventListener("pagehide", pauseInvitationAmbience);
  window.addEventListener("pageshow", playInvitationAmbience);
  window.addEventListener("blur", pauseInvitationAmbience);
  window.addEventListener("focus", playInvitationAmbience);

  try {
    const savedTicket = localStorage.getItem(TICKET_STORAGE_KEY);
    if (savedTicket) ticket = JSON.parse(savedTicket);
  } catch {
    localStorage.removeItem(TICKET_STORAGE_KEY);
  }

  updateRestoreButton();
  updateSoundControls();
})();
