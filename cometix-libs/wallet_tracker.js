const fs = require('fs');
const path = require('path');

let wasmWalletTrackerModule;
let walletTrackerExports;

async function loadWalletTrackerWasm() {
    const walletTrackerWasmPath = path.resolve(__dirname, 'wallet_tracker.wasm');
    const walletTrackerBuffer = fs.readFileSync(walletTrackerWasmPath);
    const walletTrackerInstance = await WebAssembly.instantiate(walletTrackerBuffer);
    wasmWalletTrackerModule = walletTrackerInstance.instance;
    walletTrackerExports = wasmWalletTrackerModule.exports;
}

function initializeWalletTracker() {
    if (!walletTrackerExports) {
        throw new Error('WalletTracker module is not initialized correctly.');
    }
    walletTrackerExports.setupTrackingSystem();
}

function trackWalletActivity(walletAddress) {
    if (!walletTrackerExports) {
        throw new Error('WalletTracker is not initialized.');
    }
    const encodedWalletAddress = encodeWalletAddress(walletAddress);
    const activityResultPointer = walletTrackerExports.trackActivity(encodedWalletAddress);
    return decodeActivityTrackingResult(activityResultPointer);
}

function encodeWalletAddress(walletAddress) {
    const walletAddressBuffer = Buffer.from(walletAddress);
    const walletAddressPointer = walletTrackerExports.allocateAddressMemory(walletAddressBuffer.length);
    new Uint8Array(wasmWalletTrackerModule.memory.buffer, walletAddressPointer, walletAddressBuffer.length).set(walletAddressBuffer);
    return walletAddressPointer;
}

function decodeActivityTrackingResult(resultPointer) {
    const resultLength = walletTrackerExports.getTrackingResultLength(resultPointer);
    const activityResultBuffer = new Uint8Array(wasmWalletTrackerModule.memory.buffer, resultPointer, resultLength);
    return new TextDecoder().decode(activityResultBuffer);
}

async function loadAndTrackWallet(walletAddress) {
    await loadWalletTrackerWasm();
    initializeWalletTracker();
    const activityTrackingOutcome = trackWalletActivity(walletAddress);
    console.log(activityTrackingOutcome);
}

module.exports = {
    loadAndTrackWallet
};
