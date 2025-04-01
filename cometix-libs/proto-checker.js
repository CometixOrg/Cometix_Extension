const fs = require('fs');
const path = require('path');

let wasmModule;
let protocolCheckerExports;

async function loadWasmModule() {
    const wasmPath = path.resolve(__dirname, 'protocol_checker.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmInstance = await WebAssembly.instantiate(wasmBuffer);
    wasmModule = wasmInstance.instance;
    protocolCheckerExports = wasmModule.exports;
}

function initializeProtocolChecker() {
    if (!protocolCheckerExports) {
        throw new Error('ProtocolChecker not initialized.');
    }
    protocolCheckerExports.initChecker();
}

function checkProtocol(protocolData) {
    if (!protocolCheckerExports) {
        throw new Error('ProtocolChecker not initialized.');
    }
    const encodedData = encodeProtocolData(protocolData);
    const resultPointer = protocolCheckerExports.checkProtocol(encodedData);
    return decodeCheckResult(resultPointer);
}

function encodeProtocolData(protocolData) {
    const buffer = Buffer.from(JSON.stringify(protocolData));
    const encodedDataPtr = protocolCheckerExports.allocateMemory(buffer.length);
    new Uint8Array(wasmModule.memory.buffer, encodedDataPtr, buffer.length).set(buffer);
    return encodedDataPtr;
}

function decodeCheckResult(resultPointer) {
    const resultLength = protocolCheckerExports.getResultLength(resultPointer);
    const resultBuffer = new Uint8Array(wasmModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(resultBuffer);
}

async function loadAndUseProtocolChecker(protocolData) {
    await loadWasmModule();
    initializeProtocolChecker();
    const checkResult = checkProtocol(protocolData);
    console.log(checkResult);
}

module.exports = {
    loadAndUseProtocolChecker
};
