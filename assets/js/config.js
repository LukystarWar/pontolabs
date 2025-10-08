// ============================================
// PONTOLABS - CONFIGURAÇÃO SUPABASE
// ============================================

const SUPABASE_CONFIG = {
  url: 'https://pfbynyflbtdlnozqtgxz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYnlueWZsYnRkbG5venF0Z3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NTY0OTIsImV4cCI6MjA3NTUzMjQ5Mn0.0-1muC6HX3YuDBkaB1QMcRBgZzeFA0weyrhYXeBXwLE'
};

const APP_CONFIG = {
  name: 'PontoLabs',
  version: '1.0.0',
  theme: {
    primary: '#00BE28',
    secondary: '#ffffff'
  },
  qr: {
    expirationSeconds: 30,
    refreshInterval: 29000 // Renova 1s antes
  }
};

// Secret para JWT (deve ser a mesma no terminal e no servidor)
// Em produção, isso deve vir de variável de ambiente
const JWT_SECRET = 'pontolabs-secret-key-2025-change-in-production';
