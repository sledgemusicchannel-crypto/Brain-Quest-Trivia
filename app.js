// Expanded Trivia Question Database
const questions = [
  {
    category: "Technology",
    question: "Which programming language runs natively in web browsers?",
    options: ["Python", "C++", "JavaScript", "Swift"],
    answer: 2
  },
  {
    category: "Science",
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    answer: 2
  },
  {
    category: "Geography",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: 2
  },
  {
    category: "Space",
    question: "Which planet in our solar system is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1
  },
  {
    category: "General Knowledge",
    question: "How many colors are present in a standard rainbow?",
    options: ["5", "6", "7", "8"],
    answer: 2
  },
  {
    category: "Technology",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Machine Language",
      "Hyperlink and Text Markup Language"
    ],
    answer: 0
  },
  {
    category: "History",
    question: "In which year did the Apollo 11 mission land humans on the Moon?",
    options: ["1965", "1969", "1971", "1975"],
    answer: 1
  },
  {
    category: "Science",
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Pb"],
    answer: 2
  }
];

let currentIdx = 0;
let score = 0;
let roundCount = 0;
let lifelineUsedThisRound = false;

function loadQuestion() {
  lifelineUsedThisRound = false;
  const q = questions[currentIdx];
  document.getElementById('category').innerText = q.category;
  document.getElementById('question').innerText = q.question;
  
  const optionsDiv = document.getElementById('options-container');
  optionsDiv.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.innerText = opt;
    btn.onclick = () => selectOption(index, btn);
    optionsDiv.appendChild(btn);
  });
}

function selectOption(index, selectedBtn) {
  const q = questions[currentIdx];
  const allButtons = document.querySelectorAll('.btn-option');
  
  // Disable all buttons to prevent double-clicking
  allButtons.forEach(b => b.style.pointerEvents = 'none');

  if (index === q.answer) {
    score += 15;
    selectedBtn.style.backgroundColor = '#10b981'; // Green for correct
    document.getElementById('score').innerText = score;
    document.getElementById('feedback-msg').innerText = "Correct! 🎉 (+15 pts)";
  } else {
    selectedBtn.style.backgroundColor = '#ef4444'; // Red for wrong
    allButtons[q.answer].style.backgroundColor = '#10b981'; // Show correct answer
    document.getElementById('feedback-msg').innerText = "Incorrect! ❌";
  }

  roundCount++;
  
  // Trigger Interstitial Ad automatically every 3 completed rounds
  if (roundCount % 3 === 0) {
    triggerInterstitialAd();
  }

  // Load next question after a short delay
  setTimeout(() => {
    currentIdx = (currentIdx + 1) % questions.length;
    document.getElementById('feedback-msg').innerText = "";
    loadQuestion();
  }, 1500);
}

// Rewarded Ad integration for lifelines
function useLifeline(type) {
  if (lifelineUsedThisRound) {
    alert("You already used a lifeline for this question!");
    return;
  }

  if (window.AndroidBridge && window.AndroidBridge.showRewardedAd) {
    // WebIntoApp native bridge call for rewarded video
    window.AndroidBridge.showRewardedAd(type);
  } else {
    // Fallback simulation for browser testing
    alert("Ad watched successfully! Applying lifeline: " + type);
    applyLifeline(type);
  }
}

// Callback triggered after rewarded ad completes successfully
function applyLifeline(type) {
  lifelineUsedThisRound = true;
  const q = questions[currentIdx];
  const buttons = document.querySelectorAll('.btn-option');

  if (type === '5050') {
    let removed = 0;
    buttons.forEach((btn, idx) => {
      if (idx !== q.answer && removed < 2) {
        btn.style.visibility = 'hidden';
        removed++;
      }
    });
  } else if (type === 'skip') {
    document.getElementById('feedback-msg').innerText = "Question Skipped! ⏭️";
    setTimeout(() => {
      currentIdx = (currentIdx + 1) % questions.length;
      loadQuestion();
    }, 800);
  }
}

function triggerInterstitialAd() {
  if (window.AndroidBridge && window.AndroidBridge.showInterstitial) {
    window.AndroidBridge.showInterstitial();
  } else {
    console.log("Interstitial Ad triggered (Web Simulation Mode)");
  }
}

// Initialize quiz on window load
window.onload = loadQuestion;
