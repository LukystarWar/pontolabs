// ============================================
// PONTOLABS - AUTENTICAÇÃO
// ============================================

// Verifica se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;

  // Se estiver na página de login, verifica se já está autenticado
  if (currentPath.includes('login.html')) {
    try {
      const user = await getCurrentUser();
      if (user) {
        const profile = await getUserProfile();
        redirectByRole(profile.role);
      }
    } catch (error) {
      console.log('Não autenticado');
    }
  }

  // Se não estiver na página de login, verifica autenticação
  if (!currentPath.includes('login.html') && currentPath !== '/') {
    try {
      const user = await getCurrentUser();
      if (!user) {
        window.location.href = '/pages/login.html';
      }
    } catch (error) {
      window.location.href = '/pages/login.html';
    }
  }
});

// Formulário de login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    const alertContainer = document.getElementById('alert-container');

    // Desabilita botão
    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';
    alertContainer.innerHTML = '';

    try {
      // Faz login
      const { user } = await signIn(email, password);

      // Busca perfil do usuário
      const profile = await getUserProfile();

      if (!profile) {
        throw new Error('Perfil não encontrado');
      }

      // Verifica se empresa está ativa
      if (!profile.empresas.ativa) {
        throw new Error('Empresa inativa. Entre em contato com o suporte.');
      }

      // Salva sessão localmente
      localStorage.setItem('pontolabs_session', JSON.stringify({
        userId: user.id,
        email: user.email,
        role: profile.role,
        empresaId: profile.empresa_id,
        empresaNome: profile.empresas.nome
      }));

      // Redireciona baseado no role
      redirectByRole(profile.role);

    } catch (error) {
      console.error('Erro no login:', error);
      showAlert(error.message || 'Erro ao fazer login. Verifique suas credenciais.', 'error');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Entrar';
    }
  });
}

// Redireciona baseado no role
function redirectByRole(role) {
  switch (role) {
    case 'admin':
      window.location.href = '/pages/admin/dashboard.html';
      break;
    case 'terminal':
      window.location.href = '/pages/terminal.html';
      break;
    case 'funcionario':
      window.location.href = '/pages/funcionario.html';
      break;
    case 'superadmin':
      window.location.href = '/pages/admin/dashboard.html';
      break;
    default:
      throw new Error('Role inválido');
  }
}

// Mostra alerta
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  alertContainer.innerHTML = '';
  alertContainer.appendChild(alertDiv);

  // Remove após 5 segundos
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Botão de logout (usado em outras páginas)
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('Deseja sair do sistema?')) {
        await signOut();
      }
    });
  }
}

// Pega sessão local
function getLocalSession() {
  const session = localStorage.getItem('pontolabs_session');
  return session ? JSON.parse(session) : null;
}

// Carrega informações do usuário na página
async function loadUserInfo() {
  try {
    const profile = await getUserProfile();
    const userNameElement = document.getElementById('user-name');
    const empresaNomeElement = document.getElementById('empresa-nome');
    const planoElement = document.getElementById('plano');

    if (userNameElement) userNameElement.textContent = profile.nome;
    if (empresaNomeElement) empresaNomeElement.textContent = profile.empresas.nome;
    if (planoElement) planoElement.textContent = profile.empresas.plano.toUpperCase();

    return profile;
  } catch (error) {
    console.error('Erro ao carregar informações:', error);
    throw error;
  }
}

// Inicializa logout quando estiver em páginas internas
if (!window.location.pathname.includes('login.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    setupLogoutButton();
  });
}
