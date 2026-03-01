/* ===================================================
   Be Your Own AI — Course Player JS
   =================================================== */

// ── Access Gate ───────────────────────────────────────────────────────
const hasAccess = localStorage.getItem('byoa_access') === 'granted';
if (!hasAccess) {
  document.getElementById('lockedOverlay').style.display = 'flex';
  document.getElementById('courseLayout').style.display = 'none';
}

// ── Lesson / Progress State ───────────────────────────────────────────
const ALL_LESSONS = ['m1l1', 'm1l2', 'm1q', 'm2l1', 'm2l2', 'm2q', 'm3l1', 'm3q', 'm4l1', 'm4l2', 'm4q', 'm5l1', 'm5l2', 'm5q'];

function getCompleted() {
  try { return JSON.parse(localStorage.getItem('byoa_completed') || '[]'); } catch { return []; }
}
function saveCompleted(arr) {
  localStorage.setItem('byoa_completed', JSON.stringify(arr));
}

function markCompleted(lessonId) {
  const done = getCompleted();
  if (!done.includes(lessonId)) {
    done.push(lessonId);
    saveCompleted(done);
  }
  refreshProgress();
}

function refreshProgress() {
  const done = getCompleted();
  const pct = Math.round((done.length / ALL_LESSONS.length) * 100);

  // Progress bar
  const bar = document.getElementById('courseProgressBar');
  const txt = document.getElementById('progressText');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = pct + '% complete';

  const lbl = document.getElementById('progressLabel');
  if (lbl) lbl.textContent = `${done.length}/${ALL_LESSONS.length} lessons`;

  // Update sidebar checkmarks
  ALL_LESSONS.forEach(id => {
    const el = document.getElementById('chk-' + id);
    if (!el) return;
    const parent = el.closest('.sidebar-lesson');
    if (done.includes(id)) {
      el.textContent = '✓';
      if (parent) parent.classList.add('completed');
    } else {
      el.textContent = '○';
      if (parent) parent.classList.remove('completed');
    }
  });

  // Show exam nav link when all 5 module quizzes passed
  const quizzes = ['m1q', 'm2q', 'm3q', 'm4q', 'm5q'];
  const allQuizzesDone = quizzes.every(q => done.includes(q));
  const examNav = document.getElementById('examNavLink');
  if (examNav) examNav.style.display = allQuizzesDone ? 'block' : 'none';
}

// ── Lesson Navigation ─────────────────────────────────────────────────
let currentLesson = null;

function loadLesson(lessonId) {
  // Hide all panels
  document.querySelectorAll('.lesson-panel').forEach(p => p.classList.remove('active'));
  // Deactivate sidebar
  document.querySelectorAll('.sidebar-lesson').forEach(s => s.classList.remove('active'));

  // Show target panel
  const panel = document.getElementById('panel-' + lessonId);
  if (panel) panel.classList.add('active');

  // Highlight sidebar item
  const sidebarItem = document.querySelector(`[data-lesson="${lessonId}"]`);
  if (sidebarItem) {
    sidebarItem.classList.add('active');
    sidebarItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  currentLesson = lessonId;

  // Scroll content to top
  const content = document.getElementById('lessonContent');
  if (content) content.scrollTop = 0;

  // Initialize quiz panels
  if (lessonId.endsWith('q')) {
    const moduleKey = lessonId.replace('q', '');
    const quizEl = document.getElementById(`quiz-${moduleKey}`);
    if (quizEl && !quizEl.dataset.initialized) {
      quizEl.dataset.initialized = '1';
      renderQuiz(moduleKey, `quiz-${moduleKey}`, (score) => {
        markCompleted(lessonId);
      });
    }
  }

  // Update URL hash
  history.replaceState(null, '', '#' + lessonId);
}

function completeLesson(lessonId, nextLesson) {
  markCompleted(lessonId);
  loadLesson(nextLesson);
}

// ── Voice reading ─────────────────────────────────────────────────────
let voiceActive = false;

function speakCurrentLesson() {
  if (!('speechSynthesis' in window)) return;

  if (voiceActive) {
    window.speechSynthesis.cancel();
    voiceActive = false;
    document.getElementById('voiceBtn').classList.remove('speaking');
    return;
  }

  const panel = document.querySelector('.lesson-panel.active');
  if (!panel) { speakPhrase('Be your own AI. Select a lesson to begin.'); return; }

  const title = panel.querySelector('h1')?.textContent || '';
  const body = panel.querySelector('.lesson-body');
  const text = body
    ? title + '. ' + body.innerText.replace(/\n{2,}/g, '. ').slice(0, 1500)
    : title;

  speakPhrase(text);
}

function speakPhrase(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(x => x.lang.startsWith('en') && /female|woman|zira|samantha|karen/i.test(x.name))
    || voices.find(x => x.lang.startsWith('en'));
  if (v) utterance.voice = v;

  utterance.onstart = () => {
    voiceActive = true;
    document.getElementById('voiceBtn').classList.add('speaking');
  };
  utterance.onend = utterance.onerror = () => {
    voiceActive = false;
    document.getElementById('voiceBtn').classList.remove('speaking');
  };
  window.speechSynthesis.speak(utterance);
}

// ── Init ──────────────────────────────────────────────────────────────
if (hasAccess) {
  refreshProgress();

  // Load lesson from URL hash, or default to first lesson
  const hash = location.hash.replace('#', '');
  const startLesson = (hash && ALL_LESSONS.includes(hash)) ? hash : 'm1l1';
  loadLesson(startLesson);

  // Voices async load
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
