import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Products } from 'src/app/models'; 

@Component({
  selector: 'app-boxing',
  templateUrl: './boxing.component.html',
  styleUrls: ['./boxing.component.css']
})
export class BoxingComponent implements OnInit {
  @Input()
  caseId!: number;

  @Input()
  cases?: Products[];

  @Output()
  changeCaseId = new EventEmitter<number>();

  @Input()
  product!: Products;
  constructor() { }

  ngOnInit(): void {
    console.log(this.product, this.cases);
  }

  saveCase() {

  }

}
