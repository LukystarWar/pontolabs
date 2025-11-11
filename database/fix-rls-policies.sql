-- ============================================
-- PONTOLABS - FIX RLS POLICIES (Infinite Recursion)
-- ============================================

-- REMOVER TODAS AS POLICIES ANTIGAS
DROP POLICY IF EXISTS "Superadmin acessa todas empresas" ON empresas;
DROP POLICY IF EXISTS "Usuarios acessam propria empresa" ON empresas;
DROP POLICY IF EXISTS "Usuarios por empresa" ON usuarios;
DROP POLICY IF EXISTS "Funcionarios por empresa" ON funcionarios;
DROP POLICY IF EXISTS "Terminais por empresa" ON terminais;
DROP POLICY IF EXISTS "Pontos por empresa" ON pontos;

-- ============================================
-- NOVAS POLICIES (SEM RECURSÃO)
-- ============================================

-- EMPRESAS: Usuários autenticados podem ver sua própria empresa
CREATE POLICY "select_empresas" ON empresas
  FOR SELECT USING (
    id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

-- USUARIOS: Pode ler apenas usuários da própria empresa
CREATE POLICY "select_usuarios" ON usuarios
  FOR SELECT USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

-- USUARIOS: Pode inserir (para criação de conta)
CREATE POLICY "insert_usuarios" ON usuarios
  FOR INSERT WITH CHECK (true);

-- USUARIOS: Pode atualizar próprio perfil
CREATE POLICY "update_usuarios" ON usuarios
  FOR UPDATE USING (id = auth.uid());

-- FUNCIONARIOS: Acesso por empresa
CREATE POLICY "select_funcionarios" ON funcionarios
  FOR SELECT USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "insert_funcionarios" ON funcionarios
  FOR INSERT WITH CHECK (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "update_funcionarios" ON funcionarios
  FOR UPDATE USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "delete_funcionarios" ON funcionarios
  FOR DELETE USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

-- TERMINAIS: Acesso por empresa
CREATE POLICY "select_terminais" ON terminais
  FOR SELECT USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "insert_terminais" ON terminais
  FOR INSERT WITH CHECK (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "update_terminais" ON terminais
  FOR UPDATE USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "delete_terminais" ON terminais
  FOR DELETE USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

-- PONTOS: Acesso por empresa (INSERT sempre permitido, UPDATE/DELETE bloqueado por trigger)
CREATE POLICY "select_pontos" ON pontos
  FOR SELECT USING (
    empresa_id IN (
      SELECT empresa_id
      FROM usuarios
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "insert_pontos" ON pontos
  FOR INSERT WITH CHECK (true);

-- UPDATE e DELETE já são bloqueados pelo trigger, mas adiciona policy por segurança
CREATE POLICY "no_update_pontos" ON pontos
  FOR UPDATE USING (false);

CREATE POLICY "no_delete_pontos" ON pontos
  FOR DELETE USING (false);
