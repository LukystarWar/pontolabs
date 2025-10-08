// ============================================
// PONTOLABS - QR CODE READER
// ============================================

class QRReader {
  constructor() {
    this.html5QrCode = null;
    this.isScanning = false;
    this.onScanSuccess = null;
  }

  async init(elementId, onSuccess) {
    this.onScanSuccess = onSuccess;
    this.html5QrCode = new Html5Qrcode(elementId);
  }

  async start() {
    if (this.isScanning) {
      console.log('Scanner já está ativo');
      return;
    }

    try {
      const cameras = await Html5Qrcode.getCameras();

      if (cameras && cameras.length > 0) {
        // Preferir câmera traseira (environment)
        const cameraId = cameras.find(c => c.label.toLowerCase().includes('back'))?.id || cameras[0].id;

        await this.html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText, decodedResult) => {
            this.handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignora erros de leitura contínua
          }
        );

        this.isScanning = true;
        console.log('Scanner iniciado com sucesso');
      } else {
        throw new Error('Nenhuma câmera encontrada');
      }
    } catch (error) {
      console.error('Erro ao iniciar scanner:', error);
      throw error;
    }
  }

  async stop() {
    if (!this.isScanning) {
      return;
    }

    try {
      await this.html5QrCode.stop();
      this.isScanning = false;
      console.log('Scanner parado');
    } catch (error) {
      console.error('Erro ao parar scanner:', error);
    }
  }

  handleScanSuccess(decodedText) {
    // Para o scanner temporariamente para evitar múltiplas leituras
    this.stop();

    if (this.onScanSuccess) {
      this.onScanSuccess(decodedText);
    }

    // Reinicia após 2 segundos
    setTimeout(() => {
      if (!this.isScanning) {
        this.start();
      }
    }, 2000);
  }

  getIsScanning() {
    return this.isScanning;
  }
}

// Export para uso global
window.QRReader = QRReader;
