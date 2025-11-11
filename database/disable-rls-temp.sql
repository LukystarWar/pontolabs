-- ============================================
-- PONTOLABS - DESABILITAR RLS TEMPORARIAMENTE
-- Use apenas para testes! Em produção, use fix-rls-policies.sql
-- ============================================

-- Desabilitar RLS em todas as tabelas
ALTER TABLE empresas DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE terminais DISABLE ROW LEVEL SECURITY;
ALTER TABLE pontos DISABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Após testar, reabilite com:
-- ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;
-- E execute fix-rls-policies.sql
