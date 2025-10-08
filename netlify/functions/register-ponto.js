// ============================================
// PONTOLABS - NETLIFY FUNCTION: REGISTER PONTO
// ============================================

const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = process.env.JWT_SECRET || 'pontolabs-secret-key-2025-change-in-production';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { token_qr, funcionario_id, empresa_id, tipo, data_hora, ip, hash_registro } = data;

    // Validação básica
    if (!token_qr || !funcionario_id || !empresa_id || !tipo) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Dados incompletos' })
      };
    }

    // Valida JWT
    let decoded;
    try {
      decoded = jwt.verify(token_qr, JWT_SECRET);
    } catch (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token QR inválido ou expirado' })
      };
    }

    // Verifica empresa_id
    if (decoded.empresa_id !== empresa_id) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Empresa não autorizada' })
      };
    }

    // Verifica expiração adicional (segurança)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'QR Code expirado' })
      };
    }

    // Inicializa Supabase com service role (bypass RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Registra ponto
    const { data: ponto, error } = await supabase
      .from('pontos')
      .insert({
        funcionario_id,
        terminal_id: decoded.terminal_id,
        empresa_id,
        tipo,
        data_hora: data_hora || new Date().toISOString(),
        ip,
        hash_registro
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir ponto:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao registrar ponto: ' + error.message })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        ponto_id: ponto.id,
        message: 'Ponto registrado com sucesso'
      })
    };

  } catch (error) {
    console.error('Erro na function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
};
