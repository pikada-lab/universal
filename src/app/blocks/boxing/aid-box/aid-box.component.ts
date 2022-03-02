import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  img?: SafeResourceUrl;
  
  constructor(private ssd: DomSanitizer) { }

  ngOnInit(): void {
    this.img = this.ssd.bypassSecurityTrustResourceUrl(this.case.img);
  } 
}
