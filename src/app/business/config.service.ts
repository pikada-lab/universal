import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private host: string;
  company?: any[];
  constructor(private http: HttpClient) {
    this.host = environment.host;
   }

  getCompany() {
    if(this.company) return of(this.company);
    return this.http.get<any[]>(this.host + "/api/company/").pipe(map((r)=> {
      this.company = r;
      return r;
    }));
  }
}
