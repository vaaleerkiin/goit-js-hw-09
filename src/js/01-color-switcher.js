const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
  body: document.querySelector('body'),
};
let isActive = false;
let timerId = null;
refs.startBtn.addEventListener('click', ev => {
  if (!isActive) {
    changeBodyColor();
    isActive = true;
    console.log('Start');
    refs.startBtn.setAttribute('disabled', '');
    refs.stopBtn.removeAttribute('disabled', '');
  }
});

refs.stopBtn.addEventListener('click', ev => {
  if (isActive) {
    console.log('Stop');
    isActive = false;
    clearInterval(timerId);
    refs.stopBtn.setAttribute('disabled', '');
    refs.startBtn.removeAttribute('disabled', '');
  }
});

function changeBodyColor() {
  timerId = setInterval(() => {
    let color = getRandomHexColor();
    setBodyColor(color);
  }, 1000);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function setBodyColor(color) {
  console.log(color);
  refs.body.style.backgroundColor = color;
}
