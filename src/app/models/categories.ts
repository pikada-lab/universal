export class Categories {
  id!: number;
  /** Awesome icons - https://fontawesome.com/v5.15/icons
   * @example fa-people-carry
   * @default fa-briefcase-medical
   */
  icon!: string;
  /** Название категории */
  title!: string;
  /** Файл PDF с приказом, не обязательный */
  file?: string;
}
