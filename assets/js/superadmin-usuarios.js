// ============================================
// SUPERADMIN - USUÁRIOS
// ============================================

let currentUser = null;
let usuarios = [];
let empresasMap = {};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  try {
    currentUser = await getCurrentUser();
    if (!currentUser) {
      window.location.href = '/pages/login.html';
      return;
    }

    const profile = await getUserProfile();
    if (profile.role !== 'superadmin') {
      alert('Acesso negado!');
      window.location.href = '/pages/login.html';
      return;
    }

    await loadUserInfo();
    await loadEmpresas();
    await loadUsuarios();
    setupFilters();

  } catch (error) {
    console.error('Erro na inicialização:', error);
    alert('Erro ao carregar página: ' + error.message);
  }
});

// Carrega empresas para o filtro
async function loadEmpresas() {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id, nome')
      .order('nome');

    if (error) throw error;

    const select = document.getElementById('empresa-filter');
    data.forEach(empresa => {
      empresasMap[empresa.id] = empresa.nome;
      const option = document.createElement('option');
      option.value = empresa.id;
      option.textContent = empresa.nome;
      select.appendChild(option);
    });

  } catch (error) {
    console.error('Erro ao carregar empresas:', error);
  }
}

// Carrega todos os usuários
async function loadUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        empresas (nome)
      `)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    usuarios = data || [];
    updateStats();
    renderUsuarios(usuarios);

  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    document.getElementById('usuarios-tbody').innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: red;">Erro ao carregar usuários</td></tr>';
  }
}

// Atualiza estatísticas
function updateStats() {
  const counts = {
    superadmin: 0,
    admin: 0,
    funcionario: 0,
    terminal: 0
  };

  usuarios.forEach(u => {
    if (counts[u.role] !== undefined) {
      counts[u.role]++;
    }
  });

  document.getElementById('count-superadmin').textContent = counts.superadmin;
  document.getElementById('count-admin').textContent = counts.admin;
  document.getElementById('count-funcionario').textContent = counts.funcionario;
  document.getElementById('count-terminal').textContent = counts.terminal;
}

// Renderiza tabela
function renderUsuarios(data) {
  const tbody = document.getElementById('usuarios-tbody');

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Nenhum usuário encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(u => `
    <tr>
      <td><strong>${u.nome}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge badge-${u.role}">${u.role}</span></td>
      <td>${u.empresas?.nome || '-'}</td>
      <td>${formatDateTime(u.criado_em)}</td>
      <td>
        <button onclick="viewUsuario('${u.id}')" class="btn btn-sm" title="Ver Detalhes">👁️</button>
      </td>
    </tr>
  `).join('');
}

// Setup dos filtros
function setupFilters() {
  document.getElementById('search-input').addEventListener('input', applyFilters);
  document.getElementById('role-filter').addEventListener('change', applyFilters);
  document.getElementById('empresa-filter').addEventListener('change', applyFilters);
}

// Aplica filtros
function applyFilters() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const role = document.getElementById('role-filter').value;
  const empresa = document.getElementById('empresa-filter').value;

  let filtered = usuarios;

  if (search) {
    filtered = filtered.filter(u =>
      u.nome.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }

  if (role !== 'all') {
    filtered = filtered.filter(u => u.role === role);
  }

  if (empresa !== 'all') {
    filtered = filtered.filter(u => u.empresa_id === empresa);
  }

  renderUsuarios(filtered);
}

// Ver detalhes do usuário
async function viewUsuario(id) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        empresas (nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    document.getElementById('modal-usuario-nome').textContent = data.nome;
    document.getElementById('detail-id').textContent = data.id;
    document.getElementById('detail-email').textContent = data.email;
    document.getElementById('detail-role').textContent = data.role;
    document.getElementById('detail-empresa').textContent = data.empresas?.nome || '-';
    document.getElementById('detail-criado').textContent = formatDateTime(data.criado_em);

    window.currentUsuarioId = id;
    window.currentEmpresaId = data.empresa_id;

    document.getElementById('usuario-modal').style.display = 'flex';

  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    alert('Erro ao carregar usuário: ' + error.message);
  }
}

// Fecha modal
function closeUsuarioModal() {
  document.getElementById('usuario-modal').style.display = 'none';
}

// Ver empresa
function viewEmpresa() {
  if (window.currentEmpresaId) {
    window.location.href = `/pages/superadmin/empresas.html?id=${window.currentEmpresaId}`;
  }
}

// Excluir usuário
async function deleteUsuario() {
  if (!confirm('Tem certeza que deseja excluir este usuário?\n\nEsta ação não pode ser desfeita!')) {
    return;
  }

  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', window.currentUsuarioId);

    if (error) throw error;

    alert('Usuário excluído com sucesso!');
    closeUsuarioModal();
    await loadUsuarios();

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    alert('Erro ao excluir usuário: ' + error.message);
  }
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR');
}

// Fecha modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById('usuario-modal');
  if (event.target === modal) {
    closeUsuarioModal();
  }
}
