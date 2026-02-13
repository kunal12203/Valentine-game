const photos = [
  "photos/1FE0C37E-A8B6-4F4F-909E-BF4B30D2432A.JPG",
  "photos/6324365A-6485-4DCF-B94E-AA38C0C2B74B.JPG",
  "photos/A6A6410C-2EE0-4D29-848F-A8233E5F98A1.JPG",
  "photos/FD951E27-CF50-4772-9EA5-09EE8BDF44A0.JPG",
  "photos/IMG_0274.jpg",
  "photos/IMG_0452.jpg",
  "photos/IMG_0489 2.jpg",
  "photos/IMG_0523.jpg",
  "photos/IMG_0546.jpg",
  "photos/IMG_0834.jpg",
  "photos/IMG_1855.jpg",
  "photos/IMG_2069.jpg",
  "photos/IMG_2654.jpg",
  "photos/IMG_2754.jpg",
  "photos/IMG_5731 4.jpg",
  "photos/IMG_6744.jpg",
  "photos/IMG_8679 2.jpg",
];

const lines = [
  "How are you cute even when you're doing nothing?",
  "This photo is illegal. I'm reporting you 🚨",
  "I was having a normal day... then THIS happened.",
  "Proof that I'm whipped.",
  "I still don't know how I got this lucky.",
  "Your face is now my favorite hobby.",
  "Every time I look at you, my brain just goes: wow.",
  "I like you. A lot. Like, suspiciously a lot.",
  "I opened this photo and forgot what I was doing.",
  "You're my favorite distraction and my favorite peace.",
  "You're unfairly adorable and I have evidence.",
  "You make ordinary moments feel like a highlight reel.",
];

const easterEggLine = "Okay stop. Come here. I miss you.";
const finalClickCount = 10;
const easterEggChance = 0.12;

const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  quiz: document.getElementById("quiz-screen"),
  end: document.getElementById("end-screen"),
};

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const photoEl = document.getElementById("photo");
const loaderEl = document.getElementById("photo-loader");
const lineEl = document.getElementById("line");
const counterEl = document.getElementById("counter");
const quizResultEl = document.getElementById("quiz-result");
const valentineBtn = document.getElementById("valentine-btn");
const yesText = document.getElementById("yes-text");
const fxLayer = document.getElementById("fx-layer");

const answerButtons = document.querySelectorAll(".answer-btn");

let clickCount = 0;
const quizAt = randomInt(4, 5);
let quizDone = false;

startBtn.addEventListener("click", () => {
  showScreen("game");
  showRandomMemory();
});

nextBtn.addEventListener("click", () => {
  clickCount += 1;
  counterEl.textContent = `${clickCount} photo${clickCount === 1 ? "" : "s"} seen`;

  if (!quizDone && clickCount === quizAt) {
    showScreen("quiz");
    return;
  }

  if (clickCount >= finalClickCount) {
    showScreen("end");
    return;
  }

  showRandomMemory();
});

answerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    quizDone = true;
    quizResultEl.textContent = "Wrong. It's more. 💖";

    setTimeout(() => {
      quizResultEl.textContent = "";
      showScreen("game");
      showRandomMemory();
    }, 1000);
  });
});

valentineBtn.addEventListener("click", () => {
  yesText.classList.add("show");
  burstEffects();
  valentineBtn.disabled = true;
  valentineBtn.textContent = "Forever yes 💘";
});

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function showRandomMemory() {
  const pickedLine = Math.random() < easterEggChance ? easterEggLine : pickRandom(lines);
  lineEl.textContent = pickedLine;

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
      lineEl.textContent =
        "Couldn't load this photo right now, but your cuteness still wins 💕";
    });
}

function loadSupportedPhoto(remainingAttempts) {
  return new Promise((resolve, reject) => {
    if (remainingAttempts <= 0) {
      reject(new Error("No loadable photos"));
      return;
    }

    const candidate = encodeURI(pickRandom(photos));
    const testImg = new Image();

    testImg.onload = () => resolve(candidate);
    testImg.onerror = () => resolve(loadSupportedPhoto(remainingAttempts - 1));
    testImg.src = candidate;
  });
}

function burstEffects() {
  fxLayer.innerHTML = "";

  for (let i = 0; i < 16; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    fxLayer.appendChild(heart);
  }

  const confettiColors = ["#ffd166", "#ff7eb6", "#8ed1ff", "#b8f2c8", "#d7b8ff"];
  for (let i = 0; i < 28; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.45}s`;
    confetti.style.transform = `rotate(${Math.random() * 180}deg)`;
    fxLayer.appendChild(confetti);
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
