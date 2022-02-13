import { Pipe, PipeTransform } from "@angular/core"; 

@Pipe({
  name: "numberFor3"
})
export class NumberFor3Pipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (args == 1) {
      return (
        Math.round(+value / 100)
          .toString()
          .replace(/(\d{1,3})(?=(?:\d{3})+$)/g, "$1 ") +
        "." +
        Math.abs(value % 100)
          .toString()
          .padStart(2, "0")
      );
    }
    if (args == 2) {
      return (
        Math.round(+value / 100)
          .toString()
          .replace(/(\d{1,3})(?=(?:\d{3})+$)/g, "$1 ")
      );
    }
    return Math.round(+value)
      .toString()
      .replace(/(\d{1,3})(?=(?:\d{3})+$)/g, "$1 ");
  }
}
