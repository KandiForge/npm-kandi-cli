#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const crypto = require('crypto');

const RELEASE_VERSION = '1.0.2';
const REPO = 'KandiForge/kandi-cli-osx';

function getArch() {
  const arch = process.arch;
  if (arch === 'x64') return 'x86_64';
  if (arch === 'arm64') return 'arm64';
  throw new Error(`Unsupported architecture: ${arch}`);
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading from: ${url}`);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function verifyChecksum(filePath, expectedHash) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => {
      const fileHash = hash.digest('hex');
      if (fileHash === expectedHash) {
        resolve(true);
      } else {
        reject(new Error(`Checksum mismatch. Expected: ${expectedHash}, Got: ${fileHash}`));
      }
    });
    stream.on('error', reject);
  });
}

async function install() {
  try {
    const arch = getArch();
    const platform = process.platform;
    
    if (platform !== 'darwin') {
      throw new Error(`Platform ${platform} is not supported. Only macOS is supported.`);
    }
    
    // Download URL for the binary
    const fileName = `kandi-cli-v${RELEASE_VERSION}-macos-universal.tar.gz`;
    const downloadUrl = `https://github.com/${REPO}/releases/download/v${RELEASE_VERSION}/${fileName}`;
    
    const binDir = path.join(__dirname, '..', 'bin');
    const tempFile = path.join(binDir, fileName);
    
    // Create bin directory if it doesn't exist
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }
    
    // Download the release tarball
    console.log(`Installing Kandi CLI v${RELEASE_VERSION} for ${platform} ${arch}...`);
    await downloadFile(downloadUrl, tempFile);
    
    // Extract the binary
    console.log('Extracting binary...');
    execSync(`tar -xzf "${tempFile}" -C "${binDir}"`, { stdio: 'inherit' });
    
    // Clean up tarball
    fs.unlinkSync(tempFile);
    
    // Make binary executable
    const binaryPath = path.join(binDir, 'kandi');
    fs.chmodSync(binaryPath, 0o755);
    
    console.log('✅ Kandi CLI installed successfully!');
    console.log(`Binary location: ${binaryPath}`);
    console.log('\nTo get started, run: kandi --help');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    
    // Fallback: Try to use locally built binary if available
    const localBinary = '/Users/admin/kandi-forge/kandi-cli/target/release/kandi';
    const binDir = path.join(__dirname, '..', 'bin');
    const targetBinary = path.join(binDir, 'kandi');
    
    if (fs.existsSync(localBinary)) {
      console.log('Using local development binary as fallback...');
      if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir, { recursive: true });
      }
      fs.copyFileSync(localBinary, targetBinary);
      fs.chmodSync(targetBinary, 0o755);
      console.log('✅ Installed local development binary');
    } else {
      process.exit(1);
    }
  }
}

// Run installation
install();