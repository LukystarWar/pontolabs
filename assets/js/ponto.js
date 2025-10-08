// ============================================
// PONTOLABS - REGISTRO DE PONTO
// ============================================

async function registrarPontoLocal(dados) {
  try {
    // Envia para o servidor (Netlify Function)
    const response = await fetch('/.netlify/functions/register-ponto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao registrar ponto');
    }

    return result;

  } catch (error) {
    console.error('Erro ao registrar ponto:', error);

    // Se estiver offline, salva no IndexedDB
    if (!navigator.onLine) {
      await salvarPontoOffline(dados);
      throw new Error('Ponto salvo offline. Será sincronizado quando houver conexão.');
    }

    throw error;
  }
}

async function salvarPontoOffline(dados) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pontolabs-offline', 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pontos'], 'readwrite');
      const store = transaction.objectStore('pontos');

      const pontoOffline = {
        ...dados,
        timestamp: Date.now(),
        synced: false
      };

      store.add(pontoOffline);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pontos')) {
        db.createObjectStore('pontos', { keyPath: 'timestamp' });
      }
    };
  });
}

async function sincronizarPontosOffline() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pontolabs-offline', 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = async () => {
      const db = request.result;
      const transaction = db.transaction(['pontos'], 'readonly');
      const store = transaction.objectStore('pontos');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async () => {
        const pontos = getAllRequest.result.filter(p => !p.synced);

        for (const ponto of pontos) {
          try {
            await registrarPontoLocal(ponto);
            // Marca como sincronizado
            const txUpdate = db.transaction(['pontos'], 'readwrite');
            const storeUpdate = txUpdate.objectStore('pontos');
            ponto.synced = true;
            storeUpdate.put(ponto);
          } catch (error) {
            console.error('Erro ao sincronizar ponto:', error);
          }
        }

        resolve(pontos.length);
      };
    };
  });
}

// Sincroniza automaticamente quando ficar online
window.addEventListener('online', async () => {
  console.log('Conexão restabelecida. Sincronizando pontos...');
  try {
    const count = await sincronizarPontosOffline();
    if (count > 0) {
      alert(`${count} ponto(s) sincronizado(s) com sucesso!`);
    }
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
  }
});

// Pega IP do cliente
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return null;
  }
}

// Gera hash do registro
async function generateHash(data) {
  const str = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
