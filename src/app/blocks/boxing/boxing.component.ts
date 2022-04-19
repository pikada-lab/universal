import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Products } from 'src/app/models'; 

@Component({
  selector: 'app-boxing',
  templateUrl: './boxing.component.html',
  styleUrls: ['./boxing.component.css']
})
export class BoxingComponent implements OnInit {

  @Output()
  caseIdChange = new EventEmitter<number>();

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
    
  }
 

}
