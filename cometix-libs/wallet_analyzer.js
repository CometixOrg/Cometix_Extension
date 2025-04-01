const fs = require('fs');
const path = require('path');

let wasmWalletAnalyzerModule;
let walletAnalyzerExports;

async function loadWalletAnalyzerWasm() {
    const walletAnalyzerWasmPath = path.resolve(__dirname, 'wallet_analyzer.wasm');
    const walletAnalyzerBuffer = fs.readFileSync(walletAnalyzerWasmPath);
    const walletAnalyzerInstance = await WebAssembly.instantiate(walletAnalyzerBuffer);
    wasmWalletAnalyzerModule = walletAnalyzerInstance.instance;
    walletAnalyzerExports = wasmWalletAnalyzerModule.exports;
}

function initializeWalletAnalyzer() {
    if (!walletAnalyzerExports) {
        throw new Error('WalletAnalyzer module is not initialized properly.');
    }
    walletAnalyzerExports.setupWalletAnalyzer();
}

function analyzeWallet(walletData) {
    if (!walletAnalyzerExports) {
        throw new Error('WalletAnalyzer is not initialized.');
    }
    const encodedWalletData = encodeWalletData(walletData);
    const analysisResultPointer = walletAnalyzerExports.analyzeWallet(encodedWalletData);
    return decodeWalletAnalysisResult(analysisResultPointer);
}

function encodeWalletData(walletData) {
    const walletDataBuffer = Buffer.from(JSON.stringify(walletData));
    const walletDataPointer = walletAnalyzerExports.allocateWalletMemory(walletDataBuffer.length);
    new Uint8Array(wasmWalletAnalyzerModule.memory.buffer, walletDataPointer, walletDataBuffer.length).set(walletDataBuffer);
    return walletDataPointer;
}

function decodeWalletAnalysisResult(resultPointer) {
    const resultLength = walletAnalyzerExports.getAnalysisResultLength(resultPointer);
    const walletAnalysisResultBuffer = new Uint8Array(wasmWalletAnalyzerModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(walletAnalysisResultBuffer);
}

async function loadAndAnalyzeWallet(walletData) {
    await loadWalletAnalyzerWasm();
    initializeWalletAnalyzer();
    const walletAnalysisOutcome = analyzeWallet(walletData);
    console.log(walletAnalysisOutcome);
}

module.exports = {
    loadAndAnalyzeWallet
};
