// ============================================
// SUPERADMIN - SISTEMA
// ============================================

let currentUser = null;

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
    await loadSystemInfo();
    await loadDBStats();

  } catch (error) {
    console.error('Erro na inicialização:', error);
    alert('Erro ao carregar página: ' + error.message);
  }
});

// Carrega informações do sistema
async function loadSystemInfo() {
  try {
    // Mostra URL do projeto
    document.getElementById('project-url').textContent = SUPABASE_CONFIG.url;

  } catch (error) {
    console.error('Erro ao carregar info do sistema:', error);
  }
}

// Carrega estatísticas do banco
async function loadDBStats() {
  try {
    // Total de empresas
    const { count: empresas } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true });

    // Total de usuários
    const { count: usuarios } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    // Total de funcionários
    const { count: funcionarios } = await supabase
      .from('funcionarios')
      .select('*', { count: 'exact', head: true });

    // Total de terminais
    const { count: terminais } = await supabase
      .from('terminais')
      .select('*', { count: 'exact', head: true });

    // Total de pontos
    const { count: pontos } = await supabase
      .from('pontos')
      .select('*', { count: 'exact', head: true });

    // Pontos últimos 7 dias
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const { count: pontos7dias } = await supabase
      .from('pontos')
      .select('*', { count: 'exact', head: true })
      .gte('data_hora', seteDiasAtras.toISOString());

    // Atualiza UI
    document.getElementById('total-empresas-db').textContent = empresas || 0;
    document.getElementById('total-usuarios-db').textContent = usuarios || 0;
    document.getElementById('total-funcionarios-db').textContent = funcionarios || 0;
    document.getElementById('total-terminais-db').textContent = terminais || 0;
    document.getElementById('total-pontos-db').textContent = pontos || 0;
    document.getElementById('pontos-ultimos-7-dias').textContent = pontos7dias || 0;

  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

// Copia comando SQL
function copySQL(button) {
  const sqlCode = button.previousElementSibling.textContent;
  navigator.clipboard.writeText(sqlCode).then(() => {
    const originalText = button.textContent;
    button.textContent = '✓ Copiado!';
    button.classList.add('btn-success');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('btn-success');
    }, 2000);
  }).catch(err => {
    console.error('Erro ao copiar:', err);
    alert('Erro ao copiar comando');
  });
}
