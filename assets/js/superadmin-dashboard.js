// ============================================
// SUPERADMIN - DASHBOARD
// ============================================

let currentUser = null;

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

    // Carrega estatísticas
    await loadStats();

    // Carrega empresas recentes
    await loadEmpresasRecentes();

    // Carrega atividade recente
    await loadAtividades();

  } catch (error) {
    console.error('Erro na inicialização:', error);
    alert('Erro ao carregar dashboard: ' + error.message);
  }
});

// Carrega estatísticas gerais
async function loadStats() {
  try {
    // Total de empresas ativas
    const { count: totalEmpresas } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true })
      .eq('ativa', true);

    // Total de usuários
    const { count: totalUsuarios } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    // Total de funcionários
    const { count: totalFuncionarios } = await supabase
      .from('funcionarios')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    // Total de terminais
    const { count: totalTerminais } = await supabase
      .from('terminais')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true);

    // Pontos registrados hoje
    const hoje = new Date().toISOString().split('T')[0];
    const { count: pontosHoje } = await supabase
      .from('pontos')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', `${hoje}T00:00:00`)
      .lte('data_hora', `${hoje}T23:59:59`);

    // Pontos no mês
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const { count: pontosMes } = await supabase
      .from('pontos')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', inicioMes.toISOString());

    // Atualiza cards
    document.getElementById('total-empresas').textContent = totalEmpresas || 0;
    document.getElementById('total-usuarios').textContent = totalUsuarios || 0;
    document.getElementById('total-funcionarios').textContent = totalFuncionarios || 0;
    document.getElementById('total-terminais').textContent = totalTerminais || 0;
    document.getElementById('total-pontos-hoje').textContent = pontosHoje || 0;
    document.getElementById('total-pontos-mes').textContent = pontosMes || 0;

  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

// Carrega empresas recentes
async function loadEmpresasRecentes() {
  try {
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(10);

    if (error) throw error;

    const tbody = document.getElementById('empresas-tbody');

    if (!empresas || empresas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Nenhuma empresa cadastrada</td></tr>';
      return;
    }

    // Conta funcionários e terminais de cada empresa
    tbody.innerHTML = '';
    for (const empresa of empresas) {
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
          <td>${funcionarios || 0}</td>
          <td>${terminais || 0}</td>
          <td>${formatDate(empresa.data_inicio)}</td>
          <td>
            <a href="/pages/superadmin/empresas.html?id=${empresa.id}" class="btn btn-sm">Ver Detalhes</a>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    }

  } catch (error) {
    console.error('Erro ao carregar empresas:', error);
    document.getElementById('empresas-tbody').innerHTML =
      '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: red;">Erro ao carregar empresas</td></tr>';
  }
}

// Carrega atividades recentes
async function loadAtividades() {
  try {
    // Busca pontos recentes
    const { data: pontos, error } = await supabase
      .from('pontos')
      .select(`
        *,
        funcionarios (nome),
        empresas (nome)
      `)
      .order('criado_em', { ascending: false })
      .limit(20);

    if (error) throw error;

    const activityList = document.getElementById('activity-list');

    if (!pontos || pontos.length === 0) {
      activityList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Nenhuma atividade recente</p>';
      return;
    }

    activityList.innerHTML = pontos.map(ponto => `
      <div class="activity-item">
        <div class="activity-icon ${ponto.tipo === 'entrada' ? 'entrada' : 'saida'}">
          ${ponto.tipo === 'entrada' ? '🟢' : '🔴'}
        </div>
        <div class="activity-content">
          <div class="activity-title">
            <strong>${ponto.funcionarios?.nome || 'Funcionário desconhecido'}</strong>
            <span class="activity-type">${ponto.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
          </div>
          <div class="activity-meta">
            ${ponto.empresas?.nome || 'Empresa'} • ${formatDateTime(ponto.data_hora)}
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    document.getElementById('activity-list').innerHTML =
      '<p style="text-align: center; padding: 2rem; color: red;">Erro ao carregar atividades</p>';
  }
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
