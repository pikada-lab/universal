import { Component, EventEmitter, Input, OnInit } from '@angular/core'; 

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
 
  @Input() 
  title!: string;
 

  @Input()
  buttons = [{
    title: "Закрыть",
    event: () => this.closePikadaModal()
  }];
 
  @Input()
  open!: EventEmitter<boolean>;

  isOpen = false;

  constructor() { }

  ngOnInit(): void {
    this.open.subscribe((r: boolean) => {
      this.isOpen = r;
    })
  }

  closePikadaModal() {
    this.isOpen = false;
  }

}
