const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');
const path = require("path");
let str = `# Аптечка\n**Описание**\nТекст`; 
(async () => {
	const pdf = await mdToPdf({ content: str }, {
    stylesheet: [path.join(__dirname, "src",  "pdf.css")],
    path: '55943.md',
    pdf_options: {
      format: 'A4',
      margin: '10mm',
      printBackground: true,
    },
    stylesheet_encoding: 'utf-8',
  }).catch(console.error);

	if (pdf) { 
		fs.writeFileSync("pdf/111.pdf", pdf.content);
	}
})();