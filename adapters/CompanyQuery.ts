import * as mysql from "mysql2";

export async function CompanyQuery(config: any) {
 
    const connection = mysql.createConnection(config);
  
    const company = await new Promise<any[]>((res, rej) => {
      connection.query(
        'SELECT * FROM `company` ORDER BY `company`.`sort` DESC',
        (err: any, results: any, fields: any) => {
          connection.destroy();
          res(results);
        }
      );
    });
    connection.destroy();
    return company;
}