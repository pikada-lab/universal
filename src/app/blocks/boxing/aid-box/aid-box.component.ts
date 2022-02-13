import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-aid-box',
  templateUrl: './aid-box.component.html',
  styleUrls: ['./aid-box.component.css']
})
export class AidBoxComponent implements OnInit {

  @Input()
  case!: Products;

  @Input()
  caseId!: number;

  @Output()
  saveCase = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit(): void {
  } 
}
