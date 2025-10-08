// ============================================
// PONTOLABS - RELATÓRIOS
// ============================================

let empresaId = null;
let pontosAtual = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const profile = await loadUserInfo();

    if (profile.role !== 'admin' && profile.role !== 'superadmin') {
      alert('Acesso negado.');
      window.location.href = '/pages/login.html';
      return;
    }

    empresaId = profile.empresa_id;

    // Carrega funcionários para o filtro
    await carregarFuncionarios();

    // Define datas padrão (último mês)
    const hoje = new Date();
    const mesPassado = new Date();
    mesPassado.setMonth(mesPassado.getMonth() - 1);

    document.getElementById('filter-data-inicio').value = formatDate(mesPassado);
    document.getElementById('filter-data-fim').value = formatDate(hoje);

    // Event listeners
    document.getElementById('btn-filtrar').addEventListener('click', filtrarRelatorio);
    document.getElementById('btn-limpar').addEventListener('click', limparFiltros);
    document.getElementById('btn-exportar-csv').addEventListener('click', exportarCSV);

    // Carrega relatório inicial
    await filtrarRelatorio();

  } catch (error) {
    console.error('Erro ao inicializar página:', error);
    showAlert('Erro ao carregar página', 'error');
  }
});

async function carregarFuncionarios() {
  try {
    const funcionarios = await getFuncionarios(empresaId);
    const select = document.getElementById('filter-funcionario');

    funcionarios.forEach(f => {
      const option = document.createElement('option');
      option.value = f.id;
      option.textContent = f.nome;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
  }
}

async function filtrarRelatorio() {
  const btnFiltrar = document.getElementById('btn-filtrar');
  btnFiltrar.disabled = true;
  btnFiltrar.textContent = 'Carregando...';

  try {
    const filtros = {
      funcionarioId: document.getElementById('filter-funcionario').value || null,
      dataInicio: document.getElementById('filter-data-inicio').value || null,
      dataFim: document.getElementById('filter-data-fim').value || null
    };

    // Ajusta data fim para incluir o dia inteiro
    if (filtros.dataFim) {
      const dataFim = new Date(filtros.dataFim + 'T23:59:59');
      filtros.dataFim = dataFim.toISOString();
    }

    if (filtros.dataInicio) {
      const dataInicio = new Date(filtros.dataInicio + 'T00:00:00');
      filtros.dataInicio = dataInicio.toISOString();
    }

    pontosAtual = await getPontos(empresaId, filtros);
    renderRelatorio(pontosAtual);
    document.getElementById('total-registros').textContent = pontosAtual.length;

  } catch (error) {
    console.error('Erro ao filtrar relatório:', error);
    showAlert('Erro ao carregar relatório', 'error');
  } finally {
    btnFiltrar.disabled = false;
    btnFiltrar.textContent = '🔍 Filtrar';
  }
}

function renderRelatorio(pontos) {
  const tbody = document.getElementById('relatorios-list');

  if (pontos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Nenhum registro encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = pontos.map(p => {
    const data = new Date(p.data_hora);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');

    return `
      <tr>
        <td>${dataFormatada} ${horaFormatada}</td>
        <td>${p.funcionarios?.nome || 'N/A'}</td>
        <td>${p.funcionarios?.cargo || '-'}</td>
        <td>${p.terminais?.nome || 'N/A'}</td>
        <td><span class="badge badge-${p.tipo === 'entrada' ? 'success' : 'danger'}">${p.tipo.toUpperCase()}</span></td>
        <td>${p.ip || '-'}</td>
      </tr>
    `;
  }).join('');
}

function limparFiltros() {
  document.getElementById('filter-funcionario').value = '';

  const hoje = new Date();
  const mesPassado = new Date();
  mesPassado.setMonth(mesPassado.getMonth() - 1);

  document.getElementById('filter-data-inicio').value = formatDate(mesPassado);
  document.getElementById('filter-data-fim').value = formatDate(hoje);

  filtrarRelatorio();
}

function exportarCSV() {
  if (pontosAtual.length === 0) {
    alert('Nenhum dado para exportar');
    return;
  }

  // Cabeçalho do CSV
  const headers = ['Data/Hora', 'Funcionário', 'Cargo', 'Terminal', 'Localização', 'Tipo', 'IP'];

  // Linhas do CSV
  const rows = pontosAtual.map(p => {
    const data = new Date(p.data_hora);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');

    return [
      `"${dataFormatada} ${horaFormatada}"`,
      `"${p.funcionarios?.nome || 'N/A'}"`,
      `"${p.funcionarios?.cargo || '-'}"`,
      `"${p.terminais?.nome || 'N/A'}"`,
      `"${p.terminais?.localizacao || '-'}"`,
      `"${p.tipo.toUpperCase()}"`,
      `"${p.ip || '-'}"`
    ].join(',');
  });

  // Monta CSV
  const csv = [headers.join(','), ...rows].join('\n');

  // Cria Blob e faz download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const dataInicio = document.getElementById('filter-data-inicio').value;
  const dataFim = document.getElementById('filter-data-fim').value;
  const nomeArquivo = `pontolabs-relatorio-${dataInicio}-a-${dataFim}.csv`;

  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showAlert('Relatório exportado com sucesso!', 'success');
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
