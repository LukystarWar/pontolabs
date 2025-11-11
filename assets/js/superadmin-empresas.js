// ============================================
// SUPERADMIN - EMPRESAS (CRUD COMPLETO)
// ============================================

let currentUser = null;
let empresas = [];
let currentEmpresaId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Verifica autenticação
    currentUser = await getCurrentUser();
    if (!currentUser) {
      window.location.href = '/pages/login.html';
      return;
    }

    // Verifica se é superadmin
    const profile = await getUserProfile();
    if (profile.role !== 'superadmin') {
      alert('Acesso negado! Apenas SuperAdmins podem acessar esta página.');
      window.location.href = '/pages/login.html';
      return;
    }

    // Carrega informações do usuário
    await loadUserInfo();

    // Carrega empresas
    await loadEmpresas();

    // Setup dos filtros
    setupFilters();

    // Setup do formulário
    setupForm();

  } catch (error) {
    console.error('Erro na inicialização:', error);
    alert('Erro ao carregar página: ' + error.message);
  }
});

// Carrega todas as empresas
async function loadEmpresas() {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    empresas = data || [];
    renderEmpresas(empresas);

  } catch (error) {
    console.error('Erro ao carregar empresas:', error);
    document.getElementById('empresas-tbody').innerHTML =
      '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: red;">Erro ao carregar empresas</td></tr>';
  }
}

// Renderiza tabela de empresas
async function renderEmpresas(data) {
  const tbody = document.getElementById('empresas-tbody');

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Nenhuma empresa encontrada</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  for (const empresa of data) {
    // Conta funcionários e terminais
    const { count: funcionarios } = await supabase
      .from('funcionarios')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresa.id);

    const { count: terminais } = await supabase
      .from('terminais')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresa.id);

    const row = `
      <tr>
        <td><strong>${empresa.nome}</strong></td>
        <td><span class="badge badge-${empresa.plano}">${empresa.plano.toUpperCase()}</span></td>
        <td><span class="badge ${empresa.ativa ? 'badge-success' : 'badge-danger'}">${empresa.ativa ? 'Ativa' : 'Inativa'}</span></td>
        <td>
          <span title="Funcionários: ${funcionarios || 0} / ${empresa.limite_funcionarios}">
            👨‍💼 ${funcionarios || 0} / ${empresa.limite_funcionarios}
          </span>
          <br>
          <span title="Terminais: ${terminais || 0} / ${empresa.limite_terminais}">
            🖥️ ${terminais || 0} / ${empresa.limite_terminais}
          </span>
        </td>
        <td>${formatDate(empresa.data_inicio)}</td>
        <td>${formatDate(empresa.data_expiracao)}</td>
        <td>
          <button onclick="viewEmpresa('${empresa.id}')" class="btn btn-sm" title="Ver Detalhes">👁️</button>
          <button onclick="editEmpresa('${empresa.id}')" class="btn btn-sm" title="Editar">✏️</button>
          <button onclick="deleteEmpresa('${empresa.id}', '${empresa.nome}')" class="btn btn-sm btn-danger" title="Excluir">🗑️</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  }
}

// Setup dos filtros
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  const planoFilter = document.getElementById('plano-filter');

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  planoFilter.addEventListener('change', applyFilters);
}

// Aplica filtros
function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const statusFilter = document.getElementById('status-filter').value;
  const planoFilter = document.getElementById('plano-filter').value;

  let filtered = empresas;

  // Filtro de busca
  if (searchTerm) {
    filtered = filtered.filter(e => e.nome.toLowerCase().includes(searchTerm));
  }

  // Filtro de status
  if (statusFilter !== 'all') {
    const ativa = statusFilter === 'ativa';
    filtered = filtered.filter(e => e.ativa === ativa);
  }

  // Filtro de plano
  if (planoFilter !== 'all') {
    filtered = filtered.filter(e => e.plano === planoFilter);
  }

  renderEmpresas(filtered);
}

// Abre modal para criar nova empresa
function openEmpresaModal() {
  currentEmpresaId = null;
  document.getElementById('modal-title').textContent = 'Nova Empresa';
  document.getElementById('empresa-form').reset();

  // Define data de início como hoje
  document.getElementById('empresa-data-inicio').valueAsDate = new Date();

  // Define data de expiração como daqui 1 ano
  const expiracao = new Date();
  expiracao.setFullYear(expiracao.getFullYear() + 1);
  document.getElementById('empresa-data-expiracao').valueAsDate = expiracao;

  document.getElementById('empresa-modal').style.display = 'flex';
}

// Fecha modal
function closeEmpresaModal() {
  document.getElementById('empresa-modal').style.display = 'none';
  currentEmpresaId = null;
}

// Edita empresa
async function editEmpresa(id) {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    currentEmpresaId = id;
    document.getElementById('modal-title').textContent = 'Editar Empresa';
    document.getElementById('empresa-id').value = data.id;
    document.getElementById('empresa-nome').value = data.nome;
    document.getElementById('empresa-plano').value = data.plano;
    document.getElementById('empresa-status').value = data.ativa.toString();
    document.getElementById('empresa-limite-funcionarios').value = data.limite_funcionarios;
    document.getElementById('empresa-limite-terminais').value = data.limite_terminais;
    document.getElementById('empresa-data-inicio').valueAsDate = data.data_inicio ? new Date(data.data_inicio) : null;
    document.getElementById('empresa-data-expiracao').valueAsDate = data.data_expiracao ? new Date(data.data_expiracao) : null;

    document.getElementById('empresa-modal').style.display = 'flex';

  } catch (error) {
    console.error('Erro ao carregar empresa:', error);
    alert('Erro ao carregar empresa: ' + error.message);
  }
}

// Setup do formulário
function setupForm() {
  const form = document.getElementById('empresa-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveEmpresa();
  });

  // Atualiza limites baseado no plano
  document.getElementById('empresa-plano').addEventListener('change', (e) => {
    const plano = e.target.value;
    const limiteFunc = document.getElementById('empresa-limite-funcionarios');
    const limiteTerm = document.getElementById('empresa-limite-terminais');

    switch (plano) {
      case 'free':
        limiteFunc.value = 10;
        limiteTerm.value = 2;
        break;
      case 'basic':
        limiteFunc.value = 50;
        limiteTerm.value = 5;
        break;
      case 'premium':
        limiteFunc.value = 999999;
        limiteTerm.value = 999999;
        break;
    }
  });
}

// Salva empresa (criar ou editar)
async function saveEmpresa() {
  const saveBtn = document.getElementById('save-btn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Salvando...';

  try {
    const empresaData = {
      nome: document.getElementById('empresa-nome').value,
      plano: document.getElementById('empresa-plano').value,
      ativa: document.getElementById('empresa-status').value === 'true',
      limite_funcionarios: parseInt(document.getElementById('empresa-limite-funcionarios').value),
      limite_terminais: parseInt(document.getElementById('empresa-limite-terminais').value),
      data_inicio: document.getElementById('empresa-data-inicio').value,
      data_expiracao: document.getElementById('empresa-data-expiracao').value
    };

    let result;
    if (currentEmpresaId) {
      // Atualizar
      result = await supabase
        .from('empresas')
        .update(empresaData)
        .eq('id', currentEmpresaId);
    } else {
      // Criar
      result = await supabase
        .from('empresas')
        .insert([empresaData]);
    }

    if (result.error) throw result.error;

    alert(currentEmpresaId ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!');
    closeEmpresaModal();
    await loadEmpresas();

  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    alert('Erro ao salvar empresa: ' + error.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar';
  }
}

// Exclui empresa
async function deleteEmpresa(id, nome) {
  if (!confirm(`Tem certeza que deseja excluir a empresa "${nome}"?\n\nISSO IRÁ EXCLUIR TODOS OS DADOS RELACIONADOS (usuários, funcionários, terminais e pontos)!`)) {
    return;
  }

  try {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    alert('Empresa excluída com sucesso!');
    await loadEmpresas();

  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    alert('Erro ao excluir empresa: ' + error.message);
  }
}

// Ver detalhes da empresa
async function viewEmpresa(id) {
  try {
    const { data: empresa, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    currentEmpresaId = id;
    document.getElementById('detail-empresa-nome').textContent = empresa.nome;
    document.getElementById('empresa-detail-modal').style.display = 'flex';

    // Carrega dados das abas
    await loadUsuariosTab(id);

  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    alert('Erro ao carregar detalhes: ' + error.message);
  }
}

// Fecha modal de detalhes
function closeDetailModal() {
  document.getElementById('empresa-detail-modal').style.display = 'none';
  currentEmpresaId = null;
}

// Troca de aba
function switchTab(tabName) {
  // Remove active de todos
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Adiciona active no selecionado
  event.target.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');

  // Carrega dados da aba
  if (tabName === 'usuarios') loadUsuariosTab(currentEmpresaId);
  if (tabName === 'funcionarios') loadFuncionariosTab(currentEmpresaId);
  if (tabName === 'terminais') loadTerminaisTab(currentEmpresaId);
  if (tabName === 'pontos') loadPontosTab(currentEmpresaId);
}

// Carrega usuários da empresa
async function loadUsuariosTab(empresaId) {
  const container = document.getElementById('usuarios-list');
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Carregando...</p>';

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Nenhum usuário nesta empresa</p>';
      return;
    }

    const html = `
      <table style="width: 100%">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(u => `
            <tr>
              <td>${u.nome}</td>
              <td>${u.email}</td>
              <td><span class="badge badge-${u.role}">${u.role}</span></td>
              <td>${formatDateTime(u.criado_em)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;

  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;">Erro ao carregar usuários</p>';
  }
}

// Carrega funcionários da empresa
async function loadFuncionariosTab(empresaId) {
  const container = document.getElementById('funcionarios-list');
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Carregando...</p>';

  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Nenhum funcionário cadastrado</p>';
      return;
    }

    const html = `
      <table style="width: 100%">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Turno</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(f => `
            <tr>
              <td>${f.nome}</td>
              <td>${f.cargo || '-'}</td>
              <td>${f.turno || '-'}</td>
              <td><span class="badge ${f.ativo ? 'badge-success' : 'badge-danger'}">${f.ativo ? 'Ativo' : 'Inativo'}</span></td>
              <td>${formatDateTime(f.criado_em)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;

  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;">Erro ao carregar funcionários</p>';
  }
}

// Carrega terminais da empresa
async function loadTerminaisTab(empresaId) {
  const container = document.getElementById('terminais-list');
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Carregando...</p>';

  try {
    const { data, error } = await supabase
      .from('terminais')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Nenhum terminal cadastrado</p>';
      return;
    }

    const html = `
      <table style="width: 100%">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Localização</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(t => `
            <tr>
              <td>${t.nome}</td>
              <td>${t.localizacao || '-'}</td>
              <td><span class="badge ${t.ativo ? 'badge-success' : 'badge-danger'}">${t.ativo ? 'Ativo' : 'Inativo'}</span></td>
              <td>${formatDateTime(t.criado_em)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;

  } catch (error) {
    console.error('Erro ao carregar terminais:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;">Erro ao carregar terminais</p>';
  }
}

// Carrega pontos da empresa
async function loadPontosTab(empresaId) {
  const container = document.getElementById('pontos-list');
  container.innerHTML = '<p style="text-align: center; padding: 2rem;">Carregando...</p>';

  try {
    const { data, error } = await supabase
      .from('pontos')
      .select(`
        *,
        funcionarios (nome)
      `)
      .eq('empresa_id', empresaId)
      .order('data_hora', { ascending: false })
      .limit(100);

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Nenhum registro de ponto</p>';
      return;
    }

    const html = `
      <table style="width: 100%">
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>Tipo</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(p => `
            <tr>
              <td>${p.funcionarios?.nome || '-'}</td>
              <td>
                <span class="badge ${p.tipo === 'entrada' ? 'badge-success' : 'badge-danger'}">
                  ${p.tipo === 'entrada' ? '🟢 Entrada' : '🔴 Saída'}
                </span>
              </td>
              <td>${formatDateTime(p.data_hora)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;

  } catch (error) {
    console.error('Erro ao carregar pontos:', error);
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;">Erro ao carregar pontos</p>';
  }
}

// Adicionar usuário - Abre modal de criar admin
function addUsuario() {
  openCreateAdminModal();
}

// Formata data
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Formata data e hora
function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

// ============================================
// CRIAR ADMIN
// ============================================

let createdCredentials = null;

// Abre modal de criar admin
function openCreateAdminModal() {
  if (!checkServiceKeyConfigured()) {
    alert('⚠️ Service Role Key não configurada!\n\nPara criar admins automaticamente, você precisa:\n\n1. Acessar: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/settings/api\n2. Copiar a "service_role" key\n3. Colar em: assets/js/superadmin-config.js\n4. Recarregar a página\n\nPor enquanto, você pode criar manualmente via Supabase Auth.');
    return;
  }

  if (!currentEmpresaId) {
    alert('Selecione uma empresa primeiro');
    return;
  }

  document.getElementById('criar-admin-form').reset();
  document.getElementById('criar-admin-modal').style.display = 'flex';
}

// Fecha modal de criar admin
function closeCreateAdminModal() {
  document.getElementById('criar-admin-modal').style.display = 'none';
  document.getElementById('criar-admin-form').reset();
}

// Setup do formulário de criar admin
document.getElementById('criar-admin-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await handleCreateAdmin();
});

// Criar admin
async function handleCreateAdmin() {
  const nome = document.getElementById('admin-nome').value;
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const passwordConfirm = document.getElementById('admin-password-confirm').value;

  // Validar senhas
  if (password !== passwordConfirm) {
    alert('As senhas não conferem!');
    return;
  }

  if (password.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres');
    return;
  }

  const btn = document.getElementById('criar-admin-btn');
  btn.disabled = true;
  btn.textContent = 'Criando...';

  try {
    // Criar admin usando a função do superadmin-config.js
    const result = await createAdminUser(currentEmpresaId, nome, email, password);

    // Salvar credenciais
    createdCredentials = result.credentials;

    // Fechar modal de criação
    closeCreateAdminModal();

    // Mostrar modal de credenciais
    showCredenciais(result.credentials);

    // Recarregar aba de usuários
    await loadUsuariosTab(currentEmpresaId);

    alert('✅ Admin criado com sucesso!');

  } catch (error) {
    console.error('Erro ao criar admin:', error);
    let errorMessage = 'Erro ao criar admin: ';

    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      errorMessage += 'Este email já está em uso!';
    } else if (error.message.includes('invalid email')) {
      errorMessage += 'Email inválido!';
    } else {
      errorMessage += error.message || 'Erro desconhecido';
    }

    alert(errorMessage);

  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar Admin';
  }
}

// Mostrar modal com credenciais
function showCredenciais(credentials) {
  const loginUrl = window.location.origin + '/pages/login.html';

  document.getElementById('credencial-email').textContent = credentials.email;
  document.getElementById('credencial-password').textContent = credentials.password;
  document.getElementById('credencial-url').textContent = loginUrl;

  document.getElementById('credenciais-modal').style.display = 'flex';
}

// Fechar modal de credenciais
function closeCredenciaisModal() {
  document.getElementById('credenciais-modal').style.display = 'none';
  createdCredentials = null;
}

// Copiar credenciais
function copyCredentials() {
  if (!createdCredentials) return;

  const loginUrl = window.location.origin + '/pages/login.html';

  const text = `
==============================================
CREDENCIAIS DE ACESSO - PONTOLABS
==============================================

Email: ${createdCredentials.email}
Senha: ${createdCredentials.password}

URL de Login: ${loginUrl}

==============================================
Guarde estas informações em local seguro!
==============================================
  `.trim();

  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Credenciais copiadas para a área de transferência!');
  }).catch(err => {
    console.error('Erro ao copiar:', err);
    alert('Erro ao copiar credenciais. Copie manualmente.');
  });
}

// Fecha modal ao clicar fora
window.onclick = function(event) {
  const empresaModal = document.getElementById('empresa-modal');
  const detailModal = document.getElementById('empresa-detail-modal');
  const criarAdminModal = document.getElementById('criar-admin-modal');
  const credenciaisModal = document.getElementById('credenciais-modal');

  if (event.target === empresaModal) {
    closeEmpresaModal();
  }
  if (event.target === detailModal) {
    closeDetailModal();
  }
  if (event.target === criarAdminModal) {
    closeCreateAdminModal();
  }
  if (event.target === credenciaisModal) {
    closeCredenciaisModal();
  }
}
