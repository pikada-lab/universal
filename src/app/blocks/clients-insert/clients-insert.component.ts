import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/business/config.service';
import { initSlider } from './slider';

@Component({
  selector: 'app-clients-insert',
  templateUrl: './clients-insert.component.html',
  styleUrls: ['./clients-insert.component.css'],
})
export class ClientsInsertComponent implements OnInit, AfterViewInit {
  company?: any[];
  isAfterViewInit = false;
  create = new EventEmitter();
  constructor(private config: ConfigService) {}

  ngAfterViewInit(): void {
    this.isAfterViewInit = true;
    this.create.emit(); 
  }

  ngOnInit(): void {
    this.config.getCompany().subscribe((r) => {
      this.company = r.slice(0, 10); 
      this.create.emit();
    });
    this.create.subscribe(r => {
      if(this.company && this.isAfterViewInit) {
        setTimeout(() => {
          initSlider();
        },500)
      }
    })
  }
}
