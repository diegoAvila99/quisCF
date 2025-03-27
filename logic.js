let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 90;
let questions = []; // Array a ser atribuído conforme a matéria selecionada

// Elementos da página
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const quizContainer = document.getElementById('quiz-container');
const subjectSelection = document.getElementById('subject-selection');
const startBtn = document.getElementById('start-btn');
const subjectSelect = document.getElementById('subject-select');
const quizTitle = document.getElementById('quiz-title');

// Configura a matéria escolhida e inicia o quiz
function setSubjectAndStart() {
  const subject = subjectSelect.value;
  if (!subject) {
    alert("Por favor, selecione uma matéria para iniciar o quiz.");
    return;
  }
  if (subject === "constitucional") {
    questions = questionsconstitucional;
    quizTitle.textContent = "Quiz de Direito Constitucional";
  } else if (subject === "romano") {
    questions = questionsromano;
    quizTitle.textContent = "Quiz de Direito Romano";
  }
  // Reinicia variáveis do quiz
  currentQuestion = 0;
  score = 0;
  scoreElement.innerHTML = '';
  
  // Esconde o menu de seleção e exibe o quiz
  subjectSelection.style.display = 'none';
  quizContainer.style.display = 'block';
  
  showQuestion();
}

startBtn.addEventListener('click', setSubjectAndStart);
restartBtn.addEventListener('click', restartQuiz);
backBtn.addEventListener('click', backToMain);

// Mostra a questão atual e reinicia o timer
function showQuestion() {
  clearInterval(timer);
  
  // Remove timer anterior da tela, se existir
  const existingTimer = document.getElementById('timer');
  if (existingTimer) {
    existingTimer.remove();
  }
  
  const q = questions[currentQuestion];
  questionElement.innerHTML = q.question;
  optionsElement.innerHTML = '';
  
  // Cria e insere o timer
  const timerElement = document.createElement('div');
  timerElement.className = 'timer';
  timerElement.id = 'timer';
  timerElement.textContent = `Tempo restante: ${timeLeft}s`;
  questionElement.after(timerElement);
  
  startTimer();
  
  // Embaralha e exibe as opções
  q.options.sort(() => Math.random() - 0.5).forEach(option => {
    const button = document.createElement('button');
    button.innerHTML = option;
    button.onclick = () => checkAnswer(option);
    optionsElement.appendChild(button);
  });
}

// Inicia o timer para a questão
function startTimer() {
  timeLeft = 120;
  const timerElement = document.getElementById('timer');
  timerElement.textContent = `Tempo restante: ${timeLeft}s`;
  
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Tempo restante: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(null);
    }
  }, 1000);
}

// Verifica a resposta selecionada e atualiza o placar
function checkAnswer(selected) {
  clearInterval(timer);
  const buttons = document.querySelectorAll('#options button');
  const correctAnswer = questions[currentQuestion].correct;
  
  buttons.forEach(button => {
    button.disabled = true;
    if (button.innerHTML === correctAnswer) {
      button.classList.add('correct');
    } else if (button.innerHTML === selected) {
      button.classList.add('wrong');
    }
  });

  if (selected === correctAnswer) {
    score++;
  } else if (selected === null) {
    scoreElement.innerHTML += `<br>Tempo esgotado! A resposta correta era: "${correctAnswer}"`;
  }

  scoreElement.innerHTML = `Pontuação: ${score}/${questions.length}`;
  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 10000);
}

// Finaliza o quiz e exibe o resultado
function endQuiz() {
  questionElement.innerHTML = "Quiz Concluído!";
  optionsElement.innerHTML = '';
  const timerElement = document.getElementById('timer');
  if (timerElement) timerElement.remove();
  scoreElement.innerHTML = `Pontuação Final: ${score}/${questions.length}<br>
                            ${getPerformanceMessage(score, questions.length)}`;
}

// Mensagem de desempenho final
function getPerformanceMessage(score, total) {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return "Excelente desempenho! 🎉";
  if (percentage >= 70) return "Bom trabalho! 👍";
  if (percentage >= 50) return "Resultado razoável. Pode melhorar!";
  return "Estude mais e tente novamente! 📚";
}

// Reinicia o quiz mantendo a matéria selecionada
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreElement.innerHTML = '';
  showQuestion();
}

// Retorna à página de seleção de matérias
function backToMain() {
  clearInterval(timer);
  // Reseta variáveis e exibe novamente o menu de seleção
  currentQuestion = 0;
  score = 0;
  scoreElement.innerHTML = '';
  quizContainer.style.display = 'none';
  subjectSelection.style.display = 'block';
}
