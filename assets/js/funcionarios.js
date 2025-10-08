// ============================================
// PONTOLABS - GESTÃO DE FUNCIONÁRIOS
// ============================================

let empresaId = null;
let funcionarios = [];
let funcionarioEditando = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const profile = await loadUserInfo();

    if (profile.role !== 'admin' && profile.role !== 'superadmin') {
      alert('Acesso negado.');
      window.location.href = '/pages/login.html';
      return;
    }

    empresaId = profile.empresa_id;
    await carregarFuncionarios();

    // Event listeners
    document.getElementById('btn-novo-funcionario').addEventListener('click', abrirModalNovo);
    document.getElementById('modal-close').addEventListener('click', fecharModal);
    document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
    document.getElementById('form-funcionario').addEventListener('submit', salvarFuncionario);
    document.getElementById('search-funcionarios').addEventListener('input', filtrarFuncionarios);

  } catch (error) {
    console.error('Erro ao inicializar página:', error);
    showAlert('Erro ao carregar página', 'error');
  }
});

async function carregarFuncionarios() {
  try {
    funcionarios = await getFuncionarios(empresaId);
    renderFuncionarios(funcionarios);
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
    showAlert('Erro ao carregar funcionários', 'error');
  }
}

function renderFuncionarios(lista) {
  const tbody = document.getElementById('funcionarios-list');

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Nenhum funcionário cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(f => `
    <tr>
      <td>${f.nome}</td>
      <td>${f.cargo || '-'}</td>
      <td>${f.turno || '-'}</td>
      <td><span class="badge badge-${f.ativo ? 'success' : 'danger'}">${f.ativo ? 'Ativo' : 'Inativo'}</span></td>
      <td>
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm" onclick="editarFuncionario('${f.id}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirFuncionario('${f.id}', '${f.nome}')">🗑️ Excluir</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filtrarFuncionarios() {
  const busca = document.getElementById('search-funcionarios').value.toLowerCase();
  const filtrados = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(busca) ||
    (f.cargo && f.cargo.toLowerCase().includes(busca))
  );
  renderFuncionarios(filtrados);
}

function abrirModalNovo() {
  funcionarioEditando = null;
  document.getElementById('modal-title').textContent = 'Novo Funcionário';
  document.getElementById('form-funcionario').reset();
  document.getElementById('func-ativo').checked = true;
  document.getElementById('modal-funcionario').classList.remove('hidden');
}

function editarFuncionario(id) {
  funcionarioEditando = funcionarios.find(f => f.id === id);
  if (!funcionarioEditando) return;

  document.getElementById('modal-title').textContent = 'Editar Funcionário';
  document.getElementById('func-nome').value = funcionarioEditando.nome;
  document.getElementById('func-cargo').value = funcionarioEditando.cargo || '';
  document.getElementById('func-turno').value = funcionarioEditando.turno || '';
  document.getElementById('func-ativo').checked = funcionarioEditando.ativo;
  document.getElementById('modal-funcionario').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modal-funcionario').classList.add('hidden');
  funcionarioEditando = null;
}

async function salvarFuncionario(e) {
  e.preventDefault();

  const btnSalvar = document.getElementById('btn-salvar');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    const dados = {
      empresa_id: empresaId,
      nome: document.getElementById('func-nome').value,
      cargo: document.getElementById('func-cargo').value || null,
      turno: document.getElementById('func-turno').value || null,
      ativo: document.getElementById('func-ativo').checked
    };

    if (funcionarioEditando) {
      await updateFuncionario(funcionarioEditando.id, dados);
      showAlert('Funcionário atualizado com sucesso!', 'success');
    } else {
      await createFuncionario(dados);
      showAlert('Funcionário cadastrado com sucesso!', 'success');
    }

    fecharModal();
    await carregarFuncionarios();

  } catch (error) {
    console.error('Erro ao salvar funcionário:', error);
    showAlert('Erro ao salvar funcionário: ' + error.message, 'error');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
  }
}

async function excluirFuncionario(id, nome) {
  if (!confirm(`Deseja realmente excluir o funcionário "${nome}"?`)) {
    return;
  }

  try {
    await deleteFuncionario(id);
    showAlert('Funcionário excluído com sucesso!', 'success');
    await carregarFuncionarios();
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    showAlert('Erro ao excluir funcionário: ' + error.message, 'error');
  }
}
