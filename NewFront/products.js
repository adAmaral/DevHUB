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
        } else {
            // Atualiza produtos existentes que não têm imagem
            this.updateProductsWithoutImages();
        }
    }

    // Gera um ID único para o produto
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Retorna a imagem padrão para todos os produtos
    getDefaultImageByCategory(categoria) {
        // Retorna sempre a imagem padrão produtos.png
        return 'Produtos.png';
    }

    // Garante que um produto sempre tenha uma imagem válida
    ensureProductImage(product) {
        if (!product) return product;
        
        // Se não tiver imagem ou a imagem estiver vazia, usar a padrão da categoria
        if (!product.imagem || product.imagem.trim() === '') {
            return {
                ...product,
                imagem: this.getDefaultImageByCategory(product.categoria)
            };
        }
        
        return product;
    }

    // Atualiza todos os produtos existentes para usar a imagem padrão
    updateProductsWithoutImages() {
        const productsRaw = localStorage.getItem(this.storageKey);
        if (!productsRaw) return false;
        
        const products = JSON.parse(productsRaw);
        let updated = false;
        const imagemPadrao = this.getDefaultImageByCategory('');
        
        products.forEach(product => {
            // FORÇA todos os produtos a usarem a imagem padrão
            if (!product.imagem || product.imagem.trim() === '' || product.imagem !== imagemPadrao) {
                product.imagem = imagemPadrao;
                updated = true;
            }
        });
        
        if (updated) {
            this.saveProducts(products);
        }
        
        return updated;
    }

    // Retorna todos os produtos
    getProducts() {
        const products = localStorage.getItem(this.storageKey);
        const parsedProducts = products ? JSON.parse(products) : [];
        // Garante que todos os produtos tenham imagem
        return parsedProducts.map(p => this.ensureProductImage(p));
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
            imagem: productData.imagem || this.getDefaultImageByCategory(productData.categoria),
            rating: productData.rating || 0,
            avaliacoes: productData.avaliacoes || 0,
            vendedorId: productData.vendedorId,
            vendedorNome: productData.vendedorNome || '',
            vendedorTipo: productData.vendedorTipo, // 'empresa' ou 'freelancer'
            createdAt: new Date().toISOString(),
            ativo: productData.ativo !== undefined ? productData.ativo : true
        };

        // Salva o produto
        const productsRaw = localStorage.getItem(this.storageKey);
        const products = productsRaw ? JSON.parse(productsRaw) : [];
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
        const productsRaw = localStorage.getItem(this.storageKey);
        const products = productsRaw ? JSON.parse(productsRaw) : [];
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) {
            return { success: false, message: 'Produto não encontrado.' };
        }

        // Atualiza os campos fornecidos
        const categoria = productData.categoria !== undefined ? productData.categoria : products[index].categoria;
        const imagem = productData.imagem && productData.imagem.trim() !== '' 
            ? productData.imagem 
            : (products[index].imagem && products[index].imagem.trim() !== '' 
                ? products[index].imagem 
                : this.getDefaultImageByCategory(categoria));
        
        products[index] = {
            ...products[index],
            ...productData,
            preco: productData.preco !== undefined ? parseFloat(productData.preco) : products[index].preco,
            imagem: imagem
        };

        this.saveProducts(products);
        return { success: true, message: 'Produto atualizado com sucesso!', product: products[index] };
    }

    // Remove um produto
    deleteProduct(productId) {
        const productsRaw = localStorage.getItem(this.storageKey);
        const products = productsRaw ? JSON.parse(productsRaw) : [];
        const filteredProducts = products.filter(p => p.id !== productId);
        this.saveProducts(filteredProducts);
        return { success: true, message: 'Produto removido com sucesso!' };
    }

    // Busca produtos por categoria
    getProductsByCategory(categoria) {
        const products = this.getProducts();
        return products.filter(p => p.categoria === categoria && p.ativo).map(p => this.ensureProductImage(p));
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
        }).map(p => this.ensureProductImage(p));
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
        }).map(p => this.ensureProductImage(p));
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

        return products.map(p => this.ensureProductImage(p));
    }

    // Retorna produtos de um vendedor específico
    getProductsByVendor(vendorId) {
        const products = this.getProducts();
        return products.filter(p => p.vendedorId === vendorId).map(p => this.ensureProductImage(p));
    }

    // Retorna todos os produtos ativos (para marketplace)
    getActiveProducts() {
        const products = this.getProducts();
        return products.filter(p => p.ativo).map(p => this.ensureProductImage(p));
    }
}

// Instância global do serviço de produtos
const productService = new ProductService();

