import PdfPrinter from "pdfmake";
// import imageToBase64 from "image-to-base64";

export const getPDFRedeableStream = async (blog) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);

  //   const encodedImage = await imageToBase64(blog.cover);

  const docDefinition = {
    content: [
      { text: blog.title, style: "header" },
      //   {
      //     image: `data:image/jpeg;base64,${encodedImage}`,
      //     width: 150,
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
