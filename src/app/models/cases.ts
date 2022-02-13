/** Кейс */
export interface Cases {
  id: number;
  image: string;
  /** Название
   * @example Шкаф навесной пластик. белый д/аптечки
   * */
  name: string;
  /** Размер кейса -
   * @example 12x22x23 см
   * */
  size: string;
  /** Цена в копейках */
  price: number;
}
