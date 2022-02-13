import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  s!: HTMLBodyElement;
  toastBox!: HTMLDivElement;

  constructor() {
    if (typeof document == 'object') {
      this.s = document.getElementsByTagName('body')[0];
      this.toastBox = document.createElement('div');
      this.toastBox.className = 'toastBox';
      this.s.appendChild(this.toastBox);
    }
  }

  confirm(text: string) {
    if (typeof document != 'object') return null;
    return new Promise<boolean>((res, rej) => {
      var back = document.createElement('div');
      back.className = 'confirm__background';
      back.addEventListener('click', () => {
        this.closeConfirm();
        res(false);
      });

      var comfirmBox = document.createElement('div');
      comfirmBox.className = 'comfirm__box';

      var textBox = document.createElement('p');
      textBox.innerText = text && 'Вы уверены?';

      let inputOk = document.createElement('button');
      inputOk.className = 'confirm__bt success';
      inputOk.innerText = 'Да';

      inputOk.addEventListener('click', () => {
        this.closeConfirm();
        res(true);
      });

      let inputCancel = document.createElement('button');
      inputCancel.className = 'confirm__bt noaccent';
      inputCancel.innerText = 'Отмена';

      inputCancel.addEventListener('click', () => {
        this.closeConfirm();
        res(false);
      });

      var buttonBox = document.createElement('div');
      buttonBox.className = 'confirm__button_box';
      buttonBox.appendChild(inputOk);
      buttonBox.appendChild(inputCancel);
      comfirmBox.appendChild(textBox);
      comfirmBox.appendChild(buttonBox);

      this.s.appendChild(back);
      this.s.appendChild(comfirmBox);
    });
  }

  closeConfirm() {
    if (typeof document != 'object') return;
    let boxes = document.getElementsByClassName('confirm__background');
    let containers = document.getElementsByClassName('comfirm__box');

    while (boxes.length) {
      this.s.removeChild(boxes[0]);
    }
    while (containers.length) {
      this.s.removeChild(containers[0]);
    }
  }
  toast(text: string, type = '') {
    if (typeof document != 'object') return;
    var toast = document.createElement('div');
    toast.className = 'toast';
    if (type) {
      toast.className += ' ' + type;
    }
    toast.innerHTML = text;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';

    this.toastBox.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0px)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.height = toast.clientHeight - 20 + 'px';
    }, 23000);
    setTimeout(() => {
      toast.style.overflow = 'hidden';
      toast.style.height = '0px';
      toast.style.margin = '0px';
      toast.style.padding = '0px';
    }, 23700);
    setTimeout(() => {
      this.toastBox.removeChild(toast);
    }, 24800);
  }
}
