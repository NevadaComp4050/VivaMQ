const fs = require('fs');
const pdf = require('pdf-parse');
const stopwords = require('stopword');
const use = require('@tensorflow-models/universal-sentence-encoder');
require('@tensorflow/tfjs-node');

// this function effectively clenses/simplifies the PDF
function preprocessText(text) {
    text = text.toLowerCase();
    text = text.replace(/\d+/g, ''); // Remove digits
    text = text.replace(/[^\w\s]/g, ''); // Remove punctuation
    let tokens = text.split(/\s+/);
    tokens = stopwords.removeStopwords(tokens);
    return tokens.join(' '); // Join tokens back into a string
}

// embedes the information into an array
async function processPDF(filePath) {
    let dataBuffer = fs.readFileSync(filePath);
    let pdfData = await pdf(dataBuffer);
    let cleanedText = preprocessText(pdfData.text);
    const model = await use.load();
    const embeddings = await model.embed([cleanedText]);
    const array = await embeddings.array();
    console.log(array[0]);
}

processPDF('testpdf.pdf');