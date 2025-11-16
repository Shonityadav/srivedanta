// game.js
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentGame: null,
    player: { name: '', score: 0 },
    currentQuestionIndex: 0
  };

  // Update score display (score container must be outside game-container)
  const showScore = () => {
    const scoreContainer = document.getElementById('score-container');
    if (scoreContainer) scoreContainer.textContent = `Player Score: ${state.player.score}`;
  };

  // Unified game starter
  const startGame = (gameName) => {
    state.currentGame = gameName;
    // start from first question when launching a game
    state.currentQuestionIndex = 0;
    switch (gameName) {
      case 'numberStory': numberStory(); break;
      case 'puzzleBoxes': puzzleBoxes(); break;
      case 'patternQuest': patternQuest(); break;
      case 'mathMatch': mathMatch(); break;
      default: console.warn('Unknown game:', gameName);
    }
  };

  /* =========================
     NUMBER STORY
  ========================= */
  const numberStoryQuestions = [
    { question: "I am a two-digit number. Sum of digits = 9. Guess me.", answer: 45, hint: "Both digits add to 9." },
    { question: "I am less than 50, greater than 40. Guess me.", answer: 42, hint: "I am even." },
    { question: "I am a multiple of 7 between 50 and 70. Guess me.", answer: 56, hint: "Divisible by 7." }
  ];

  const numberStory = () => {
    const container = document.getElementById('game-container');

    const renderQuestion = () => {
      const q = numberStoryQuestions[state.currentQuestionIndex];
      container.innerHTML = `
        <h2 class="section-title">Number Story</h2>
        <p>${q.question}</p>
        <input type="number" id="guess-input" placeholder="Enter your guess"/>
        <div class="game-buttons">
          <button class="btn-primary" id="check-guess">Check</button>
          <button class="btn-warning" id="hint-btn">Hint</button>
          <button class="btn-secondary" id="next-btn">Next</button>
          <button class="btn-danger" id="reset-btn">Reset</button>
        </div>
        <p id="feedback"></p>
      `;

      const feedback = container.querySelector('#feedback');

      container.querySelector('#check-guess').onclick = () => {
        feedback.className = '';
        const val = parseInt(container.querySelector('#guess-input').value);
        if (!Number.isFinite(val)) {
          feedback.textContent = 'Please enter a number.';
          feedback.className = 'hint';
          return;
        }
        if (val === q.answer) {
          feedback.textContent = '🎉 Correct! +10 points';
          feedback.className = 'correct';
          state.player.score += 10;
          showScore();
        } else {
          feedback.textContent = '❌ Wrong! Try again.';
          feedback.className = 'wrong';
        }
      };

      container.querySelector('#hint-btn').onclick = () => {
        feedback.className = 'hint';
        feedback.textContent = `💡 Hint: ${q.hint}`;
      };

      container.querySelector('#next-btn').onclick = () => {
        state.currentQuestionIndex = (state.currentQuestionIndex + 1) % numberStoryQuestions.length;
        renderQuestion();
      };

      container.querySelector('#reset-btn').onclick = () => {
        state.player.score = 0;
        showScore();
        renderQuestion();
      };
    };

    renderQuestion();
  };

  /* =========================
     PUZZLE BOXES (fixed & improved)
     - question bank lives here
     - renderPuzzle uses highest number in order to build boxes
     - visually highlights selected boxes and shows sequence
  ========================= */
  const puzzleBoxesQuestions = [
    { order: [1, 2, 3], hint: "Start from smallest to largest." },
    { order: [3, 1, 2], hint: "Biggest box first." },
    { order: [2, 3, 1], hint: "Middle box first." },
    // optional harder examples:
    { order: [4, 2, 1, 3], hint: "Even numbers first, then odds." },
    { order: [5, 4, 3, 2, 1], hint: "Count backwards!" }
  ];

  const puzzleBoxes = () => {
    const container = document.getElementById('game-container');

   const renderPuzzle = () => {
  const q = puzzleBoxesQuestions[state.currentQuestionIndex];
  let userOrder = [];
  container.innerHTML = `
    <h2 class="section-title">Puzzle Boxes</h2>
    <p>Click the boxes in the correct order!</p>
    <div id="boxes" style="display:flex;gap:15px;margin:20px 0;flex-wrap:wrap;"></div>
    <div class="game-buttons">
      <button class="btn-warning" id="hint-btn">Hint</button>
      <button class="btn-secondary" id="next-btn">Next</button>
      <button class="btn-danger" id="reset-btn">Reset</button>
    </div>
    <p id="puzzle-feedback"></p>
  `;

  const boxesEl = container.querySelector('#boxes');
  const feedback = container.querySelector('#puzzle-feedback');

  const totalBoxes = Math.max(...q.order);

  // make an array of box numbers [1,2,...,N] then shuffle for display
  const displayOrder = Array.from({ length: totalBoxes }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  displayOrder.forEach((num) => {
    const box = document.createElement('div');
    box.textContent = `Box ${num}`;
    box.classList.add('draggable');
    box.style.width = '90px';
    box.style.height = '90px';
    box.style.background = '#f5a623';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.borderRadius = '15px';
    box.style.fontWeight = 'bold';
    box.style.fontSize = '1.1rem';
    box.style.cursor = 'pointer';
    box.style.userSelect = 'none';
    box.dataset.index = num;

    box.onclick = () => {
      userOrder.push(num);
      // annotate with pick number
      const badge = document.createElement('span');
      badge.textContent = userOrder.length;
      badge.style.position = 'absolute';
      badge.style.top = '5px';
      badge.style.right = '5px';
      badge.style.background = '#fff';
      badge.style.color = '#000';
      badge.style.fontSize = '0.8rem';
      badge.style.padding = '2px 6px';
      badge.style.borderRadius = '10px';
      box.style.position = 'relative';
      box.appendChild(badge);

      if (userOrder.length === q.order.length) {
        if (userOrder.join() === q.order.join()) {
          feedback.textContent = '🎉 Correct! +10 points';
          feedback.className = 'correct';
          state.player.score += 10;
          showScore();
        } else {
          feedback.textContent = `❌ Wrong! You clicked ${userOrder.join(', ')}.`;
          feedback.className = 'wrong';
        }
        userOrder = [];
      }
    };

    boxesEl.appendChild(box);
  });

  // Buttons
  container.querySelector('#hint-btn').onclick = () => {
    feedback.className = 'hint';
    feedback.textContent = `💡 Hint: ${q.hint}`;
  };

  container.querySelector('#next-btn').onclick = () => {
    state.currentQuestionIndex = (state.currentQuestionIndex + 1) % puzzleBoxesQuestions.length;
    renderPuzzle();
  };

  container.querySelector('#reset-btn').onclick = () => {
    state.player.score = 0;
    showScore();
    renderPuzzle();
  };
};


    renderPuzzle();
  };

  /* =========================
     PATTERN QUEST
  ========================= */
  const patternQuestQuestions = [
  { 
    pattern: ['▲', '■', '●', '▲', '■', '●', '?'], 
    answer: '▲', 
    hint: "The pattern repeats." 
  },
  { 
    pattern: ['★', '☆', '★', '?', '★', '☆'], 
    answer: '☆', 
    hint: "Follow the star sequence." 
  },
  { 
    pattern: ['🍎', '🍌', '🍎', '🍌', '?'], 
    answer: '🍎', 
    hint: "Apple comes after banana." 
  },
  { 
    pattern: ['1', '2', '3', '1', '2', '?'], 
    answer: '3', 
    hint: "It’s counting numbers repeating." 
  },
  { 
    pattern: ['🐶', '🐱', '🐶', '🐱', '?'], 
    answer: '🐶', 
    hint: "Dog and cat take turns." 
  },
  { 
    pattern: ['▲', '▲', '■', '▲', '▲', '?'], 
    answer: '■', 
    hint: "Two triangles then a square." 
  },
  { 
    pattern: ['A', 'B', 'C', 'A', 'B', '?'], 
    answer: 'C', 
    hint: "Alphabet sequence repeats." 
  },
  { 
    pattern: ['⚽', '🏀', '⚽', '🏀', '?'], 
    answer: '⚽', 
    hint: "Football, Basketball… repeat." 
  },
  { 
    pattern: ['2', '4', '6', '8', '?'], 
    answer: '10', 
    hint: "Even numbers increasing." 
  },
  { 
    pattern: ['🌞', '🌛', '🌞', '🌛', '?'], 
    answer: '🌞', 
    hint: "Day and night cycle." 
  }
];


const patternQuest = () => {
  const container = document.getElementById('game-container');

  const renderPattern = () => {
    const q = patternQuestQuestions[state.currentQuestionIndex];
    container.innerHTML = `
      <h2 class="section-title">Pattern Quest</h2>
      <p>Find the missing symbol in the sequence:</p>
      <p id="pattern-seq" style="font-size:2rem; font-weight:bold;">
        ${q.pattern.join(' ')}
      </p>

      <div id="symbol-options" style="
        margin:20px 0; 
        display:flex; 
        gap:15px; 
        flex-wrap:wrap; 
        justify-content:center;">
      </div>

      <div class="game-buttons">
        <button class="btn-warning" id="hint-btn">Hint</button>
        <button class="btn-secondary" id="next-btn">Next</button>
        <button class="btn-danger" id="reset-btn">Reset</button>
      </div>
      <p id="pattern-feedback"></p>
    `;

    const feedback = container.querySelector('#pattern-feedback');
    const seqEl = container.querySelector('#pattern-seq');
    const optionsContainer = container.querySelector('#symbol-options');

    // Unique symbols in this question (exclude '?')
    const symbols = [...new Set(q.pattern.filter(s => s !== '?'))];

    symbols.forEach(symbol => {
      const btn = document.createElement('button');
      btn.textContent = symbol;
      btn.style.fontSize = '2rem';
      btn.style.padding = '15px 25px';
      btn.style.cursor = 'pointer';
      btn.style.borderRadius = '15px';
      btn.style.border = '3px solid #333';
      btn.style.background = '#fff7c2';
      btn.style.transition = '0.2s';
      btn.onmouseover = () => btn.style.background = '#ffe066';
      btn.onmouseout = () => btn.style.background = '#fff7c2';

      btn.onclick = () => {
        // Replace ? with chosen symbol
        const filledPattern = q.pattern.map(x => (x === '?' ? symbol : x));
        seqEl.textContent = filledPattern.join(' ');

        feedback.className = '';
        if (symbol === q.answer) {
          feedback.className = 'correct';
          feedback.textContent = '🎉 Correct! +10 points';
          state.player.score += 10;
          showScore();
        } else {
          feedback.className = 'wrong';
          feedback.textContent = '❌ Wrong! Try again.';
        }
      };
      optionsContainer.appendChild(btn);
    });

    // Other buttons
    container.querySelector('#hint-btn').onclick = () => {
      feedback.className = 'hint';
      feedback.textContent = `💡 Hint: ${q.hint}`;
    };

    container.querySelector('#next-btn').onclick = () => {
      state.currentQuestionIndex = (state.currentQuestionIndex + 1) % patternQuestQuestions.length;
      renderPattern();
    };

    container.querySelector('#reset-btn').onclick = () => {
      state.player.score = 0;
      showScore();
      renderPattern();
    };
  };

  renderPattern();
};

  /* =========================
     MATH MATCH
  ========================= */
  const mathMatchQuestions = [
    { q: '5 + 3 = ?', answer: 8, hint: 'Sum of 5 and 3.' },
    { q: '7 - 4 = ?', answer: 3, hint: 'Subtract 4 from 7.' },
    { q: '6 + 2 = ?', answer: 8, hint: 'Sum of 6 and 2.' }
  ];

  const mathMatch = () => {
    const container = document.getElementById('game-container');

    const renderMath = () => {
      const q = mathMatchQuestions[state.currentQuestionIndex];
      container.innerHTML = `
        <h2 class="section-title">Math Match</h2>
        <p>${q.q}</p>
        <input type="number" id="math-input" placeholder="Enter answer"/>
        <div class="game-buttons">
          <button class="btn-primary" id="check-math">Check</button>
          <button class="btn-warning" id="hint-btn">Hint</button>
          <button class="btn-secondary" id="next-btn">Next</button>
          <button class="btn-danger" id="reset-btn">Reset</button>
        </div>
        <p id="math-feedback"></p>
      `;

      const feedback = container.querySelector('#math-feedback');

      container.querySelector('#check-math').onclick = () => {
        feedback.className = '';
        const val = parseInt(container.querySelector('#math-input').value);
        if (!Number.isFinite(val)) {
          feedback.className = 'hint';
          feedback.textContent = 'Please enter a number.';
          return;
        }
        if (val === q.answer) {
          feedback.className = 'correct';
          feedback.textContent = '🎉 Correct! +10 points';
          state.player.score += 10;
          showScore();
        } else {
          feedback.className = 'wrong';
          feedback.textContent = '❌ Wrong! Try again.';
        }
      };

      container.querySelector('#hint-btn').onclick = () => {
        feedback.className = 'hint';
        feedback.textContent = `💡 Hint: ${q.hint}`;
      };

      container.querySelector('#next-btn').onclick = () => {
        state.currentQuestionIndex = (state.currentQuestionIndex + 1) % mathMatchQuestions.length;
        renderMath();
      };

      container.querySelector('#reset-btn').onclick = () => {
        state.player.score = 0;
        showScore();
        renderMath();
      };
    };

    renderMath();
  };

  /* =========================
     BUTTON EVENT LISTENERS
  ========================= */
  document.getElementById('start-numberStory')?.addEventListener('click', () => startGame('numberStory'));
  document.getElementById('start-puzzleBoxes')?.addEventListener('click', () => startGame('puzzleBoxes'));
  document.getElementById('start-patternQuest')?.addEventListener('click', () => startGame('patternQuest'));
  document.getElementById('start-mathMatch')?.addEventListener('click', () => startGame('mathMatch'));

  // initialize UI
  showScore();
});
