// Sistema de Gerenciamento de Produtos/Serviços
class ProductService {
    constructor() {
        this.storageKey = 'workspace_products';
        this.init();
    }

    init() {
        // Inicializa o storage se não existir
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Gera um ID único para o produto
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Retorna todos os produtos
    getProducts() {
        const products = localStorage.getItem(this.storageKey);
        return products ? JSON.parse(products) : [];
    }

    // Salva produtos no localStorage
    saveProducts(products) {
        localStorage.setItem(this.storageKey, JSON.stringify(products));
    }

    // Cria um novo produto
    createProduct(productData) {
        // Validações
        if (!productData.nome || !productData.categoria || !productData.preco || !productData.vendedorId) {
            return { success: false, message: 'Por favor, preencha todos os campos obrigatórios.' };
        }

        if (productData.preco <= 0) {
            return { success: false, message: 'O preço deve ser maior que zero.' };
        }

        // Cria o objeto do produto
        const product = {
            id: this.generateId(),
            nome: productData.nome,
            descricao: productData.descricao || '',
            categoria: productData.categoria,
            tags: productData.tags || [],
            preco: parseFloat(productData.preco),
            imagem: productData.imagem || 'https://via.placeholder.com/400x300?text=Produto',
            rating: productData.rating || 0,
            avaliacoes: productData.avaliacoes || 0,
            vendedorId: productData.vendedorId,
            vendedorNome: productData.vendedorNome || '',
            vendedorTipo: productData.vendedorTipo, // 'empresa' ou 'freelancer'
            createdAt: new Date().toISOString(),
            ativo: productData.ativo !== undefined ? productData.ativo : true
        };

        // Salva o produto
        const products = this.getProducts();
        products.push(product);
        this.saveProducts(products);

        return { 
            success: true, 
            message: 'Produto criado com sucesso!',
            product: product
        };
    }

    // Atualiza um produto
    updateProduct(productId, productData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) {
            return { success: false, message: 'Produto não encontrado.' };
        }

        // Atualiza os campos fornecidos
        products[index] = {
            ...products[index],
            ...productData,
            preco: productData.preco !== undefined ? parseFloat(productData.preco) : products[index].preco
        };

        this.saveProducts(products);
        return { success: true, message: 'Produto atualizado com sucesso!', product: products[index] };
    }

    // Remove um produto
    deleteProduct(productId) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        this.saveProducts(filteredProducts);
        return { success: true, message: 'Produto removido com sucesso!' };
    }

    // Busca produtos por categoria
    getProductsByCategory(categoria) {
        const products = this.getProducts();
        return products.filter(p => p.categoria === categoria && p.ativo);
    }

    // Busca produtos por tags
    getProductsByTags(tags) {
        const products = this.getProducts();
        if (!Array.isArray(tags)) tags = [tags];
        return products.filter(p => {
            return p.ativo && tags.some(tag => 
                p.tags.some(productTag => 
                    productTag.toLowerCase().includes(tag.toLowerCase()) ||
                    tag.toLowerCase().includes(productTag.toLowerCase())
                )
            );
        });
    }

    // Busca produtos por texto (nome, descrição, tags)
    searchProducts(searchText) {
        const products = this.getProducts();
        const searchLower = searchText.toLowerCase();
        return products.filter(p => {
            if (!p.ativo) return false;
            return p.nome.toLowerCase().includes(searchLower) ||
                   p.descricao.toLowerCase().includes(searchLower) ||
                   p.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                   p.categoria.toLowerCase().includes(searchLower);
        });
    }

    // Filtra produtos por múltiplos critérios
    filterProducts(filters) {
        let products = this.getProducts().filter(p => p.ativo);

        // Filtro por categorias
        if (filters.categorias && filters.categorias.length > 0) {
            products = products.filter(p => filters.categorias.includes(p.categoria));
        }

        // Filtro por preço
        if (filters.precoMin !== undefined) {
            products = products.filter(p => p.preco >= filters.precoMin);
        }
        if (filters.precoMax !== undefined) {
            products = products.filter(p => p.preco <= filters.precoMax);
        }

        // Filtro por avaliação mínima
        if (filters.ratingMin !== undefined) {
            products = products.filter(p => p.rating >= filters.ratingMin);
        }

        // Busca por texto
        if (filters.searchText) {
            products = this.searchProducts(filters.searchText);
        }

        return products;
    }

    // Retorna produtos de um vendedor específico
    getProductsByVendor(vendorId) {
        const products = this.getProducts();
        return products.filter(p => p.vendedorId === vendorId);
    }

    // Retorna todos os produtos ativos (para marketplace)
    getActiveProducts() {
        const products = this.getProducts();
        return products.filter(p => p.ativo);
    }
}

// Instância global do serviço de produtos
const productService = new ProductService();

