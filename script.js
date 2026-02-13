const photos = [
  "photos/1FE0C37E-A8B6-4F4F-909E-BF4B30D2432A.JPG",
  "photos/6324365A-6485-4DCF-B94E-AA38C0C2B74B.JPG",
  "photos/A6A6410C-2EE0-4D29-848F-A8233E5F98A1.JPG",
  "photos/FD951E27-CF50-4772-9EA5-09EE8BDF44A0.JPG",
  "photos/IMG_0274.HEIC",
  "photos/IMG_0452.HEIC",
  "photos/IMG_0489 2.HEIC",
  "photos/IMG_0523.HEIC",
  "photos/IMG_0546.HEIC",
  "photos/IMG_0834.HEIC",
  "photos/IMG_1855.HEIC",
  "photos/IMG_2069.HEIC",
  "photos/IMG_2654.HEIC",
  "photos/IMG_2754.heic",
  "photos/IMG_5731 4.heic",
  "photos/IMG_6744.HEIC",
  "photos/IMG_8679 2.heic",
];

const lines = [
  "This smile lives rent-free in my head.",
  "How are you this cute without trying?",
  "I fall a little harder every time.",
  "You make normal days feel special.",
  "Even my best day gets better with you in it.",
  "My favorite plot twist is always you.",
  "You're my comfort place in human form.",
  "I still get excited to talk to you.",
  "You make chaos feel like home.",
  "Your laugh should be declared a public treasure.",
  "I could replay this moment forever.",
  "You are my peace and my spark at the same time.",
  "I choose you, again and again.",
];

const targetEndClicks = 11;

const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  quiz: document.getElementById("quiz-screen"),
  surprise: document.getElementById("surprise-screen"),
  end: document.getElementById("end-screen"),
};

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const photoEl = document.getElementById("photo");
const loaderEl = document.getElementById("photo-loader");
const lineEl = document.getElementById("line");
const counterEl = document.getElementById("counter");
const quizResultEl = document.getElementById("quiz-result");
const surpriseContinueBtn = document.getElementById("surprise-continue");
const heartsContainer = document.getElementById("hearts");

const answerButtons = document.querySelectorAll(".answer-btn");
const yesButtons = document.querySelectorAll(".yes-btn");

let clickCount = 0;
let shownSurprise = false;
let surpriseTrigger = randomInt(3, 8);

startBtn.addEventListener("click", () => {
  showScreen("game");
  showRandomMemory();
});

nextBtn.addEventListener("click", () => {
  clickCount += 1;
  counterEl.textContent = `${clickCount} moment${clickCount === 1 ? "" : "s"} viewed`;

  if (clickCount === 5) {
    showScreen("quiz");
    return;
  }

  if (!shownSurprise && clickCount === surpriseTrigger) {
    shownSurprise = true;
    showScreen("surprise");
    return;
  }

  if (clickCount >= targetEndClicks) {
    showScreen("end");
    return;
  }

  showRandomMemory();
});

answerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    quizResultEl.textContent = "Correct. Both are true. 💘";
    setTimeout(() => {
      quizResultEl.textContent = "";
      showScreen("game");
      showRandomMemory();
    }, 1100);
  });
});

surpriseContinueBtn.addEventListener("click", () => {
  showScreen("game");
  showRandomMemory();
});

yesButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    burstHearts();
  });
});

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function showRandomMemory() {
  const line = pickRandom(lines);
  lineEl.textContent = line;

  const attempts = Math.min(photos.length, 8);
  loaderEl.classList.remove("hidden");
  photoEl.classList.remove("show");

  loadSupportedPhoto(attempts)
    .then((src) => {
      photoEl.src = src;
      requestAnimationFrame(() => {
        loaderEl.classList.add("hidden");
        photoEl.classList.add("show");
      });
    })
    .catch(() => {
      loaderEl.classList.add("hidden");
      photoEl.classList.remove("show");
      lineEl.textContent =
        "Your browser can't load these photos yet. Convert HEIC photos to JPG and this will work perfectly 💕";
    });
}

function loadSupportedPhoto(remainingAttempts) {
  return new Promise((resolve, reject) => {
    if (remainingAttempts <= 0) {
      reject(new Error("No loadable photo found"));
      return;
    }

    const candidate = encodeURI(pickRandom(photos));
    const testImg = new Image();

    testImg.onload = () => resolve(candidate);
    testImg.onerror = () => resolve(loadSupportedPhoto(remainingAttempts - 1));
    testImg.src = candidate;
  });
}

function burstHearts() {
  heartsContainer.innerHTML = "";
  const count = 18;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 0.6}s`;
    heart.style.fontSize = `${18 + Math.random() * 20}px`;
    heartsContainer.appendChild(heart);
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
