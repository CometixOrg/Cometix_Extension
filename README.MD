## Cometix Security Web Extension

<div align="center">
  <img src="https://github.com/CometixOrg/Cometix_Extension/tree/main/readme_assets/banner.png" width="100%" alt="banner" />
</div>

### Our website
- 🌐 [Cometix](https://cometix.run/)

---

The **Security Web Extension** is the flagship development by Cometix, engineered to protect the Web3 ecosystem. It is a browser extension compatible with Chrome, Firefox, and other major browsers, and it integrates a suite of tools aimed at detecting and preventing threats such as phishing, fraudulent smart contracts, and various exploits.

Built on a hybrid model, the extension includes four open-source tools alongside AI-powered proprietary modules that provide advanced threat detection, predictive capabilities, and real-time analysis.

---

## 🔐 Key Features

### 1. Transaction Analyzer *(Open Source)*
Monitors blockchain transactions in real-time using AI. Detects suspicious patterns like unauthorized fund transfers or connections to malicious addresses and provides instant browser alerts.

### 2. Wallet Analyzer & AML Checker *(Open Source)*
Evaluates wallets for risk and suspicious activity using AI and anti-money laundering protocols. Warns users before interaction with compromised accounts.

### 3. Wallet Tracker *(Open Source)*
Tracks wallet activity (transactions, dApp usage, balance changes). Provides real-time alerts for any unusual behavior, enhancing vigilance.

### 4. Protocol Checker & Solana Program Checker *(Open Source)*
Analyzes smart contracts for vulnerabilities, especially within Solana programs. Prevents user interaction with insecure contracts.

### 5. Honeypot Checker
Detects honeypot scams by scanning contracts for withdrawal restrictions or owner-only functions using AI.

### 6. AI Analyzer
Predicts emerging threats and fraud patterns in the Web3 space using large-scale data analysis.

### 7. Real-Time Analysis
Analyzes site behavior and structure on the fly to detect phishing attempts or scam mechanisms.

### 8. Real-Time Vulnerability Scanner
Scans websites, dApps, and contracts for vulnerabilities as users interact with them.

### 9. Sandbox
A secure environment for testing Web3 interactions without risk. Ideal for developers and cautious users.

### 10. AI Assistant
Provides live guidance, risk analysis, and security tips for Web3 navigation, powered by AI.

### 11. Analytics
Aggregates user and threat data into a comprehensive dashboard, helping users make informed decisions.

---

## WebAssembly Compilation Guide
👉 For a complete build of this project, you’ll need to compile several of our libraries to WebAssembly (WASM). Each library has its own README with specific build instructions:
- [Wallet Analyzer lib](https://github.com/CometixOrg/Wallet_Analyzer)
- [Protocol and Program Checker lib](https://github.com/CometixOrg/Protocol_and_Solana_Program_Checker)
- [Wallet Tracker lib](https://github.com/CometixOrg/Wallet_Tracker)
- [Transaction Analyzer](https://github.com/CometixOrg/Transaction_Analyzer) 


---

## 🧪 Custom Library Build & Integration Guide

### Step 1: Install Dependencies

#### Emscripten (for C/C++)
```bash
# Install and activate
source ~/emsdk/emsdk_env.sh
```

#### Rust (if using Rust)
```bash
# Install and set target
rustup target add wasm32
```

#### Node.js and npm
```bash
node -v
npm -v
```

---

### Step 2: Clone Source Repository

Clone the project repo containing the source code of each tool.

---

### Step 3: Compile to WASM

Example for C++ (Emscripten):
```bash
cd ai_analyzer
emcc source_file.cpp -o ai_analyzer.wasm -s WASM=1 -s EXPORTED_FUNCTIONS="['_function1', '_function2']" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']"
```

Example for Rust:
```bash
cargo build --target wasm32 --release
```

Repeat this for each tool:
- ai_analyzer
- proto-checker
- transaction_analyzer
- wallet_analyzer
- aml_checker
- scam_detector
- vulnerability-scanner
- wallet_tracker

---

### Step 4: Confirm Compilation

```bash
ls dist/
# Output should include:
ai_analyzer.wasm
proto-checker.wasm
...
wallet_tracker.wasm
```

---

### Step 5: Integration

Use the WASM files in your browser extension or dApp:

```javascript
fetch('path/to/ai_analyzer.wasm')
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes))
  .then(wasmModule => {
    const aiAnalyzer = wasmModule.instance.exports;
  })
  .catch(err => console.error('Error loading WASM:', err));
```

---

### Step 6: Testing

Thoroughly test all WASM modules and their browser integration. Use debug tools and simulated scenarios to ensure everything runs smoothly.

> Tip: Use optimization flags (e.g., `-O2`) to reduce WASM file sizes.

---

## ⚙️ Local Project Setup (Chrome Extension)

### 1. Install Dependencies

```bash
npm install
```

Make sure you're using Node.js v16+.

---

### 2. Build the Project

```bash
npm run build
```

Ensure there are no errors. A `dist/` folder will be generated.

---

### 3. Verify dist/ Contents

Includes:
- Compiled JS
- CSS
- HTML interfaces
- Extension manifest

---

### 4. Load into Chrome

1. Go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `dist/` directory

---

### 5. Done ✅

The extension is now installed. Rebuild and click “Update” in the Chrome Extensions tab to refresh it.

---

## 🔍 Useful Scripts

```bash
npm run dev       # Launch in dev mode with hot-reload
npm run lint      # Run linter
npm run format    # Auto-format code
```

> Advanced users: see `babel.config.js`, `postcss.config.js`, `eslint.config.js` for configuration tweaks.
