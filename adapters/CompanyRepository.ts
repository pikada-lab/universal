import { Clients } from "src/app/models";

 

export class CompanyRepository {
  private company: Clients[] = []
  constructor( ) {  }
 
  setCompany(company: Clients[]) {
      this.company = company;
  }
  getAllCompany() {
    return this.company;
  }
}