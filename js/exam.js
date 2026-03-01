/* ===================================================
   Be Your Own AI — Final Exam JS
   =================================================== */

// ── Access Gate ───────────────────────────────────────────────────────
const hasAccess = localStorage.getItem('byoa_access') === 'granted';
if (!hasAccess) {
  document.getElementById('lockedOverlay').style.display = 'flex';
  document.getElementById('examBody').style.display = 'none';
}

// ── Exam Questions ────────────────────────────────────────────────────
const EXAM_QUESTIONS = [
  {
    q: 'What is a variable in programming?',
    options: [
      'A type of loop',
      'A named storage location for a value',
      'A function that returns nothing',
      'An HTML element',
    ],
    answer: 1,
  },
  {
    q: 'Which data type stores true/false values?',
    options: ['String', 'Number', 'Boolean', 'Array'],
    answer: 2,
  },
  {
    q: 'What does `===` check in JavaScript?',
    options: [
      'Only value equality',
      'Both value AND type equality',
      'Assignment',
      'Whether a variable exists',
    ],
    answer: 1,
  },
  {
    q: 'A `for` loop is best used when:',
    options: [
      'You need to declare a variable',
      'You want to define a function',
      'You know exactly how many times to repeat a task',
      'You need to check a condition once',
    ],
    answer: 2,
  },
  {
    q: 'What does a function\'s `return` statement do?',
    options: [
      'Starts the function',
      'Repeats the function',
      'Sends a value back to where the function was called',
      'Deletes the function',
    ],
    answer: 2,
  },
  {
    q: 'In the RTF prompting framework, "T" stands for:',
    options: ['Tone', 'Text', 'Task', 'Template'],
    answer: 2,
  },
  {
    q: 'Which prompt is most likely to get an excellent AI response?',
    options: [
      '"Write something."',
      '"Write a 150-word Instagram caption for a fitness coach launching a 30-day challenge program. Tone: motivational. Include an emoji and a hashtag."',
      '"Instagram caption please"',
      '"Caption for fitness"',
    ],
    answer: 1,
  },
  {
    q: 'What does Chain-of-Thought (CoT) prompting do?',
    options: [
      'Makes the AI respond faster',
      'Instructs the AI to reason step-by-step before answering',
      'Links multiple AI tools together',
      'Summarizes the conversation',
    ],
    answer: 1,
  },
  {
    q: 'In the Flipped Interaction Pattern, the AI:',
    options: [
      'Ignores your prompt',
      'Corrects your grammar',
      'Asks you questions to gather information before completing the task',
      'Generates images instead of text',
    ],
    answer: 2,
  },
  {
    q: 'The catchphrase "Be Your Own AI" means:',
    options: [
      'Replace AI with human workers',
      'Build your own AI software from scratch',
      'Use your knowledge and AI tools together to generate results independently',
      'Never use AI tools',
    ],
    answer: 2,
  },
];

// ── State ─────────────────────────────────────────────────────────────
let currentQ = 0;
let score = 0;
let answered = false;

function startExam() {
  document.getElementById('examIntro').style.display = 'none';
  document.getElementById('examQuestions').style.display = 'block';
  renderExamQuestion();
}

function renderExamQuestion() {
  const q = EXAM_QUESTIONS[currentQ];
  answered = false;

  document.getElementById('examQNum').textContent = `Question ${currentQ + 1} of ${EXAM_QUESTIONS.length}`;
  document.getElementById('examProgressBar').style.width = `${(currentQ / EXAM_QUESTIONS.length) * 100}%`;
  document.getElementById('examQuestion').textContent = q.q;
  document.getElementById('examFeedback').style.display = 'none';
  document.getElementById('examNextBtn').style.display = 'none';
  document.getElementById('examScoreTrack').textContent = `Score: ${score}/${currentQ}`;

  const letters = ['A', 'B', 'C', 'D'];
  const optContainer = document.getElementById('examOptions');
  optContainer.innerHTML = '';

  q.options.forEach((opt, i) => {
    const el = document.createElement('div');
    el.className = 'exam-option';
    el.dataset.idx = i;

    const letter = document.createElement('span');
    letter.style.cssText = 'width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0;';
    letter.textContent = letters[i];

    const text = document.createElement('span');
    text.textContent = opt;

    el.appendChild(letter);
    el.appendChild(text);
    el.addEventListener('click', () => selectExamOption(el, i, q.answer));
    optContainer.appendChild(el);
  });
}

function selectExamOption(el, idx, correctIdx) {
  if (answered) return;
  answered = true;

  const opts = document.querySelectorAll('.exam-option');
  opts.forEach(o => o.classList.add('disabled'));

  const isCorrect = idx === correctIdx;
  if (isCorrect) {
    score++;
    el.classList.add('correct');
  } else {
    el.classList.add('wrong');
    opts[correctIdx].classList.add('correct');
  }

  const feedback = document.getElementById('examFeedback');
  feedback.style.display = 'block';
  feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
  feedback.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect — the highlighted answer is correct.';

  document.getElementById('examScoreTrack').textContent = `Score: ${score}/${currentQ + 1}`;

  const nextBtn = document.getElementById('examNextBtn');
  nextBtn.style.display = 'flex';
  nextBtn.textContent = currentQ < EXAM_QUESTIONS.length - 1 ? 'Next →' : 'See Results →';
}

function examNext() {
  currentQ++;
  if (currentQ >= EXAM_QUESTIONS.length) {
    showExamResults();
  } else {
    renderExamQuestion();
  }
}

function showExamResults() {
  document.getElementById('examQuestions').style.display = 'none';

  const pct = Math.round((score / EXAM_QUESTIONS.length) * 100);
  const passed = pct >= 70;

  const results = document.getElementById('examResults');
  results.classList.add('show');

  document.getElementById('examResultIcon').textContent = passed ? '🏆' : '📚';
  document.getElementById('examScoreBig').textContent = pct + '%';
  document.getElementById('examScoreBig').className = `exam-score-big ${passed ? 'pass' : 'fail'}`;
  document.getElementById('examScoreLabel').textContent = `${score} out of ${EXAM_QUESTIONS.length} correct`;
  document.getElementById('examResultTitle').textContent = passed ? 'You Passed! Congratulations!' : 'Not Quite — You\'ve Got This!';
  document.getElementById('examResultMsg').textContent = passed
    ? 'Outstanding work! You\'ve mastered the fundamentals of coding and AI prompting. Claim your certificate below!'
    : `You scored ${pct}% — you need 70% to pass. Review the course materials and try again. You're closer than you think!`;

  if (passed) {
    localStorage.setItem('byoa_exam_passed', 'true');
    localStorage.setItem('byoa_exam_score', pct);
    const actionsEl = document.getElementById('examResultActions');
    actionsEl.innerHTML = '';
    const certLink = document.createElement('a');
    certLink.href = 'certificate.html';
    certLink.className = 'btn btn-accent btn-lg';
    certLink.textContent = '🎓 Claim Your Certificate';
    actionsEl.appendChild(certLink);
  } else {
    const actionsEl = document.getElementById('examResultActions');
    actionsEl.innerHTML = '';
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn btn-outline btn-lg';
    retryBtn.style.marginRight = '1rem';
    retryBtn.textContent = '🔄 Retake Exam';
    retryBtn.addEventListener('click', retakeExam);
    const reviewLink = document.createElement('a');
    reviewLink.href = 'course.html';
    reviewLink.className = 'btn btn-primary btn-lg';
    reviewLink.textContent = '📖 Review Course';
    actionsEl.appendChild(retryBtn);
    actionsEl.appendChild(reviewLink);
  }
}

function retakeExam() {
  currentQ = 0;
  score = 0;
  answered = false;
  document.getElementById('examResults').classList.remove('show');
  document.getElementById('examQuestions').style.display = 'block';
  renderExamQuestion();
}

// ── Wire up static buttons via addEventListener ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('[data-action="startExam"]');
  if (startBtn) startBtn.addEventListener('click', startExam);

  const nextBtn = document.getElementById('examNextBtn');
  if (nextBtn) nextBtn.addEventListener('click', examNext);
});
