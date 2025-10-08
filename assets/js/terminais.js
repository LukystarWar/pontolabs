// ============================================
// PONTOLABS - GESTÃO DE TERMINAIS
// ============================================

let empresaId = null;
let terminais = [];
let terminalEditando = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const profile = await loadUserInfo();

    if (profile.role !== 'admin' && profile.role !== 'superadmin') {
      alert('Acesso negado.');
      window.location.href = '/pages/login.html';
      return;
    }

    empresaId = profile.empresa_id;
    await carregarTerminais();

    // Event listeners
    document.getElementById('btn-novo-terminal').addEventListener('click', abrirModalNovo);
    document.getElementById('modal-close').addEventListener('click', fecharModal);
    document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
    document.getElementById('form-terminal').addEventListener('submit', salvarTerminal);
    document.getElementById('search-terminais').addEventListener('input', filtrarTerminais);

  } catch (error) {
    console.error('Erro ao inicializar página:', error);
    showAlert('Erro ao carregar página', 'error');
  }
});

async function carregarTerminais() {
  try {
    terminais = await getTerminais(empresaId);
    renderTerminais(terminais);
  } catch (error) {
    console.error('Erro ao carregar terminais:', error);
    showAlert('Erro ao carregar terminais', 'error');
  }
}

function renderTerminais(lista) {
  const tbody = document.getElementById('terminais-list');

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Nenhum terminal cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(t => `
    <tr>
      <td>${t.nome}</td>
      <td>${t.localizacao || '-'}</td>
      <td><span class="badge badge-${t.ativo ? 'success' : 'danger'}">${t.ativo ? 'Ativo' : 'Inativo'}</span></td>
      <td>
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm" onclick="editarTerminal('${t.id}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirTerminal('${t.id}', '${t.nome}')">🗑️ Excluir</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filtrarTerminais() {
  const busca = document.getElementById('search-terminais').value.toLowerCase();
  const filtrados = terminais.filter(t =>
    t.nome.toLowerCase().includes(busca) ||
    (t.localizacao && t.localizacao.toLowerCase().includes(busca))
  );
  renderTerminais(filtrados);
}

function abrirModalNovo() {
  terminalEditando = null;
  document.getElementById('modal-title').textContent = 'Novo Terminal';
  document.getElementById('form-terminal').reset();
  document.getElementById('term-ativo').checked = true;
  document.getElementById('modal-terminal').classList.remove('hidden');
}

function editarTerminal(id) {
  terminalEditando = terminais.find(t => t.id === id);
  if (!terminalEditando) return;

  document.getElementById('modal-title').textContent = 'Editar Terminal';
  document.getElementById('term-nome').value = terminalEditando.nome;
  document.getElementById('term-localizacao').value = terminalEditando.localizacao || '';
  document.getElementById('term-ativo').checked = terminalEditando.ativo;
  document.getElementById('modal-terminal').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modal-terminal').classList.add('hidden');
  terminalEditando = null;
}

function gerarChaveSecreta() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function salvarTerminal(e) {
  e.preventDefault();

  const btnSalvar = document.getElementById('btn-salvar');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    const dados = {
      empresa_id: empresaId,
      nome: document.getElementById('term-nome').value,
      localizacao: document.getElementById('term-localizacao').value || null,
      ativo: document.getElementById('term-ativo').checked
    };

    if (terminalEditando) {
      await updateTerminal(terminalEditando.id, dados);
      showAlert('Terminal atualizado com sucesso!', 'success');
    } else {
      // Gera chave secreta para novo terminal
      dados.chave_secreta = gerarChaveSecreta();
      await createTerminal(dados);
      showAlert('Terminal cadastrado com sucesso!', 'success');
    }

    fecharModal();
    await carregarTerminais();

  } catch (error) {
    console.error('Erro ao salvar terminal:', error);
    showAlert('Erro ao salvar terminal: ' + error.message, 'error');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
  }
}

async function excluirTerminal(id, nome) {
  if (!confirm(`Deseja realmente excluir o terminal "${nome}"?`)) {
    return;
  }

  try {
    await deleteTerminal(id);
    showAlert('Terminal excluído com sucesso!', 'success');
    await carregarTerminais();
  } catch (error) {
    console.error('Erro ao excluir terminal:', error);
    showAlert('Erro ao excluir terminal: ' + error.message, 'error');
  }
}
