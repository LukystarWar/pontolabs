-- ============================================
-- PONTOLABS DATABASE SCHEMA
-- ============================================

-- 1. EMPRESAS
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  plano VARCHAR(50) DEFAULT 'premium',
  limite_funcionarios INT DEFAULT 999999,
  limite_terminais INT DEFAULT 999999,
  ativa BOOLEAN DEFAULT true,
  data_inicio TIMESTAMP DEFAULT now(),
  data_expiracao TIMESTAMP DEFAULT (now() + interval '10 years'),
  criado_em TIMESTAMP DEFAULT now()
);

-- 2. USUARIOS (Supabase Auth integration)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'funcionario', 'terminal')),
  criado_em TIMESTAMP DEFAULT now()
);

-- 3. FUNCIONARIOS
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  turno VARCHAR(50),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now()
);

-- 4. TERMINAIS
CREATE TABLE terminais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255),
  ativo BOOLEAN DEFAULT true,
  chave_secreta VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT now()
);

-- 5. PONTOS
CREATE TABLE pontos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID REFERENCES funcionarios(id) ON DELETE CASCADE,
  terminal_id UUID REFERENCES terminais(id) ON DELETE SET NULL,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  tipo VARCHAR(20) CHECK (tipo IN ('entrada', 'saida')),
  data_hora TIMESTAMP NOT NULL,
  ip VARCHAR(50),
  gps_lat DECIMAL(10, 8),
  gps_lng DECIMAL(11, 8),
  foto_url TEXT,
  hash_registro VARCHAR(255),
  criado_em TIMESTAMP DEFAULT now()
);

-- ============================================
-- INDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_usuarios_empresa ON usuarios(empresa_id);
CREATE INDEX idx_funcionarios_empresa ON funcionarios(empresa_id);
CREATE INDEX idx_terminais_empresa ON terminais(empresa_id);
CREATE INDEX idx_pontos_empresa ON pontos(empresa_id);
CREATE INDEX idx_pontos_funcionario ON pontos(funcionario_id);
CREATE INDEX idx_pontos_data ON pontos(data_hora);

-- ============================================
-- TRIGGER: IMPEDIR UPDATE/DELETE EM PONTOS
-- ============================================

CREATE OR REPLACE FUNCTION prevent_ponto_changes()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Registros de ponto não podem ser alterados ou excluídos';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_update_pontos
BEFORE UPDATE ON pontos
FOR EACH ROW EXECUTE FUNCTION prevent_ponto_changes();

CREATE TRIGGER prevent_delete_pontos
BEFORE DELETE ON pontos
FOR EACH ROW EXECUTE FUNCTION prevent_ponto_changes();

-- ============================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ============================================

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminais ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontos ENABLE ROW LEVEL SECURITY;

-- Empresas: apenas superadmin vê todas
CREATE POLICY "Superadmin acessa todas empresas" ON empresas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Empresas: admin/funcionario/terminal vê apenas sua empresa
CREATE POLICY "Usuarios acessam propria empresa" ON empresas
  FOR SELECT USING (
    id IN (
      SELECT empresa_id FROM usuarios WHERE id = auth.uid()
    )
  );

-- Usuarios: cada empresa vê apenas seus usuarios
CREATE POLICY "Usuarios por empresa" ON usuarios
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM usuarios WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM usuarios WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Funcionarios: isolamento por empresa
CREATE POLICY "Funcionarios por empresa" ON funcionarios
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM usuarios WHERE id = auth.uid()
    )
  );

-- Terminais: isolamento por empresa
CREATE POLICY "Terminais por empresa" ON terminais
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM usuarios WHERE id = auth.uid()
    )
  );

-- Pontos: isolamento por empresa (INSERT permitido, UPDATE/DELETE bloqueado por trigger)
CREATE POLICY "Pontos por empresa" ON pontos
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM usuarios WHERE id = auth.uid()
    )
  );

-- ============================================
-- SEED: EMPRESA E ADMIN INICIAL
-- ============================================

-- Inserir empresa de teste (Premium)
INSERT INTO empresas (nome, plano, limite_funcionarios, limite_terminais)
VALUES ('Empresa Teste Premium', 'premium', 999999, 999999);

-- NOTA: O usuário admin precisa ser criado via Supabase Auth primeiro
-- Após criar o usuário no Auth, execute:
-- INSERT INTO usuarios (id, empresa_id, nome, email, role)
-- VALUES ('<UUID_DO_AUTH>', '<UUID_DA_EMPRESA>', 'Admin Teste', 'admin@teste.com', 'admin');
