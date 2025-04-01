const fs = require('fs');
const path = require('path');

let wasmScamDetectorModule;
let scamDetectorExports;

async function loadScamDetectorWasm() {
    const scamDetectorWasmPath = path.resolve(__dirname, 'scam_detector.wasm');
    const scamDetectorBuffer = fs.readFileSync(scamDetectorWasmPath);
    const scamDetectorInstance = await WebAssembly.instantiate(scamDetectorBuffer);
    wasmScamDetectorModule = scamDetectorInstance.instance;
    scamDetectorExports = wasmScamDetectorModule.exports;
}

function initScamDetector() {
    if (!scamDetectorExports) {
        throw new Error('ScamDetector not initialized correctly.');
    }
    scamDetectorExports.initializeDetection();
}

function detectScam(scamData) {
    if (!scamDetectorExports) {
        throw new Error('ScamDetector is not initialized.');
    }
    const encodedScamData = encodeScamData(scamData);
    const scamDetectionResultPointer = scamDetectorExports.runDetection(encodedScamData);
    return decodeScamDetectionResult(scamDetectionResultPointer);
}

function encodeScamData(scamData) {
    const scamDataBuffer = Buffer.from(JSON.stringify(scamData));
    const scamDataPointer = scamDetectorExports.allocateScamMemory(scamDataBuffer.length);
    new Uint8Array(wasmScamDetectorModule.memory.buffer, scamDataPointer, scamDataBuffer.length).set(scamDataBuffer);
    return scamDataPointer;
}

function decodeScamDetectionResult(resultPointer) {
    const resultLength = scamDetectorExports.getDetectionResultLength(resultPointer);
    const scamResultBuffer = new Uint8Array(wasmScamDetectorModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(scamResultBuffer);
}

async function loadAndDetectScam(scamData) {
    await loadScamDetectorWasm();
    initScamDetector();
    const scamDetectionOutcome = detectScam(scamData);
    console.log(scamDetectionOutcome);
}

module.exports = {
    loadAndDetectScam
};
