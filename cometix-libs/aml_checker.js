const fs = require('fs');
const path = require('path');

let wasmAmlCheckerModule;
let amlCheckerExports;

async function loadAmlCheckerWasm() {
    const amlCheckerWasmPath = path.resolve(__dirname, 'aml_checker.wasm');
    const amlCheckerBuffer = fs.readFileSync(amlCheckerWasmPath);
    const amlCheckerInstance = await WebAssembly.instantiate(amlCheckerBuffer);
    wasmAmlCheckerModule = amlCheckerInstance.instance;
    amlCheckerExports = wasmAmlCheckerModule.exports;
}

function initializeAmlChecker() {
    if (!amlCheckerExports) {
        throw new Error('AMLChecker module not initialized.');
    }
    amlCheckerExports.setupAmlVerificationSystem();
}

function checkAmlCompliance(amlData) {
    if (!amlCheckerExports) {
        throw new Error('AMLChecker is not initialized.');
    }
    const encodedAmlData = encodeAmlData(amlData);
    const complianceResultPointer = amlCheckerExports.verifyAmlCompliance(encodedAmlData);
    return decodeAmlComplianceResult(complianceResultPointer);
}

function encodeAmlData(amlData) {
    const amlDataBuffer = Buffer.from(JSON.stringify(amlData));
    const amlDataPointer = amlCheckerExports.allocateAmlMemory(amlDataBuffer.length);
    new Uint8Array(wasmAmlCheckerModule.memory.buffer, amlDataPointer, amlDataBuffer.length).set(amlDataBuffer);
    return amlDataPointer;
}

function decodeAmlComplianceResult(resultPointer) {
    const resultLength = amlCheckerExports.getComplianceResultLength(resultPointer);
    const amlResultBuffer = new Uint8Array(wasmAmlCheckerModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(amlResultBuffer);
}

async function loadAndCheckAml(amlData) {
    await loadAmlCheckerWasm();
    initializeAmlChecker();
    const amlComplianceOutcome = checkAmlCompliance(amlData);
    console.log(amlComplianceOutcome);
}

module.exports = {
    loadAndCheckAml
};
