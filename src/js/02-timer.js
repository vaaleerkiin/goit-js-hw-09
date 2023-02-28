import flatpickr from 'flatpickr';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'flatpickr/dist/flatpickr.min.css';
const LOCAL_KEY = 'DATE';
let selectedUnixDate = null;
let timerId = null;
let isActive = false;

if (localStorage.getItem(LOCAL_KEY)) {
  selectedUnixDate = JSON.parse(localStorage.getItem(LOCAL_KEY));
}
const refs = {
  startBtn: document.querySelector('[data-start]'),
  clearBtn: document.querySelector('[data-clear]'),
  inputDate: document.querySelector('#datetime-picker'),
};

flatpickr('#datetime-picker', {
  dateFormat: 'U',
  altInput: true,
  enableTime: true,
  time_24hr: true,
  defaultDate: JSON.parse(localStorage.getItem(LOCAL_KEY)),
  minuteIncrement: 1,
  onChange(selectedDates) {
    localStorage.setItem(LOCAL_KEY, selectedDates[0].getTime());
    selectedUnixDate = JSON.parse(localStorage.getItem(LOCAL_KEY));
    timer = null;
    timer = new dateTimer(selectedUnixDate);
  },
  onClose(selectedDates) {
    selectedUnixDate = selectedDates[0].getTime();
  },
});

class dateTimer {
  constructor(stopDate) {
    this.stopDate = stopDate;
  }
  convertMs(time) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(time / day);
    const hours = Math.floor((time % day) / hour);
    const minutes = Math.floor(((time % day) % hour) / minute);
    const seconds = Math.floor((((time % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
  secondsTimer() {
    let leftTime;
    return (timerId = setInterval(() => {
      leftTime = timer.convertMs(this.stopDate - new Date().getTime());
      this.writeDateInHTML(leftTime);
    }, 1000));
  }
  writeDateInHTML(time) {
    for (const el in time) {
      document.querySelector(`[data-${el}]`).innerHTML = `${time[el]}`.padStart(
        2,
        0
      );
    }
  }
}

let timer = new dateTimer(selectedUnixDate);

refs.startBtn.addEventListener('click', () => {
  if (!isActive) {
    if (selectedUnixDate >= new Date()) {
      timer.secondsTimer();
      isActive = true;
    } else Notify.failure(`Please choose a date in the future`);
  }
});
refs.clearBtn.addEventListener('click', () => {
  if (isActive) {
    isActive = false;
    clearInterval(timerId);
    timer.writeDateInHTML({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }
  localStorage.removeItem(LOCAL_KEY);
});

if (localStorage.getItem(LOCAL_KEY)) {
  if (!isActive) {
    if (timer.stopDate >= new Date()) {
      timer.secondsTimer();
      isActive = true;
    }
  }
}
