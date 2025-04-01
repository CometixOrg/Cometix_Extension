const fs = require('fs');
const path = require('path');

let wasmTransactionAnalyzerModule;
let transactionAnalyzerExports;

async function loadTransactionAnalyzerWasm() {
    const transactionAnalyzerWasmPath = path.resolve(__dirname, 'transaction_analyzer.wasm');
    const transactionAnalyzerBuffer = fs.readFileSync(transactionAnalyzerWasmPath);
    const transactionAnalyzerInstance = await WebAssembly.instantiate(transactionAnalyzerBuffer);
    wasmTransactionAnalyzerModule = transactionAnalyzerInstance.instance;
    transactionAnalyzerExports = wasmTransactionAnalyzerModule.exports;
}

function initializeTransactionAnalyzer() {
    if (!transactionAnalyzerExports) {
        throw new Error('TransactionAnalyzer is not initialized.');
    }
    transactionAnalyzerExports.setupTransactionAnalyzer();
}

function analyzeTransaction(transactionData) {
    if (!transactionAnalyzerExports) {
        throw new Error('TransactionAnalyzer is not initialized.');
    }
    const encodedTransactionData = encodeTransactionData(transactionData);
    const analysisResultPointer = transactionAnalyzerExports.analyzeTransaction(encodedTransactionData);
    return decodeTransactionAnalysisResult(analysisResultPointer);
}

function encodeTransactionData(transactionData) {
    const transactionDataBuffer = Buffer.from(JSON.stringify(transactionData));
    const transactionDataPointer = transactionAnalyzerExports.allocateTransactionMemory(transactionDataBuffer.length);
    new Uint8Array(wasmTransactionAnalyzerModule.memory.buffer, transactionDataPointer, transactionDataBuffer.length).set(transactionDataBuffer);
    return transactionDataPointer;
}

function decodeTransactionAnalysisResult(resultPointer) {
    const resultLength = transactionAnalyzerExports.getAnalysisResultLength(resultPointer);
    const analysisResultBuffer = new Uint8Array(wasmTransactionAnalyzerModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(analysisResultBuffer);
}

async function loadAndAnalyzeTransaction(transactionData) {
    await loadTransactionAnalyzerWasm();
    initializeTransactionAnalyzer();
    const analysisOutcome = analyzeTransaction(transactionData);
    console.log(analysisOutcome);
}

module.exports = {
    loadAndAnalyzeTransaction
};
