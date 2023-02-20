const startBtn = document.getElementById('start-btn');
const textElem = document.getElementById('text');
const typingBox = document.getElementById('typing-box');
const timeElem = document.getElementById('time');
const speedElem = document.getElementById('speed');
const accuracyElem = document.getElementById('accuracy');
const statsElem = document.getElementById('stats');

let text = '';
let startTime = 0;
let endTime = 0;
let totalTime = 0;
let numChars = 0;
let numErrors = 0;

// Fetch random paragraph text from the web
function fetchText() {
  fetch('https://baconipsum.com/api/?type=paragraphs&paras=1')
    .then(response => response.json())
    .then(data => {
      text = data[0];
      textElem.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        if(text[i] === '.' || text[i] === '\n' || text === undefined || text[i] === null || text[i] === '\r' || text[i] === '""') {
          console.log("found ")
          break
        }
        const span = document.createElement('span');
        span.innerText = text[i];
        textElem.appendChild(span);
      }
    })
    .catch(error => console.error(error));
}

// Highlight character green when typed correctly, red when typed incorrectly
function highlightChar(isCorrect, charElem) {
  charElem.classList.remove('green', 'red');
  if (isCorrect === true) {
    charElem.classList.add('green');
  } else {
    charElem.classList.add('red');
  }
}

// Calculate and display typing statistics
function updateStats() {
  const time = totalTime / 1000;
  const speed = Math.round((numChars / 5) / (time / 60));
  const accuracy = Math.round(((numChars - numErrors) / numChars) * 100);
  timeElem.innerText = time.toFixed(1);
  speedElem.innerText = speed;
  accuracyElem.innerText = accuracy;
}

// Start the typing test
function startTest() {
  fetchText();
  typingBox.hidden = false;
  textElem.focus();
}

// Initialize the typing test
function init() {
  typingBox.hidden = true;
  statsElem.hidden = true;
  typingBox.addEventListener('input', e => {
    const input = e.data;
    const textChars = textElem.querySelectorAll('span');
    const currentChar = textChars[numChars];
    if (input === currentChar.innerText) {
      highlightChar(true, currentChar);
      numChars++;
    } else if (input === null) {
      // Backspace or enter was pressed
      if (numChars > 0) {
        //numChars--;
        numErrors--;
        highlightChar(false, textChars[numChars]);
      }
    } else {
      highlightChar(false, currentChar);
      numErrors++;
    }
    if (numChars === text.length) {
      endTime = Date.now();
      totalTime = endTime - startTime;
      updateStats();
      startBtn.disabled = false;
      typingBox.disabled = true;
    }
  });
  startBtn.addEventListener('click', () => {
    startBtn.hidden = true
    startTime = Date.now();
    numChars = 0;
    numErrors = 0;
    updateStats();
    startTest();
  });
}

init();
