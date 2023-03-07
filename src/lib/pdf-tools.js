import PdfPrinter from "pdfmake";

export const getPDFRedeableStream = (blog) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  const docDefinition = {
    content: [
      { text: blog.title, style: "header" },
      //   {
      //     image: "data:image/jpeg," + body.cover,
      //   },
      blog.content,
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },

    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfRedeableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfRedeableStream.end();

  return pdfRedeableStream;
};
