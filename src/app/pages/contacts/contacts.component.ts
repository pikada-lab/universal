import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  url = "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A5f92c3f9b61894b30e5570056385b4950367025d84de1ccc0c7a5b2af9d797fa&amp;width=100%25&amp;height=720&amp;lang=ru_RU&amp;scroll=true";
  constructor() { }

  ngOnInit(): void {
    if(typeof document === "object" ) {
      let map = document.getElementById("map-container");
      if(!map) return;
      let script = document.createElement("script");
      script.src = this.url;
      script.async = true;
      map.appendChild(script);
    }
  }

}
