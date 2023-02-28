import { Notify } from 'notiflix/build/notiflix-notify-aio';
const formEl = document.querySelector('.form');
let delayInput;
let stepInput;
let amountInput;

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
const submitHandler = e => {
  e.preventDefault();
  if (!e.target.tagName === 'BUTTON') return;

  delayInput = Number(document.querySelector('[name="delay"]').value);
  stepInput = Number(document.querySelector('[name="step"]').value);
  amountInput = Number(document.querySelector('[name="amount"]').value);
  let step = delayInput;
  for (let i = 1; i <= amountInput; i += 1) {
    createPromise(i, step)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
    step += stepInput;
  }
  e.currentTarget.reset();
};
formEl.addEventListener('submit', submitHandler);
