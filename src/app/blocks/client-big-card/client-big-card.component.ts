import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 

@Component({
  selector: 'app-client-big-card',
  templateUrl: './client-big-card.component.html',
  styleUrls: ['./client-big-card.component.css']
})
export class ClientBigCardComponent implements OnInit {

  @Input()
  company: any;
  @Output()
  complite = new EventEmitter<any>();

  timer: any;
  constructor() { }

  ngOnInit(): void {
    this.timer = setTimeout(() => {
      this.complite.emit();
    }, 500);
  }

  resize(event: any) {
    clearTimeout(this.timer);
    this.complite.emit(event)
  }

}
