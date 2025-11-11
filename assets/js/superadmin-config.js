// ============================================
// PONTOLABS - CONFIGURAÇÃO SUPERADMIN
// ============================================

// ⚠️ ATENÇÃO: Este arquivo contém a Service Role Key
// NÃO compartilhe este arquivo publicamente
// USE APENAS nas páginas de SuperAdmin

// Para obter sua Service Role Key:
// 1. Acesse: https://supabase.com/dashboard/project/pfbynyflbtdlnozqtgxz/settings/api
// 2. Vá em "Project API keys"
// 3. Copie a "service_role" key (não a anon key)
// 4. Cole abaixo

const SUPABASE_SERVICE_KEY = 'COLE_SUA_SERVICE_ROLE_KEY_AQUI';

// Cliente Admin do Supabase (com permissões elevadas)
const supabaseAdmin = window.supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Função para criar usuário no Auth (Admin API)
async function createAuthUser(email, password, userData = {}) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: userData
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar usuário no Auth:', error);
    throw error;
  }
}

// Função para criar Admin completo (Auth + DB)
async function createAdminUser(empresaId, nome, email, password) {
  try {
    // 1. Criar no Supabase Auth
    console.log('Criando usuário no Auth...');
    const authResult = await createAuthUser(email, password, { nome, role: 'admin' });

    if (!authResult.user) {
      throw new Error('Falha ao criar usuário no Auth');
    }

    const userId = authResult.user.id;
    console.log('Usuário criado no Auth:', userId);

    // 2. Vincular na tabela usuarios
    console.log('Vinculando usuário na tabela...');
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: userId,
        empresa_id: empresaId,
        nome: nome,
        email: email,
        role: 'admin'
      }])
      .select()
      .single();

    if (usuarioError) {
      console.error('Erro ao vincular usuário:', usuarioError);
      // Tentar deletar do Auth se falhou
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw usuarioError;
    }

    console.log('Admin criado com sucesso!');
    return {
      user: authResult.user,
      usuario: usuario,
      credentials: {
        email: email,
        password: password
      }
    };

  } catch (error) {
    console.error('Erro ao criar admin:', error);
    throw error;
  }
}

// Função para criar Funcionário completo (Auth + DB)
async function createFuncionarioUser(empresaId, nome, email, password, cargo = '', turno = '') {
  try {
    // 1. Criar no Supabase Auth
    console.log('Criando funcionário no Auth...');
    const authResult = await createAuthUser(email, password, { nome, role: 'funcionario' });

    if (!authResult.user) {
      throw new Error('Falha ao criar usuário no Auth');
    }

    const userId = authResult.user.id;
    console.log('Funcionário criado no Auth:', userId);

    // 2. Vincular na tabela usuarios
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: userId,
        empresa_id: empresaId,
        nome: nome,
        email: email,
        role: 'funcionario'
      }]);

    if (usuarioError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw usuarioError;
    }

    // 3. Criar na tabela funcionarios
    const { data: funcionario, error: funcionarioError } = await supabase
      .from('funcionarios')
      .insert([{
        empresa_id: empresaId,
        usuario_id: userId,
        nome: nome,
        cargo: cargo,
        turno: turno,
        ativo: true
      }])
      .select()
      .single();

    if (funcionarioError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw funcionarioError;
    }

    console.log('Funcionário criado com sucesso!');
    return {
      user: authResult.user,
      funcionario: funcionario,
      credentials: {
        email: email,
        password: password
      }
    };

  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    throw error;
  }
}

// Função para criar Terminal completo (Auth + DB)
async function createTerminalUser(empresaId, nome, email, password, localizacao = '') {
  try {
    // 1. Criar no Supabase Auth
    console.log('Criando terminal no Auth...');
    const authResult = await createAuthUser(email, password, { nome, role: 'terminal' });

    if (!authResult.user) {
      throw new Error('Falha ao criar usuário no Auth');
    }

    const userId = authResult.user.id;
    console.log('Terminal criado no Auth:', userId);

    // 2. Vincular na tabela usuarios
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: userId,
        empresa_id: empresaId,
        nome: nome,
        email: email,
        role: 'terminal'
      }]);

    if (usuarioError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw usuarioError;
    }

    // 3. Criar na tabela terminais
    const { data: terminal, error: terminalError } = await supabase
      .from('terminais')
      .insert([{
        empresa_id: empresaId,
        usuario_id: userId,
        nome: nome,
        localizacao: localizacao,
        ativo: true,
        chave_secreta: JWT_SECRET
      }])
      .select()
      .single();

    if (terminalError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw terminalError;
    }

    console.log('Terminal criado com sucesso!');
    return {
      user: authResult.user,
      terminal: terminal,
      credentials: {
        email: email,
        password: password
      }
    };

  } catch (error) {
    console.error('Erro ao criar terminal:', error);
    throw error;
  }
}

// Verificar se Service Key está configurada
function checkServiceKeyConfigured() {
  if (SUPABASE_SERVICE_KEY === 'COLE_SUA_SERVICE_ROLE_KEY_AQUI' || !SUPABASE_SERVICE_KEY) {
    console.warn('⚠️ Service Role Key não configurada!');
    return false;
  }
  return true;
}
