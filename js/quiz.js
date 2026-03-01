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

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <span class="quiz-label">Quiz</span>
          <span class="quiz-progress-text">Question ${currentQ + 1} of ${data.questions.length}</span>
        </div>
        <div class="progress-bar-bg" style="margin-bottom:1.5rem;">
          <div class="progress-bar-fill" style="width:${(currentQ / data.questions.length) * 100}%"></div>
        </div>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-options" id="quizOptions-${moduleKey}">
          ${q.options.map((opt, i) => `
            <div class="quiz-option" data-idx="${i}" onclick="selectOption(this, '${moduleKey}', ${i}, ${q.answer}, \`${escapeTemplate(q.explain)}\`)">
              <span class="quiz-option-letter">${letters[i]}</span>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
        <div id="quizFeedback-${moduleKey}" class="quiz-feedback" style="display:none;"></div>
        <div class="quiz-actions" id="quizActions-${moduleKey}" style="margin-top:1.25rem;display:none;">
          <button class="btn btn-primary btn-sm" onclick="nextQuestion_${moduleKey}()">
            ${currentQ < data.questions.length - 1 ? 'Next Question →' : 'See Results →'}
          </button>
        </div>
      </div>`;

    // Expose next-question function on window
    window[`nextQuestion_${moduleKey}`] = () => {
      currentQ++;
      render();
    };
  }

  function showResult() {
    const pct = Math.round((score / data.questions.length) * 100);
    const passed = pct >= 67; // ~2/3 correct

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-result show">
          <div style="font-size:4rem;margin-bottom:0.75rem;">${passed ? '🎉' : '😅'}</div>
          <h3 style="margin-bottom:0.5rem;">${passed ? 'Great job!' : 'Keep going!'}</h3>
          <p style="color:var(--text-muted);margin-bottom:0.5rem;">
            You scored <strong style="color:${passed ? 'var(--success)' : 'var(--danger)'}">
            ${score}/${data.questions.length}</strong> (${pct}%)
          </p>
          <p style="font-size:0.9rem;color:var(--text-muted);">
            ${passed ? 'Quiz passed! Continue to the next module.' : 'Score at least 2/3 to proceed. Review the lessons and try again!'}
          </p>
          ${!passed ? `<button class="btn btn-outline btn-sm" style="margin-top:1rem;" onclick="renderQuiz('${moduleKey}', '${containerId}', arguments.callee)">🔄 Retry Quiz</button>` : ''}
        </div>
      </div>`;

    if (passed) {
      const navId = `nav-${moduleKey}q`;
      const navEl = document.getElementById(navId);
      if (navEl) navEl.style.display = 'flex';
      if (typeof onPass === 'function') onPass(pct);
    }
  }

  window[`selectOption`] = function (el, mod, idx, correctIdx, explain) {
    if (mod !== moduleKey) return;
    if (answered) return;
    answered = true;

    const opts = document.querySelectorAll(`#quizOptions-${mod} .quiz-option`);
    opts.forEach(o => o.classList.add('disabled'));

    const isCorrect = idx === correctIdx;
    if (isCorrect) {
      score++;
      el.classList.add('correct');
    } else {
      el.classList.add('wrong');
      opts[correctIdx].classList.add('correct');
    }

    const feedback = document.getElementById(`quizFeedback-${mod}`);
    feedback.style.display = 'block';
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = `${isCorrect ? '✅ Correct!' : '❌ Not quite.'} ${explain}`;

    document.getElementById(`quizActions-${mod}`).style.display = 'flex';
  };

  render();
}

function escapeTemplate(str) {
  return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}
