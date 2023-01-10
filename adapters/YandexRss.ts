import { Products } from 'src/app/models';
import { MDUtilit } from './MDUtilit';

export class YandexRss {
  private EOL = '\n';
  private tab = '\t';

  constructor(private products: Products[]) {}

  body() {
    let body = this.addString(`<?xml version="1.0" encoding="UTF-8"?>`);
    body += this.addString(
      `<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0">`
    );
    body += this.addString(`<channel>`, 1);
    body += this.getChannelContent();
    body += this.getHome();
    body += this.getProducts(this.products);
    body += this.products.map((r) => this.getItemContent(r)).join('\n');

    body += this.addString(`</channel>`, 1);
    body += this.addString(`</rss>`);
    return body;
  }

  private getChannelContent() {
    let channel = this.addSimpleTag('title', 'Аптечки ру', 3);
    channel += this.addSimpleTag('link', 'https://aptechki.ru', 3);
    channel += this.addSimpleTag(
      'description',
      'Укомплектуем аптечку по вашему заказу. Мы поставляем аптечки, соответствующие актуальным приказам по России уже более 10 лет. С доставкой в офис, на склад и производство.',
      3
    );
    channel += this.addSimpleTag('language', 'ru', 3);
    // channel += this.addSimpleTag('turbo:analytics', '87712774', 3);
    return channel;
  }

  getItemContent(item: Products) {
    let content = `<item turbo="true">`;
    content += this.addSimpleTag('turbo:extendedHtml', 'true', 3);
    content += this.addSimpleTag(
      'link',
      `https://aptechki.ru/products/${item.id}`,
      3
    );
    content += this.addSimpleTag('turbo:topic', 'Аптечка', 3);
    content += this.addSimpleTag(
      'pubDate',
      new Date(item.updateAt).toUTCString(),
      3
    );
    content += this.addSimpleTag('metrics', this.getMetricsContent(item), 3);
    content += this.addSimpleTag(
      'turbo:content',
      `<![CDATA[ ${this.getMdContent(item)} ]]>`,
      3
    );
    content += `</item>`;
    return content;
  }

  getHome() {
    let content = `<item turbo="true">\n`;
    content += ' <turbo:extendedHtml>true</turbo:extendedHtml>';

    content += this.addSimpleTag(
      'pubDate',
      new Date('2022-04-28').toUTCString(),
      3
    );
    content += ' <link>https://aptechki.ru/</link>\n';
    content += ' <turbo:content>\n<![CDATA[';
    content += this.getMdContent({
      title: 'Аптечки ру',
      subtitle:
        'Мы поставляем аптечки, соответствующие актуальным приказам по России уже более 10 лет. С доставкой в офис, на склад и производство, в том числе укладку неотложной помощи по приказу МЗ РФ номер 1183н, Антишок, посиндомные. Состав аптечек и наличае товара уточняйте у менеджера.',
      img: 'https://aptechki.ru/assets/logo.apt2@2x.png',
      text: `
      # Укомплектуем аптечку по вашему заказу

      Мы поставляем аптечки, соответствующие актуальным приказам по России уже более 10 лет. С доставкой в офис, на склад и производство, в том числе укладку неотложной помощи по приказу МЗ РФ номер 1183н, Антишок, посиндомные. Состав аптечек и наличае товара уточняйте у менеджера.

      <a href='https://aptechki.ru/products/'>Смотреть все аптечки</a>
      `,
    } as any);
    content += ' <h1>Укомплектуем аптечку по вашему заказу</h1>';
    content +=
      ' <p>Мы поставляем аптечки, соответствующие актуальным приказам по России уже более 10 лет. С доставкой в офис, на склад и производство, в том числе укладку неотложной помощи по приказу МЗ РФ номер 1183н, Антишок, посиндомные. Состав аптечек и наличае товара уточняйте у менеджера.</p>';
    content +=
      " <p><a href='https://aptechki.ru/products/'>Смотреть все аптечки</a></p>";
    content += ' ]]> </turbo:content>\n';
    content += ' ';
    return content + `</item>`;
  }

  getProducts(products: Products[]) {
    let content = `<item turbo="true">\n`;
    content += ' <turbo:extendedHtml>true</turbo:extendedHtml>';

    content += this.addSimpleTag(
      'pubDate',
      new Date('2022-01-01').toUTCString(),
      3
    );
    content += ' <link>https://aptechki.ru/products/</link>\n';
    content += ' <turbo:content>\n<![CDATA[';
    content += this.getMdContent({
      title: 'Аптечки ру',
      subtitle:
        'Мы поставляем аптечки, соответствующие актуальным приказам по России уже более 10 лет. С доставкой в офис, на склад и производство, в том числе укладку неотложной помощи по приказу МЗ РФ номер 1183н, Антишок, посиндомные. Состав аптечек и наличае товара уточняйте у менеджера.',
      img: 'https://aptechki.ru/assets/logo.apt2@2x.png',
      text:
        `
      # Аптечки
  ` +
        products.map(
          (r) =>
            `<a href='https://aptechki.ru/products/${r.id}'>${r.title}</a>
 
            `
        ),
    } as any);
    content += ' <h1>Укомплектуем аптечку по вашему заказу</h1>';
    content +=
      ' <p>Мы поставляем аптечки, соответствующие актуальным приказам по России уже более 10 лет. С доставкой в офис, на склад и производство, в том числе укладку неотложной помощи по приказу МЗ РФ номер 1183н, Антишок, посиндомные. Состав аптечек и наличае товара уточняйте у менеджера.</p>';
    content +=
      " <p><a href='https://aptechki.ru/products/'>Смотреть все аптечки</a></p>";
    content += ' ]]> </turbo:content>\n';
    content += ' ';
    return content + `</item>`;
  }
  private getMetricsContent(item: Products) {
    let content = `<breadcrumb url="https://aptechki.ru/" text="Домашняя"/>`;
    content += `<breadcrumb url="https://aptechki.ru/products" text="Аптечки"/>`;
    content += `<breadcrumb url="https://aptechki.ru/products/${item.id}" text="${item.title}"/>`;
    content = this.addSimpleTag('breadcrumblist', content, 4);
    return `<yandex schema_identifier="87712774">${content}</yandex>`;
  }
  private addSimpleTag(name: string, content: string, n = 0) {
    return this.addString(`<${name}>${content}</${name}>`, n);
  }

  private addString(str: string, n = 0) {
    return this.tab.repeat(n) + str + this.EOL;
  }

  private getMdContent(item: Products) {
    return `
<header>
  <h1>Аптечки ру</h1>
  <h2>${item.title}</h2>
  <figure>
      <img src="${item.img}"/>
  </figure>
  <menu>
      <a href="https://aptechki.ru/">Домашняя</a>
      <a href="https://aptechki.ru/products">Аптечки</a>
      <a href="https://aptechki.ru/clients">Наши клиенты</a>
      <a href="https://aptechki.ru/contacts">Контакты</a>
  </menu>
</header>
<p>${item.subtitle}</p>
${new MDUtilit(item.text).toHTML()}
<button formaction="tel:+88002009697" data-background-color="#5B97B0" data-color="white" data-primary="true">Позвонить нам</button>
`;
  }
}
