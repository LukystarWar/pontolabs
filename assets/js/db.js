// ============================================
// PONTOLABS - SUPABASE CLIENT
// ============================================

const supabase = window.supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// ============================================
// AUTH HELPERS
// ============================================

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  // Se tiver empresa_id, busca os dados da empresa
  if (data && data.empresa_id) {
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', data.empresa_id)
      .single();

    if (!empresaError && empresa) {
      data.empresas = empresa;
    }
  } else {
    // SuperAdmin não tem empresa
    data.empresas = null;
  }

  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem('pontolabs_session');
  window.location.href = '/pages/login.html';
}

// ============================================
// DATABASE HELPERS
// ============================================

async function getEmpresaByUserId(userId) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('empresa_id, empresas(*)')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

async function getFuncionarios(empresaId) {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nome');

  if (error) throw error;
  return data;
}

async function getTerminais(empresaId) {
  const { data, error } = await supabase
    .from('terminais')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('nome');

  if (error) throw error;
  return data;
}

async function getPontos(empresaId, filters = {}) {
  let query = supabase
    .from('pontos')
    .select(`
      *,
      funcionarios(nome, cargo),
      terminais(nome, localizacao)
    `)
    .eq('empresa_id', empresaId)
    .order('data_hora', { ascending: false });

  if (filters.funcionarioId) {
    query = query.eq('funcionario_id', filters.funcionarioId);
  }

  if (filters.dataInicio) {
    query = query.gte('data_hora', filters.dataInicio);
  }

  if (filters.dataFim) {
    query = query.lte('data_hora', filters.dataFim);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function createFuncionario(dados) {
  const { data, error } = await supabase
    .from('funcionarios')
    .insert(dados)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateFuncionario(id, dados) {
  const { data, error } = await supabase
    .from('funcionarios')
    .update(dados)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteFuncionario(id) {
  const { error } = await supabase
    .from('funcionarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

async function createTerminal(dados) {
  const { data, error } = await supabase
    .from('terminais')
    .insert(dados)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateTerminal(id, dados) {
  const { data, error } = await supabase
    .from('terminais')
    .update(dados)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteTerminal(id) {
  const { error } = await supabase
    .from('terminais')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

async function registrarPonto(dados) {
  const { data, error } = await supabase
    .from('pontos')
    .insert(dados)
    .select()
    .single();

  if (error) throw error;
  return data;
}
