export class MDUtilit {
  private EOL = '\n';
  private tab = ' ';
  private html: string = '';
  constructor(private md: string) {
    this.render();
  }

  private render() {
    let lines = this.md
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r !== '');
    console.log(lines);
    this.html = lines
      .map(this.renderStrong)
      .map(this.renderItalic)
      .map(this.renderHeader4)
      .map(this.renderHeader3)
      .map(this.renderHeader2)
      .map(this.renderHeader1)
      .map((t, i, a) => this.renderTableHeader(t, i, a))
      .filter((r) => r !== '')
      .map((t, i, a) => this.renderListUL(t, i, a))
      .filter((r) => r !== '')
      .map((t, i, a) => this.renderListOL(t, i, a))
      .filter((r) => r !== '')
      .map(this.renderHr)
      .map(this.renderP)
      .join('\n');
  }

  renderStrong(text: string) {
    return text.replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`);
  }
  renderItalic(text: string) {
    return text.replace(/\*(.+?)\*/g, `<i>$1</i>`);
  }
  renderHeader4(text: string) {
    return text.replace(/^\#\#\#\#\s+(.+)$/, `<h4>$1</h4>\n`);
  }
  renderHeader3(text: string) {
    return text.replace(/^\#\#\#\s+(.+)$/, `<h3>$1</h3>\n\n`);
  }
  renderHeader2(text: string) {
    return text.replace(/^\#\#\s+(.+)$/, `<h2>$1</h2>\n\n`);
  }
  renderHeader1(text: string) {
    return text.replace(/^\#\s+(.+)$/, `<h1>$1</h1>\n\n`);
  }
  renderTableHeader(text: string, index: number, array: string[]) {
    if (array.length == index + 1) return text;
    if (!/(\|\s*(\:?\-+\:?)\s*)+\|?/.test(array[index + 1])) return text;
    // is header

    let model = this.tableStringTrims(array[index + 1]).map((r) => {
      if (r[0] === ':' && r[r.length - 1] === ':') return 'CENTER';
      if (r[r.length - 1] === ':') return 'RIGHT';
      return 'LEFT';
    });
    let head = this.tableStringTrims(text);
    array[index + 1] = '';
    let th = '';
    for (let index in model) {
      th += this.addSimpleTagWithAlign('th', model[index], head[index], 4);
    }
    let header = this.addSimpleTag(
      'head',
      this.addSimpleTag('tr', th.trimEnd(), 2).trimEnd(),
      1
    ).trimEnd();
    let i = 1;
    let table = '';
    while (array[index + 1 + i]?.[0] && array[index + 1 + i]?.[0] === '|') {
      let tr = '';
      let str = array[index + 1 + i];
      let td = this.tableStringTrims(str);
      for (let index in model) {
        tr += this.addSimpleTag('td', td[index] ?? '', 4);
      }
      table += this.addSimpleTag('tr', tr, 3);
      array[index + 1 + i] = '';
      i++;
    }
    table = this.addSimpleTag("tbody", table, 1);
    return this.addSimpleTag('table', header + table, 0);
  }

  private renderListUL(text: string, index: number, lines: string[]) {
    if (!/^(\*\s+)/.test(text)) return text;
    // isList;
    let i = 0;
    let ul = '';
    while (lines[index + i] && lines[index + i]?.[0] === '*') {
      ul += this.addSimpleTag(
        'li',
        lines[index + i].replace(/^(\*\s+)/, '').trim(),
        1
      );
      lines[index + i] = '';
      i++;
    }
    return this.addSimpleTag('ul', ul);
  }
  private renderListOL(text: string, index: number, lines: string[]) {
    if (!/^(\d+\.\s+)/.test(text)) return text;
    // isList;
    let i = 0;
    let ol = '';
    while (lines[index + i] && /^(\d+\.\s+)/.test(lines[index + i])) {
      ol += this.addSimpleTag(
        'li',
        lines[index + i].replace(/^(\d+\.\s+)/, '').trim(),
        1
      );
      lines[index + i] = '';
      i++;
    }
    return this.addSimpleTag('ol', ol);
  }
  private addSimpleTag(name: string, content: string, n = 0) {
    return this.addString(
      `<${name}>${this.tab.repeat(n + 1)}${content}</${name}>`,
      n
    );
  }
  private addSimpleTagWithAlign(
    name: string,
    align: string,
    content: string,
    n = 0
  ) {
    return this.addString(`<${name} align="${align}">${content}</${name}>`, n);
  }
  private addString(str: string, n = 0) {
    return this.tab.repeat(n) + str + this.EOL;
  }
  private tableStringTrims(arr: string) {
    return arr
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((r) => r.trim());
  }

  private renderHr(text: string) {
    if(text !== "---") return text;
    return "<hr />";
  }
  renderP(text: string) {
    if (text[0] === '<') return text;
    return `<p>${text}</p>`;
  }

  toHTML() {
    return this.html;
  }
}
