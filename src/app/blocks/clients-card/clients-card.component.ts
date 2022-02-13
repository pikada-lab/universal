import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients-card',
  templateUrl: './clients-card.component.html',
  styleUrls: ['./clients-card.component.css']
})
export class ClientsCardComponent implements OnInit {

  @Input()
  company: any;

  constructor() { }

  ngOnInit(): void {
  }

}
