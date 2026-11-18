/* ==== EDITABLE CONTENT ================================================ */

// The complete letter. One array item = one paragraph. Do not reword.
const LETTER = [
  "Dear Kelsheiy Colleen,",
  "I know you've been really busy lately with your school projects, and I understand na marami kang kailangang gawin at pagtuunan ng attention ngayon. I just want you to know that I appreciate you, and I hope you don't forget to take care of yourself kahit busy ka.",
  "I don't want you to feel pressured. I know you have priorities and goals, and I want you to focus on them without worrying about anything.",
  "Honestly, I like having you in my life, and I'm enjoying getting to know you. I'm not in a rush, and I'm happy to take things slowly with you.",
  "Please don't forget to rest, eat properly, and give yourself time to breathe. I believe in you, and I hope everything goes well with your projects.",
  "I'm always rooting for you, Kelsheiy. Take care alwayss! ❤️"
];

// The final surprise message.
const SURPRISE = "I'm already glad that I got the chance to know you. So keep doing your best, take care of yourself, and don't forget to smile sometimes. I'll be rooting for you, always. ❤️";

// The ending scene.
// Background music (music.mp3 in the same folder). Starts only after she taps to open.
const MUSIC_VOLUME = 0.45;

const ENDING = {
  title: "That's all for now, Kelsheiy. ♡",
  message: "Good luck with your projects. Don't forget to take care of yourself. ❤️",
  signature: "— Kent",
  replay: "Read it again ♡"
};

/* ==== EXPERIENCE ====================================================== */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = {};
  ["bg","fx","skip","intro","envWrap","env","seal","openBtn","reader","letter","surpriseBtn","ending","endTitle","endMsg","endSig","replayBtn","fullBtn","veil","music","musicBtn","sMsg","contBtn"]
    .forEach((id) => (el[id] = $(id)));
  let token = 0, busy = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const rand = (a, b) => a + Math.random() * (b - a);

  /* background: stars + petals */
  function addPetal() {
    const p = document.createElement("i");
    p.className = "petal" + (Math.random() < 0.4 ? " b" : "");
    const w = rand(9, 15);
    p.style.cssText = `left:${rand(0, 100)}vw;width:${w}px;height:${w * 1.3}px;--t:${rand(12, 20)}s;--s:${rand(-60, 60)}px;animation-delay:${-rand(0, 18)}s`;
    el.bg.appendChild(p);
  }
  function makeBg() {
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("i"), z = rand(1, 3);
      s.className = "star";
      s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;width:${z}px;height:${z}px;--d:${rand(2.5, 6)}s;animation-delay:${-rand(0, 6)}s`;
      el.bg.appendChild(s);
    }
    for (let i = 0; i < 12; i++) addPetal();
  }

  /* golden particle burst */
  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i"), a = rand(0, Math.PI * 2), d = rand(40, 170);
      s.className = "spark";
      s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-duration:${rand(0.9, 1.7)}s`;
      s.addEventListener("animationend", () => s.remove());
      el.fx.appendChild(s);
    }
  }

  /* typewriter (textContent / text nodes only) */
  function follow() {
    const d = document.documentElement;
    if (d.scrollHeight - (window.scrollY + window.innerHeight) < 260) window.scrollTo(0, d.scrollHeight);
  }
  function typeText(target, text, my, done, doFollow) {
    const chars = Array.from(text), node = document.createTextNode("");
    let i = 0;
    target.appendChild(node);
    target.classList.add("typing");
    (function step() {
      if (my !== token) return;
      i = reduce ? chars.length : Math.min(chars.length, i + 2);
      node.data = chars.slice(0, i).join("");
      if (doFollow) follow();
      if (i >= chars.length) { target.classList.remove("typing"); done(); return; }
      setTimeout(step, /[.!?]/.test(chars[i - 1]) ? 300 : 16);
    })();
  }
  function paragraph(i) {
    const p = document.createElement("p");
    if (i === 0) p.className = "greet";
    el.letter.appendChild(p);
    return p;
  }
  function playLetter() {
    const my = ++token;
    el.letter.textContent = "";
    if (reduce) { showFull(); return; }
    let i = 0;
    (function next() {
      if (my !== token) return;
      if (i >= LETTER.length) { finishLetter(); return; }
      typeText(paragraph(i), LETTER[i], my, () => { i++; setTimeout(next, 350); }, true);
    })();
  }
  function showFull() {
    token++;
    el.letter.textContent = "";
    LETTER.forEach((t, i) => { paragraph(i).textContent = t; });
    finishLetter();
  }
  function finishLetter() {
    el.fullBtn.hidden = true;
    el.surpriseBtn.hidden = false;
    el.surpriseBtn.classList.add("fade-in");
    later(() => el.surpriseBtn.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }), 600);
  }

  /* music */
  let fadeT, muted = false, playing = false;
  function fadeAudio(to, ms, stopAfter) {
    clearInterval(fadeT);
    const a = el.music, from = a.volume;
    let n = 0;
    fadeT = setInterval(() => {
      n++;
      a.volume = Math.min(1, Math.max(0, from + (to - from) * n / 20));
      if (n >= 20) { clearInterval(fadeT); if (stopAfter) { a.pause(); a.currentTime = 0; playing = false; } }
    }, ms / 20);
  }
  function startMusic() {
    el.musicBtn.hidden = false;
    if (muted) return;
    el.music.volume = 0;
    const p = el.music.play();
    playing = true;
    if (p && p.then) p.then(() => fadeAudio(MUSIC_VOLUME, 2500)).catch(() => { playing = false; });
  }
  function toggleMusic() {
    muted = !muted;
    el.musicBtn.textContent = muted ? "♪ Music off" : "♪ Music on";
    el.musicBtn.setAttribute("aria-pressed", String(!muted));
    if (muted) { clearInterval(fadeT); el.music.pause(); } else if (playing) { el.music.play().catch(() => {}); fadeAudio(MUSIC_VOLUME, 800); } else startMusic();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) el.music.pause();
    else if (playing && !muted) el.music.play().catch(() => {});
  });

  /* scenes */
  function openLetter() {
    if (busy) return;
    busy = true;
    startMusic();
    if (reduce) { gotoReader(); return; }
    el.skip.hidden = false;
    el.intro.classList.add("opening");
    el.envWrap.classList.add("near");
    later(() => {
      el.seal.classList.add("break");
      const r = el.seal.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 36);
    }, 800);
    later(() => el.env.classList.add("open"), 1200);
    later(() => el.env.classList.add("out"), 2100);
    later(() => el.intro.classList.add("leaving"), 3200);
    later(gotoReader, 3800);
  }
  function gotoReader() {
    clearTimers();
    el.skip.hidden = true;
    el.intro.hidden = true;
    el.reader.hidden = false;
    el.reader.classList.add("fade-in");
    document.body.classList.add("warm");
    el.fullBtn.hidden = false;
    window.scrollTo(0, 0);
    playLetter();
  }
  function openSurprise() {
    const my = ++token;
    el.veil.classList.add("on");
    el.sMsg.textContent = "";
    el.contBtn.hidden = true;
    if (!reduce) { burst(innerWidth / 2, innerHeight / 2, 70); for (let i = 0; i < 8; i++) addPetal(); }
    typeText(el.sMsg, SURPRISE, my, () => {
      el.contBtn.hidden = false;
      el.contBtn.classList.add("fade-in");
      el.contBtn.focus({ preventScroll: true });
    }, false);
  }
  function gotoEnding() {
    fadeAudio(0, 3500, true);
    el.veil.classList.remove("on");
    el.reader.hidden = true;
    el.ending.hidden = false;
    window.scrollTo(0, 0);
  }
  function reset() {
    token++; clearTimers(); busy = false;
    clearInterval(fadeT); el.music.pause(); el.music.currentTime = 0; playing = false;
    el.musicBtn.hidden = true;
    el.veil.classList.remove("on");
    el.ending.hidden = true;
    el.reader.hidden = true;
    el.reader.classList.remove("fade-in");
    el.letter.textContent = "";
    el.surpriseBtn.hidden = true;
    el.fullBtn.hidden = true;
    el.skip.hidden = true;
    el.seal.classList.remove("break");
    el.env.classList.remove("open", "out");
    el.envWrap.classList.remove("near");
    el.intro.classList.remove("opening", "leaving");
    el.intro.hidden = false;
    document.body.classList.remove("warm");
    window.scrollTo(0, 0);
  }

  /* init */
  el.endTitle.textContent = ENDING.title;
  el.endMsg.textContent = ENDING.message;
  el.endSig.textContent = ENDING.signature;
  el.replayBtn.textContent = ENDING.replay;
  makeBg();
  el.openBtn.addEventListener("click", openLetter);
  el.env.addEventListener("click", openLetter);
  el.env.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLetter(); }
  });
  el.musicBtn.addEventListener("click", toggleMusic);
  el.skip.addEventListener("click", gotoReader);
  el.fullBtn.addEventListener("click", showFull);
  el.surpriseBtn.addEventListener("click", openSurprise);
  el.contBtn.addEventListener("click", gotoEnding);
  el.replayBtn.addEventListener("click", reset);
})();
