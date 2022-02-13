import { Component, Input, OnInit } from '@angular/core';
import { Products } from 'src/app/models';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent implements OnInit {

  @Input()
  product!: Products;
  constructor() { }

  ngOnInit(): void {
  }

}
