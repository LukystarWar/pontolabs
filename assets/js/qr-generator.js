// ============================================
// PONTOLABS - QR CODE GENERATOR (WEB CRYPTO API)
// ============================================

class QRGenerator {
  constructor(terminalId, empresaId, secret) {
    this.terminalId = terminalId;
    this.empresaId = empresaId;
    this.secret = secret;
    this.qrElement = null;
    this.countdownElement = null;
    this.currentToken = null;
  }

  async init(qrElementId, countdownElementId) {
    this.qrElement = document.getElementById(qrElementId);
    this.countdownElement = document.getElementById(countdownElementId);

    if (!this.qrElement) {
      throw new Error('Elemento QR não encontrado');
    }

    await this.generateAndDisplay();
    this.startAutoRefresh();
  }

  async generateToken() {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + APP_CONFIG.qr.expirationSeconds;
    const nonce = this.generateNonce();

    const payload = {
      empresa_id: this.empresaId,
      terminal_id: this.terminalId,
      nonce: nonce,
      iat: now,
      exp: exp
    };

    // Cria JWT manualmente com Web Crypto API
    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedPayload = this.base64urlEncode(JSON.stringify(payload));

    const signature = await this.sign(`${encodedHeader}.${encodedPayload}`, this.secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async sign(message, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );

    return this.base64urlEncode(signature);
  }

  base64urlEncode(data) {
    let base64;

    if (typeof data === 'string') {
      base64 = btoa(unescape(encodeURIComponent(data)));
    } else {
      // ArrayBuffer
      const bytes = new Uint8Array(data);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = btoa(binary);
    }

    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  generateNonce() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  async generateAndDisplay() {
    try {
      this.currentToken = await this.generateToken();

      // Gera QR Code usando QRCode.js
      this.qrElement.innerHTML = '';
      const qr = new QRCode(this.qrElement, {
        text: this.currentToken,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });

      this.startCountdown();
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      this.qrElement.innerHTML = '<p style="color: red;">Erro ao gerar QR Code</p>';
    }
  }

  startCountdown() {
    let secondsLeft = APP_CONFIG.qr.expirationSeconds;

    const interval = setInterval(() => {
      secondsLeft--;

      if (this.countdownElement) {
        this.countdownElement.textContent = `Expira em ${secondsLeft}s`;
      }

      if (secondsLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  startAutoRefresh() {
    setInterval(() => {
      this.generateAndDisplay();
    }, APP_CONFIG.qr.refreshInterval);
  }

  getToken() {
    return this.currentToken;
  }
}

// Export para uso global
window.QRGenerator = QRGenerator;
