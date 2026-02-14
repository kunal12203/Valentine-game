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
  home: document.getElementById("home-screen"),
  g1Start: document.getElementById("g1-start-screen"),
  g1Game: document.getElementById("g1-game-screen"),
  g1Quiz: document.getElementById("g1-quiz-screen"),
  g1End: document.getElementById("g1-end-screen"),
  g2: document.getElementById("g2-screen"),
};

const chooseGame1Btn = document.getElementById("choose-game-1");
const chooseGame2Btn = document.getElementById("choose-game-2");
const backHome1Btn = document.getElementById("back-home-1");
const backHome2Btn = document.getElementById("back-home-2");

const g1StartBtn = document.getElementById("g1-start-btn");
const g1NextBtn = document.getElementById("g1-next-btn");
const g1PhotoEl = document.getElementById("g1-photo");
const g1LoaderEl = document.getElementById("g1-photo-loader");
const g1LineEl = document.getElementById("g1-line");
const g1CounterEl = document.getElementById("g1-counter");
const g1QuizResultEl = document.getElementById("g1-quiz-result");
const g1ValentineBtn = document.getElementById("g1-valentine-btn");
const g1YesText = document.getElementById("g1-yes-text");
const g1FxLayer = document.getElementById("g1-fx-layer");
const g1AnswerButtons = document.querySelectorAll(".g1-answer-btn");

const g2StatusEl = document.getElementById("g2-status");
const g2TimerEl = document.getElementById("g2-timer");
const g2YesBtn = document.getElementById("g2-yes-btn");
const g2NoBtn = document.getElementById("g2-no-btn");
const g2Arena = document.getElementById("g2-arena");
const g2ErrorEl = document.getElementById("g2-error");
const g2FxLayer = document.getElementById("g2-fx-layer");

let g1ClickCount = 0;
let g1QuizDone = false;
let g1QuizAt = randomInt(4, 5);

let g2StartTime = 0;
let g2TimerId = null;
let g2Locked = false;
let g2NoScale = 1;

chooseGame1Btn.addEventListener("click", () => {
  resetGame1();
  showScreen("g1Start");
});

chooseGame2Btn.addEventListener("click", () => {
  resetGame2();
  showScreen("g2");
  startGame2();
});

backHome1Btn.addEventListener("click", () => {
  showScreen("home");
});

backHome2Btn.addEventListener("click", () => {
  stopGame2Timer();
  showScreen("home");
});

g1StartBtn.addEventListener("click", () => {
  showScreen("g1Game");
  showRandomMemory();
});

g1NextBtn.addEventListener("click", () => {
  g1ClickCount += 1;
  g1CounterEl.textContent = `${g1ClickCount} photo${g1ClickCount === 1 ? "" : "s"} seen`;

  if (!g1QuizDone && g1ClickCount === g1QuizAt) {
    showScreen("g1Quiz");
    return;
  }

  if (g1ClickCount >= finalClickCount) {
    showScreen("g1End");
    return;
  }

  showRandomMemory();
});

g1AnswerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    g1QuizDone = true;
    g1QuizResultEl.textContent = "Wrong. It's more. 💖";

    setTimeout(() => {
      g1QuizResultEl.textContent = "";
      showScreen("g1Game");
      showRandomMemory();
    }, 1000);
  });
});

g1ValentineBtn.addEventListener("click", () => {
  g1YesText.classList.add("show");
  burstEffects(g1FxLayer);
  g1ValentineBtn.disabled = true;
  g1ValentineBtn.textContent = "Forever yes 💘";
});

g2Arena.addEventListener("mousemove", () => {
  if (g2Locked) return;
  moveYesButton();
});

g2Arena.addEventListener("touchstart", () => {
  if (g2Locked) return;
  moveYesButton();
});

g2YesBtn.addEventListener("click", (event) => {
  if (!g2Locked) {
    event.preventDefault();
    moveYesButton();
    return;
  }

  g2StatusEl.textContent = "You don't have to say yes, you are my Valentine already 💖";
  burstEffects(g2FxLayer);
});

g2NoBtn.addEventListener("click", () => {
  g2NoScale = Math.max(0.35, g2NoScale - 0.15);
  g2NoBtn.style.transform = `scale(${g2NoScale})`;
  g2ErrorEl.textContent = "Error: how dare you?";
  g2ErrorEl.style.color = "#b30052";
  setTimeout(() => {
    if (!g2Locked) {
      g2ErrorEl.textContent = "";
    }
  }, 1200);
});

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function resetGame1() {
  g1ClickCount = 0;
  g1QuizDone = false;
  g1QuizAt = randomInt(4, 5);
  g1CounterEl.textContent = "0 photos seen";
  g1LineEl.textContent = "Tap to start the chaos 💕";
  g1QuizResultEl.textContent = "";
  g1YesText.classList.remove("show");
  g1ValentineBtn.disabled = false;
  g1ValentineBtn.textContent = "Be my Valentine? 💘";
  g1FxLayer.innerHTML = "";
}

function showRandomMemory() {
  const pickedLine = Math.random() < easterEggChance ? easterEggLine : pickRandom(lines);
  g1LineEl.textContent = pickedLine;

  const attempts = Math.min(photos.length, 8);
  g1LoaderEl.classList.remove("hidden");
  g1PhotoEl.classList.remove("show");

  loadSupportedPhoto(attempts)
    .then((src) => {
      g1PhotoEl.src = src;
      requestAnimationFrame(() => {
        g1LoaderEl.classList.add("hidden");
        g1PhotoEl.classList.add("show");
      });
    })
    .catch(() => {
      g1LoaderEl.classList.add("hidden");
      g1LineEl.textContent =
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

function startGame2() {
  g2StartTime = Date.now();
  stopGame2Timer();
  g2TimerId = setInterval(updateGame2Timer, 100);
  updateGame2Timer();
  moveYesButton();
}

function stopGame2Timer() {
  if (g2TimerId) {
    clearInterval(g2TimerId);
    g2TimerId = null;
  }
}

function updateGame2Timer() {
  const elapsedMs = Date.now() - g2StartTime;
  const remainingMs = Math.max(0, 10000 - elapsedMs);
  const remainingSeconds = (remainingMs / 1000).toFixed(1);
  g2TimerEl.textContent = `${remainingSeconds}s left`;

  if (remainingMs <= 0 && !g2Locked) {
    g2Locked = true;
    stopGame2Timer();
    g2StatusEl.textContent = "You don't have to say yes, you are my Valentine already 💖";
    g2TimerEl.textContent = "Timer complete";
    g2YesBtn.textContent = "YES (safe now) 💘";
    g2ErrorEl.textContent = "";
    burstEffects(g2FxLayer);
  }
}

function moveYesButton() {
  const arenaRect = g2Arena.getBoundingClientRect();
  const btnRect = g2YesBtn.getBoundingClientRect();

  const maxX = Math.max(8, arenaRect.width - btnRect.width - 8);
  const maxY = Math.max(8, arenaRect.height - btnRect.height - 8);

  const x = randomInt(8, Math.floor(maxX));
  const y = randomInt(8, Math.floor(maxY));

  g2YesBtn.style.left = `${x}px`;
  g2YesBtn.style.top = `${y}px`;
}

function resetGame2() {
  g2Locked = false;
  g2NoScale = 1;
  g2NoBtn.style.transform = "scale(1)";
  g2StatusEl.textContent = "Try to click YES in 10 seconds. Good luck 😏";
  g2TimerEl.textContent = "10.0s left";
  g2YesBtn.textContent = "YES 💘";
  g2ErrorEl.textContent = "";
  g2FxLayer.innerHTML = "";
}

function burstEffects(container) {
  container.innerHTML = "";

  for (let i = 0; i < 16; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    container.appendChild(heart);
  }

  const confettiColors = ["#ffd166", "#ff7eb6", "#8ed1ff", "#b8f2c8", "#d7b8ff"];
  for (let i = 0; i < 28; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.45}s`;
    confetti.style.transform = `rotate(${Math.random() * 180}deg)`;
    container.appendChild(confetti);
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
