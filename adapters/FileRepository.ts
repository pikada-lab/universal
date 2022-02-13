import { readFileSync, unlinkSync, writeFile, writeFileSync } from 'fs';

export class FileRepository {
  private files: Map<string, any> = new Map();
  constructor(private source: string) {
    try {
      const file = readFileSync(this.source, {
        encoding: 'utf8',
        flag: 'r',
      });
      if (file) {
        let fileData = JSON.parse(file) as any[];
        fileData.forEach((element) => {
          this.files.set(element.id, element);
        });
      }
    } catch (ex) {
      writeFileSync(this.source, "[]", "utf8");
    }
    setInterval(() => {
      this.ckeckTTL(1000 * 60 * 1);
    },5000);
  }

  ckeckTTL(ttl: number) {
    let current = Date.now();
    console.log("[TTL]","try clean")
    for(let item of Array.from(this.files.values())) {
      console.log("[TTL]", new Date(item.create_at + ttl), "<", new Date(current))
      if(item.create_at + item.ttl < current) {
        try {
        this.delete(item.id);
        console.log("[TTL]","Delete file", item.id, item.name);
        } catch(ex: any) {
          console.log("[TTL]",ex?.message)
        }
      }
    }
  }

  get(id: string) {
    if (!this.files.has(id)) throw new Error("File is not exist");
    return this.files.get(id);

  }

  add(file: any) {
    this.files.set(file.id, file);
    // Записываем
    this.save();
  }
  delete(id: string) {
    if (!this.files.has(id)) return console.log("No file");
    let file = this.files.get(id); 
    try {
      unlinkSync(file.path);
    } catch(ex: any) {
      console.log(ex.message);
    }
    console.log("delete in db");
    this.files.delete(file.id);
    this.save();
    return;
  }

  private save() {
    writeFile(
      this.source,
      JSON.stringify(Array.from(this.files.values())),
      'utf8',
      (err) => {
        if (err) console.log(err);
      }
    );
  }
}
