
"use strict";

/* ==========================================
   WEBSITE ULANG TAHUN WULAN
   JAVASCRIPT LENGKAP
========================================== */


/* ==========================================
   1. FOTO WULAN
========================================== */

const wulanPhoto = document.getElementById("wulanPhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");

if (wulanPhoto && photoPlaceholder) {
  function checkWulanPhoto() {
    photoPlaceholder.hidden = wulanPhoto.naturalWidth > 0;
  }

  wulanPhoto.addEventListener("load", checkWulanPhoto);
  wulanPhoto.addEventListener("error", checkWulanPhoto);

  if (wulanPhoto.complete) {
    checkWulanPhoto();
  }
}


/* ==========================================
   2. TOMBOL UCAPAN
========================================== */

const wishButton = document.getElementById("wishButton");
const messageCard = document.getElementById("messageCard");
const closeMessage = document.getElementById("closeMessage");

if (wishButton && messageCard) {
  wishButton.addEventListener("click", function () {
    messageCard.hidden = false;

    wishButton.textContent = "💖 Ucapannya sudah terbuka!";

    launchConfetti(180);

    messageCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

if (closeMessage && messageCard && wishButton) {
  closeMessage.addEventListener("click", function () {
    messageCard.hidden = true;

    wishButton.textContent = "🎁 Buka ucapan untuk Wulan";
  });
}


/* ==========================================
   3. BALON BERGERAK NAIK
========================================== */

const balloonRoot = document.getElementById("balloons");

if (balloonRoot) {
  const balloonColors = [
    "#ff8fc7",
    "#b9a0ff",
    "#ffd98a",
    "#8de4e8",
    "#f4a6ff"
  ];

  for (let i = 0; i < 13; i++) {
    const balloon = document.createElement("span");

    balloon.className = "balloon";

    balloon.style.left = Math.random() * 100 + "%";

    balloon.style.background =
      balloonColors[i % balloonColors.length];

    balloon.style.animationDuration =
      (13 + Math.random() * 13) + "s";

    balloon.style.animationDelay =
      (-Math.random() * 25) + "s";

    balloonRoot.appendChild(balloon);
  }
}


/* ==========================================
   4. CONFETTI
========================================== */

const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas
  ? confettiCanvas.getContext("2d")
  : null;

let confettiPieces = [];
let confettiRunning = false;

function resizeConfetti() {
  if (!confettiCanvas || !ctx) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  confettiCanvas.width =
    Math.floor(window.innerWidth * ratio);

  confettiCanvas.height =
    Math.floor(window.innerHeight * ratio);

  confettiCanvas.style.width =
    window.innerWidth + "px";

  confettiCanvas.style.height =
    window.innerHeight + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeConfetti);

resizeConfetti();

function launchConfetti(amount = 100) {
  if (!confettiCanvas || !ctx) return;

  const colors = [
    "#ff8fc7",
    "#ffd98a",
    "#c7b2ff",
    "#fff4d1",
    "#8de4e8",
    "#f5a5ff"
  ];

  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: Math.random() * window.innerWidth,

      y: -20 - Math.random() * 200,

      vx: (Math.random() - 0.5) * 3.5,

      vy: 2 + Math.random() * 4,

      size: 3 + Math.random() * 5,

      rotation: Math.random() * Math.PI,

      spin: (Math.random() - 0.5) * 0.16,

      color: colors[
        Math.floor(Math.random() * colors.length)
      ],

      life: 200
    });
  }

  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti() {
  if (!confettiCanvas || !ctx) {
    confettiRunning = false;
    return;
  }

  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  confettiPieces = confettiPieces.filter(function (piece) {
    return (
      piece.life > 0 &&
      piece.y < window.innerHeight + 30
    );
  });

  for (const piece of confettiPieces) {
    piece.x += piece.vx;
    piece.y += piece.vy;

    piece.vy += 0.018;
    piece.rotation += piece.spin;
    piece.life--;

    ctx.save();

    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);

    ctx.fillStyle = piece.color;

    ctx.fillRect(
      -piece.size / 2,
      -piece.size / 2,
      piece.size,
      piece.size * 1.65
    );

    ctx.restore();
  }

  if (confettiPieces.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;

    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }
}

window.addEventListener("load", function () {
  setTimeout(function () {
    launchConfetti(110);
  }, 450);
});


/* ==========================================
   5. MUSIK ULANG TAHUN TANPA MP3
   FIX: CHROME AUTOPLAY ERROR
========================================== */

let birthdayAudio = null;
let birthdayTimer = null;
let birthdayNoteIndex = 0;
let birthdayMusicPlaying = false;
let birthdayMusicStarting = false;

// Frekuensi nada untuk melodi ulang tahun.
const birthdayMelody = [
  [392.00, 300],
  [392.00, 300],
  [440.00, 600],
  [392.00, 600],
  [523.25, 600],
  [493.88, 900],

  [392.00, 300],
  [392.00, 300],
  [440.00, 600],
  [392.00, 600],
  [587.33, 600],
  [523.25, 900],

  [392.00, 300],
  [392.00, 300],
  [783.99, 600],
  [659.25, 600],
  [523.25, 600],
  [493.88, 600],
  [440.00, 900],

  [698.46, 300],
  [698.46, 300],
  [659.25, 600],
  [523.25, 600],
  [587.33, 600],
  [523.25, 1000]
];


/* Membuat dan memainkan satu nada */

function playBirthdayNote(frequency, duration) {
  if (
    !birthdayAudio ||
    birthdayAudio.state !== "running"
  ) {
    return;
  }

  const now = birthdayAudio.currentTime;

  const oscillator = birthdayAudio.createOscillator();
  const gain = birthdayAudio.createGain();

  oscillator.type = "triangle";

  oscillator.frequency.setValueAtTime(
    frequency,
    now
  );

  // Volume naik secara halus.
  gain.gain.setValueAtTime(0.0001, now);

  gain.gain.linearRampToValueAtTime(
    0.18,
    now + 0.04
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + duration / 1000
  );

  oscillator.connect(gain);
  gain.connect(birthdayAudio.destination);

  oscillator.start(now);

  oscillator.stop(
    now + duration / 1000 + 0.03
  );
}


/* Memainkan nada berikutnya secara berulang */

function playNextBirthdayNote() {
  if (
    !birthdayAudio ||
    birthdayAudio.state !== "running"
  ) {
    birthdayMusicPlaying = false;
    birthdayTimer = null;
    return;
  }

  const [frequency, duration] =
    birthdayMelody[birthdayNoteIndex];

  playBirthdayNote(frequency, duration);

  birthdayNoteIndex =
    (birthdayNoteIndex + 1) % birthdayMelody.length;

  birthdayTimer = setTimeout(
    playNextBirthdayNote,
    duration + 100
  );
}


/* Memulai musik setelah interaksi pengguna */


async function startBirthdayMusic() {
  if (birthdayMusicPlaying || birthdayMusicStarting) {
    return;
  }

  birthdayMusicStarting = true;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      console.error("Browser tidak mendukung audio.");
      return;
    }

    // Buat audio hanya setelah interaksi pengguna.
    if (!birthdayAudio) {
      birthdayAudio = new AudioContextClass();
    }

    // Minta browser mengaktifkan audio.
    const resumePromise =
      birthdayAudio.state !== "running"
        ? birthdayAudio.resume()
        : Promise.resolve();

    // Mulai musik segera jika audio sudah aktif.
    if (birthdayAudio.state === "running") {
      birthdayMusicPlaying = true;
      birthdayNoteIndex = 0;
      playNextBirthdayNote();
    } else {
      await resumePromise;

      if (birthdayAudio.state === "running") {
        birthdayMusicPlaying = true;
        birthdayNoteIndex = 0;
        playNextBirthdayNote();
      }
    }

    console.log("Musik ulang tahun mulai diputar.");

  } catch (error) {
    console.error("Gagal memulai musik:", error);

  } finally {
    birthdayMusicStarting = false;
  }
}



/* ==========================================
   6. AKTIFKAN AUDIO DARI INTERAKSI PERTAMA
========================================== */

/*
  Browser dapat menolak autoplay saat halaman dibuka.
  Karena itu, tidak ada AudioContext yang dibuat otomatis
  ketika halaman pertama kali dimuat.

  Klik atau sentuhan pertama pada halaman akan mencoba
  memulai musik tanpa memerlukan tombol musik khusus.
*/

function enableBirthdayMusic() {
  startBirthdayMusic();
}

document.addEventListener(
  "pointerdown",
  enableBirthdayMusic,
  { once: true }
);

document.addEventListener(
  "keydown",
  enableBirthdayMusic,
  { once: true }
);

document.addEventListener(
  "touchstart",
  enableBirthdayMusic,
  { once: true, passive: true }
);
