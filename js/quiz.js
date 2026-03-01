/* ===================================================
   Be Your Own AI — Quiz Engine
   =================================================== */

const QUIZ_DATA = {
  m1: {
    title: 'Module 1 — Variables & Data Types',
    questions: [
      {
        q: 'Which of the following is a valid variable name in JavaScript?',
        options: ['2fast', 'my variable', 'userName', 'user-name'],
        answer: 2,
        explain: '`userName` is valid camelCase. Variable names cannot start with a number, contain spaces, or use hyphens.',
      },
      {
        q: 'What data type is the value `"42"` (with quotes)?',
        options: ['Number', 'String', 'Boolean', 'Integer'],
        answer: 1,
        explain: 'Anything wrapped in quotes — even digits — is a String, not a Number.',
      },
      {
        q: 'What does `typeof true` return?',
        options: ['"number"', '"string"', '"boolean"', '"object"'],
        answer: 2,
        explain: '`true` and `false` are boolean values, so `typeof true` returns the string `"boolean"`.',
      },
    ],
  },
  m2: {
    title: 'Module 2 — Logic & Control Flow',
    questions: [
      {
        q: 'What operator should you use for strict equality checks in JavaScript?',
        options: ['=', '==', '===', '!=='],
        answer: 2,
        explain: '`===` checks both value AND type, preventing type-coercion bugs. Always prefer it over `==`.',
      },
      {
        q: 'A `for` loop `for (let i = 0; i < 3; i++)` runs how many times?',
        options: ['2', '3', '4', 'Infinitely'],
        answer: 1,
        explain: 'The loop runs when i=0, i=1, and i=2 — stopping before i reaches 3. That is 3 iterations.',
      },
      {
        q: 'Which operator checks if BOTH conditions are true?',
        options: ['||', '!', '&&', '??'],
        answer: 2,
        explain: '`&&` is the logical AND operator. Both sides must be true for the whole expression to be true.',
      },
    ],
  },
  m3: {
    title: 'Module 3 — Functions',
    questions: [
      {
        q: 'What keyword is used to send a value back out of a function?',
        options: ['send', 'output', 'return', 'yield'],
        answer: 2,
        explain: 'The `return` statement exits a function and sends a value back to wherever the function was called.',
      },
      {
        q: 'What is the arrow function equivalent of `function add(a, b) { return a + b; }`?',
        options: [
          'arrow add(a, b) => a + b',
          'const add = (a, b) => a + b;',
          'let add = function(a, b) { a + b };',
          'def add(a, b): return a + b',
        ],
        answer: 1,
        explain: 'Arrow function syntax: `const name = (params) => expression`. This is modern JavaScript.',
      },
      {
        q: 'Why are functions useful?',
        options: [
          'They make code longer',
          'They prevent the use of variables',
          'They allow code reuse and improve readability',
          'They are only used in Python',
        ],
        answer: 2,
        explain: 'Functions enable reusability, readability, and maintainability — the three pillars of clean code.',
      },
    ],
  },
  m4: {
    title: 'Module 4 — AI Prompting Basics',
    questions: [
      {
        q: 'In the RTF Framework, what does the "R" stand for?',
        options: ['Request', 'Result', 'Role', 'Respond'],
        answer: 2,
        explain: 'RTF = Role, Task, Format. Assigning a Role primes the AI to respond from a specific expertise domain.',
      },
      {
        q: 'Which prompt is likely to produce a better AI response?',
        options: [
          '"Write about marketing."',
          '"Write a 200-word LinkedIn post for a solopreneur launching an online course. Tone: confident. Include a CTA."',
          '"Marketing post please"',
          '"Tell me something about marketing"',
        ],
        answer: 1,
        explain: 'Specific prompts with context, constraints, tone, length, and a goal produce far superior AI output.',
      },
      {
        q: 'What is the key reason to assign a ROLE in your prompt?',
        options: [
          'It makes prompts longer',
          'It primes the AI to use the right knowledge domain and tone',
          'It confuses the AI on purpose',
          'It is required by OpenAI',
        ],
        answer: 1,
        explain: 'A role "activates" a specific persona and knowledge space in the model, dramatically improving relevance.',
      },
    ],
  },
  m5: {
    title: 'Module 5 — Advanced Prompting',
    questions: [
      {
        q: 'What phrase triggers Chain-of-Thought reasoning in an AI?',
        options: [
          '"Be creative."',
          '"Answer quickly."',
          '"Think step by step."',
          '"Use markdown."',
        ],
        answer: 2,
        explain: '"Think step by step" explicitly prompts the model to reason through intermediate steps, improving accuracy.',
      },
      {
        q: 'In the Flipped Interaction Pattern, the AI does what?',
        options: [
          'Refuses to answer',
          'Asks YOU questions before completing the task',
          'Translates your prompt',
          'Summarizes your prompt back to you',
        ],
        answer: 1,
        explain: 'The Flipped Interaction Pattern has the AI gather information by asking you questions first — great for personalized outputs.',
      },
      {
        q: 'What is the best way to improve an AI response you are not happy with?',
        options: [
          'Start over with a completely different AI tool',
          'Accept it as-is',
          'Refine your prompt iteratively — "Make it shorter", "More formal", etc.',
          'Refresh the page',
        ],
        answer: 2,
        explain: 'Great prompting is a dialogue. Iterative refinement — building on previous responses — gets you to perfect output faster.',
      },
    ],
  },
};

/**
 * Render a quiz into the target container.
 * @param {string} moduleKey  e.g. 'm1', 'm2' …
 * @param {string} containerId  DOM id of container
 * @param {function} onPass  callback when student passes
 */
function renderQuiz(moduleKey, containerId, onPass) {
  const data = QUIZ_DATA[moduleKey];
  if (!data) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  let currentQ = 0;
  let score = 0;
  let answered = false;
  const results = []; // {correct: bool}

  function render() {
    if (currentQ >= data.questions.length) {
      showResult();
      return;
    }

    const q = data.questions[currentQ];
    const letters = ['A', 'B', 'C', 'D'];
    answered = false;

    // Build DOM elements instead of innerHTML with handlers to avoid XSS and inline onclick
    container.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.className = 'quiz-container';

    const header = document.createElement('div');
    header.className = 'quiz-header';
    header.innerHTML = `<span class="quiz-label">Quiz</span><span class="quiz-progress-text">Question ${currentQ + 1} of ${data.questions.length}</span>`;
    wrap.appendChild(header);

    const progressBg = document.createElement('div');
    progressBg.className = 'progress-bar-bg';
    progressBg.style.marginBottom = '1.5rem';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-bar-fill';
    progressFill.style.width = `${(currentQ / data.questions.length) * 100}%`;
    progressBg.appendChild(progressFill);
    wrap.appendChild(progressBg);

    const qEl = document.createElement('div');
    qEl.className = 'quiz-question';
    qEl.textContent = q.q;
    wrap.appendChild(qEl);

    const optsEl = document.createElement('div');
    optsEl.className = 'quiz-options';
    optsEl.id = `quizOptions-${moduleKey}`;
    q.options.forEach((opt, i) => {
      const optEl = document.createElement('div');
      optEl.className = 'quiz-option';
      optEl.dataset.idx = i;
      const letter = document.createElement('span');
      letter.className = 'quiz-option-letter';
      letter.textContent = letters[i];
      const text = document.createElement('span');
      text.textContent = opt;
      optEl.appendChild(letter);
      optEl.appendChild(text);
      optEl.addEventListener('click', () => handleAnswer(optEl, i, q.answer, q.explain));
      wrap.appendChild(optsEl);
      optsEl.appendChild(optEl);
    });

    const feedbackEl = document.createElement('div');
    feedbackEl.id = `quizFeedback-${moduleKey}`;
    feedbackEl.className = 'quiz-feedback';
    feedbackEl.style.display = 'none';
    wrap.appendChild(feedbackEl);

    const actionsEl = document.createElement('div');
    actionsEl.className = 'quiz-actions';
    actionsEl.id = `quizActions-${moduleKey}`;
    actionsEl.style.marginTop = '1.25rem';
    actionsEl.style.display = 'none';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary btn-sm';
    nextBtn.textContent = currentQ < data.questions.length - 1 ? 'Next Question →' : 'See Results →';
    nextBtn.addEventListener('click', () => { currentQ++; render(); });
    actionsEl.appendChild(nextBtn);
    wrap.appendChild(actionsEl);

    container.appendChild(wrap);
  }

  function handleAnswer(el, idx, correctIdx, explain) {
    if (answered) return;
    answered = true;

    const opts = document.querySelectorAll(`#quizOptions-${moduleKey} .quiz-option`);
    opts.forEach(o => o.classList.add('disabled'));

    const isCorrect = idx === correctIdx;
    if (isCorrect) {
      score++;
      el.classList.add('correct');
    } else {
      el.classList.add('wrong');
      opts[correctIdx].classList.add('correct');
    }

    const feedback = document.getElementById(`quizFeedback-${moduleKey}`);
    feedback.style.display = 'block';
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    // Use textContent to avoid XSS; prepend icon separately
    feedback.textContent = `${isCorrect ? '✅ Correct!' : '❌ Not quite.'} ${explain}`;

    document.getElementById(`quizActions-${moduleKey}`).style.display = 'flex';
  }

  function showResult() {
    const pct = Math.round((score / data.questions.length) * 100);
    const passed = pct >= 67; // ~2/3 correct

    container.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.className = 'quiz-container';

    const resultDiv = document.createElement('div');
    resultDiv.className = 'quiz-result show';

    const emoji = document.createElement('div');
    emoji.style.cssText = 'font-size:4rem;margin-bottom:0.75rem;';
    emoji.textContent = passed ? '🎉' : '😅';
    resultDiv.appendChild(emoji);

    const heading = document.createElement('h3');
    heading.style.marginBottom = '0.5rem';
    heading.textContent = passed ? 'Great job!' : 'Keep going!';
    resultDiv.appendChild(heading);

    const scorePara = document.createElement('p');
    scorePara.style.cssText = 'color:var(--text-muted);margin-bottom:0.5rem;';
    scorePara.innerHTML = `You scored <strong style="color:${passed ? 'var(--success)' : 'var(--danger)'}">${score}/${data.questions.length}</strong> (${pct}%)`;
    resultDiv.appendChild(scorePara);

    const msgPara = document.createElement('p');
    msgPara.style.cssText = 'font-size:0.9rem;color:var(--text-muted);';
    msgPara.textContent = passed
      ? 'Quiz passed! Continue to the next module.'
      : 'Score at least 2/3 to proceed. Review the lessons and try again!';
    resultDiv.appendChild(msgPara);

    if (!passed) {
      const retryBtn = document.createElement('button');
      retryBtn.className = 'btn btn-outline btn-sm';
      retryBtn.style.marginTop = '1rem';
      retryBtn.textContent = '🔄 Retry Quiz';
      retryBtn.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        answered = false;
        renderQuiz(moduleKey, containerId, onPass);
      });
      resultDiv.appendChild(retryBtn);
    }

    wrap.appendChild(resultDiv);
    container.appendChild(wrap);

    if (passed) {
      const navId = `nav-${moduleKey}q`;
      const navEl = document.getElementById(navId);
      if (navEl) navEl.style.display = 'flex';
      if (typeof onPass === 'function') onPass(pct);
    }
  }

  render();
}
