import flatpickr from 'flatpickr';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'flatpickr/dist/flatpickr.min.css';
const LOCAL_KEY = 'DATE';
let selectedUnixDate = null;
let timerId = null;
let isActive = false;

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
  defaultDate: new Date().getTime(),
  minuteIncrement: 1,
  onChange(selectedDates) {
    timer = null;
    selectedUnixDate = selectedDates[0].getTime();

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
    Notify.success(`Timer started`);
    return (timerId = setInterval(() => {
      if (selectedUnixDate < new Date().getTime() + 1000) {
        clearInterval(timerId);
        Notify.success(`Time is up`);
        isActive = false;
        refs.clearBtn.setAttribute('disabled', '');
        refs.startBtn.removeAttribute('disabled', '');
      }

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
    if (selectedUnixDate >= new Date().getTime()) {
      timer.secondsTimer();
      isActive = true;
      refs.startBtn.setAttribute('disabled', '');
      refs.clearBtn.removeAttribute('disabled', '');
    } else Notify.failure(`Please choose a date in the future`);
  }
});
refs.clearBtn.addEventListener('click', () => {
  isActive = false;
  clearInterval(timerId);
  timer.writeDateInHTML({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  refs.clearBtn.setAttribute('disabled', '');
  refs.startBtn.removeAttribute('disabled', '');
});
