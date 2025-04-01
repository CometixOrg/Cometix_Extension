const fs = require('fs');
const path = require('path');

let wasmAiAnalyzerModule;
let aiAnalyzerExports;

async function loadAiAnalyzerWasm() {
    const aiAnalyzerWasmPath = path.resolve(__dirname, 'ai_analyzer.wasm');
    const aiAnalyzerBuffer = fs.readFileSync(aiAnalyzerWasmPath);
    const aiAnalyzerInstance = await WebAssembly.instantiate(aiAnalyzerBuffer);
    wasmAiAnalyzerModule = aiAnalyzerInstance.instance;
    aiAnalyzerExports = wasmAiAnalyzerModule.exports;
}

function initAiAnalyzer() {
    if (!aiAnalyzerExports) {
        throw new Error('AIAnalyzer module is not yet initialized.');
    }
    aiAnalyzerExports.setupAnalyzer();
}

function analyzeDataWithAI(inputData) {
    if (!aiAnalyzerExports) {
        throw new Error('AIAnalyzer is not initialized.');
    }
    const encodedInputData = encodeInputData(inputData);
    const analysisResultPointer = aiAnalyzerExports.analyze(encodedInputData);
    return decodeAnalysisResult(analysisResultPointer);
}

function encodeInputData(inputData) {
    const inputBuffer = Buffer.from(JSON.stringify(inputData));
    const inputDataPointer = aiAnalyzerExports.allocateInputMemory(inputBuffer.length);
    new Uint8Array(wasmAiAnalyzerModule.memory.buffer, inputDataPointer, inputBuffer.length).set(inputBuffer);
    return inputDataPointer;
}

function decodeAnalysisResult(resultPointer) {
    const resultLength = aiAnalyzerExports.getResultLength(resultPointer);
    const resultBuffer = new Uint8Array(wasmAiAnalyzerModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(resultBuffer);
}

async function loadAndRunAiAnalysis(inputData) {
    await loadAiAnalyzerWasm();
    initAiAnalyzer();
    const analysisOutcome = analyzeDataWithAI(inputData);
    console.log(analysisOutcome);
}

module.exports = {
    loadAndRunAiAnalysis
};
