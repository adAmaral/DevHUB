(function () {
  if (!window.ApiClient || !window.DevHubAuth) {
    console.error('Admin script requires ApiClient and DevHubAuth');
    return;
  }

  const page = document.body?.dataset?.page;
  if (!page || (page !== 'admin-empresa' && page !== 'admin-freelancer')) {
    return;
  }

  const state = {
    page,
    serviceType: page === 'admin-empresa' ? 'produto' : 'servico',
    items: [],
    categories: [],
    editingId: null,
    user: null
  };

  const refs = {
    welcome: document.getElementById('welcome-msg'),
    list: document.getElementById(page === 'admin-empresa' ? 'products-list' : 'services-list'),
    stats: {
      total: document.getElementById(page === 'admin-empresa' ? 'stat-products' : 'stat-services'),
      active: document.getElementById('stat-active'),
      views: document.getElementById('stat-views')
    },
    form: document.getElementById(page === 'admin-empresa' ? 'product-form' : 'service-form'),
    cancelEdit: document.getElementById('btn-cancel-edit'),
    newButton: document.getElementById(page === 'admin-empresa' ? 'btn-new-product' : 'btn-new-service'),
    title: document.getElementById(page === 'admin-empresa' ? 'product-title' : 'service-title'),
    description: document.getElementById(page === 'admin-empresa' ? 'product-description' : 'service-description'),
    price: document.getElementById(page === 'admin-empresa' ? 'product-price' : 'service-price'),
    category: document.getElementById(page === 'admin-empresa' ? 'product-category' : 'service-category'),
    delivery: document.getElementById(page === 'admin-empresa' ? 'product-delivery' : 'service-delivery'),
    tags: document.getElementById(page === 'admin-empresa' ? 'product-tags' : 'service-tags'),
    id: document.getElementById(page === 'admin-empresa' ? 'product-id' : 'service-id'),
    formTitle: document.getElementById('form-title')
  };

  function formatCurrency(value) {
    return `R$ ${Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  function renderCategories() {
    if (!refs.category) return;
    refs.category.innerHTML = '<option value="">Selecione...</option>';
    state.categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.nome;
      refs.category.appendChild(option);
    });
  }

  function renderList() {
    if (!refs.list) return;
    if (!state.items.length) {
      refs.list.innerHTML = '<p style="color:#4a4f58">Nenhum registro encontrado.</p>';
      return;
    }

    refs.list.innerHTML = state.items.map(item => `
      <article class="${state.page === 'admin-empresa' ? 'product-row' : 'service-row'}">
        <header>
          <h3>${item.titulo}</h3>
          <small style="color:#6c7280">${item.categoriaNome || 'Sem categoria'} · ${formatCurrency(item.preco)}</small>
        </header>
        <p style="color:#4a4f58;margin:0">${item.descricao || ''}</p>
        <div class="tags">${(item.tags || []).map(tag => `#${tag}`).join(' ')}</div>
        <footer>
          <button class="btn-secondary" data-action="edit" data-id="${item.id}">Editar</button>
          <button class="btn-danger" data-action="delete" data-id="${item.id}">Excluir</button>
        </footer>
      </article>
    `).join('');
  }

  function updateStats() {
    const total = state.items.length;
    const active = state.items.filter(item => item.ativo !== false).length;
    const views = state.items.reduce((sum, item) => sum + (item.visualizacoes || 0), 0);

    if (refs.stats.total) refs.stats.total.textContent = total;
    if (refs.stats.active) refs.stats.active.textContent = active;
    if (refs.stats.views) refs.stats.views.textContent = views;
  }

  function resetForm() {
    state.editingId = null;
    if (!refs.form) return;
    refs.form.reset();
    if (refs.id) refs.id.value = '';
    if (refs.formTitle) refs.formTitle.textContent = state.page === 'admin-empresa' ? 'Adicionar produto' : 'Adicionar serviço';
    if (refs.cancelEdit) refs.cancelEdit.style.display = 'none';
  }

  function fillForm(item) {
    if (!refs.form) return;
    refs.id.value = item.id;
    refs.title.value = item.titulo || '';
    refs.description.value = item.descricao || '';
    refs.price.value = item.preco || '';
    refs.category.value = item.categoriaId || '';
    if (refs.delivery) refs.delivery.value = item.prazoEntrega || '';
    if (refs.tags) refs.tags.value = (item.tags || []).join(', ');
    if (refs.formTitle) refs.formTitle.textContent = state.page === 'admin-empresa' ? 'Editar produto' : 'Editar serviço';
    if (refs.cancelEdit) refs.cancelEdit.style.display = 'inline-flex';
  }

  function parseTags(value) {
    return value.split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 15);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const payload = {
        titulo: refs.title.value.trim(),
        descricao: refs.description.value.trim(),
        preco: Number(refs.price.value),
        categoriaId: Number(refs.category.value),
        prazoEntrega: refs.delivery && refs.delivery.value ? Number(refs.delivery.value) : null,
        tags: parseTags(refs.tags?.value || ''),
        tipo: state.serviceType
      };

      if (!payload.titulo || !payload.descricao || !payload.preco || !payload.categoriaId) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      if (state.editingId) {
        await ApiClient.request(`/servicos/${state.editingId}`, {
          method: 'PUT',
          body: payload
        });
        ApiClient.showMessage('Registro atualizado com sucesso!', 'success');
      } else {
        await ApiClient.request('/servicos', {
          method: 'POST',
          body: payload
        });
        ApiClient.showMessage('Registro criado com sucesso!', 'success');
      }

      resetForm();
      await loadItems();
    } catch (err) {
      ApiClient.showMessage(err.message, 'error');
    }
  }

  async function handleListClick(event) {
    const action = event.target?.dataset?.action;
    const id = Number(event.target?.dataset?.id);
    if (!action || !id) return;

    const item = state.items.find(it => it.id === id);
    if (!item) return;

    if (action === 'edit') {
      state.editingId = id;
      fillForm(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (action === 'delete') {
      if (!confirm('Tem certeza que deseja excluir este registro?')) return;
      try {
        await ApiClient.request(`/servicos/${id}`, { method: 'DELETE' });
        ApiClient.showMessage('Registro removido.', 'info');
        await loadItems();
      } catch (err) {
        ApiClient.showMessage(err.message, 'error');
      }
    }
  }

  async function loadCategories() {
    try {
      state.categories = await ApiClient.request('/servicos/categorias');
      renderCategories();
    } catch (err) {
      ApiClient.showMessage('Não foi possível carregar categorias.', 'warning');
    }
  }

  async function loadItems() {
    try {
      const query = state.serviceType ? `?tipo=${state.serviceType}` : '';
      state.items = await ApiClient.request(`/servicos/me${query}`);
      renderList();
      updateStats();
    } catch (err) {
      ApiClient.showMessage('Erro ao carregar registros: ' + err.message, 'error');
    }
  }

  async function init() {
    try {
      state.user = await DevHubAuth.ensureAuthenticated({
        requiredType: state.page === 'admin-empresa' ? 'empresa' : 'freelancer'
      });

      if (refs.welcome && state.user) {
        refs.welcome.textContent = `Bem-vindo(a), ${state.user.nome}!`;
      }

      await loadCategories();
      await loadItems();
    } catch (err) {
      console.warn(err.message);
    }
  }

  if (refs.form) {
    refs.form.addEventListener('submit', handleSubmit);
  }

  if (refs.newButton) {
    refs.newButton.addEventListener('click', () => {
      resetForm();
      refs.title.focus();
    });
  }

  if (refs.cancelEdit) {
    refs.cancelEdit.addEventListener('click', () => {
      resetForm();
    });
  }

  if (refs.list) {
    refs.list.addEventListener('click', handleListClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

