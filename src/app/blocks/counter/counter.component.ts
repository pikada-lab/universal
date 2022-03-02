import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent implements OnInit {
  @Input()
  count = 1;

  @Input()
  max = 99;

  @Input()
  isOnCart = false;

  @Input()
  min = 1;

  @Input()
  public order!: EventEmitter<number>;
  @Input()
  public remove!: EventEmitter<void>;

  @Output() 
  changeCount = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void { 
  }

  plus() {
    this.count++;
    this.validate();
  }

  minus() {
    this.count--;
    this.validate();
  }

  validate() {
    if (isNaN(Number(this.count))) {
      this.startError();
      this.count = this.min;
    }
    if (this.count < this.min) {
      this.startError();
      this.count = this.min;
    }
    if (this.count > this.max) {
      this.startError();
      this.count = this.max;
    }
    this.changeCount.emit(this.count);
  }
 

  error: boolean = false;
  startError() {
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 300);
  }
}
