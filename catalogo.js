document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('catalogoSearch');
    const categorySelect = document.getElementById('catalogoCategory');
    const productsGrid = document.getElementById('catalogoGrid');
    const emptyMessage = document.getElementById('catalogoEmpty');

    let products = [];

    async function loadProducts() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar productos.json');
            }
            const data = await response.json();
            products = data.productos || [];
            populateCategories(products);
            renderProducts();
        } catch (error) {
            console.error(error);
            productsGrid.innerHTML = '<p class="catalogo-error">No se pudo cargar el catálogo. Intenta nuevamente más tarde.</p>';
        }
    }

    function populateCategories(products) {
        const categories = ['Todos', ...new Set(products.map(product => product.categoria))];
        categorySelect.innerHTML = categories.map(option => `<option value="${option}">${option}</option>`).join('');
    }

    function getFilteredProducts() {
        const searchText = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value;

        return products.filter(product => {
            const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
            const searchContent = `${product.nombre} ${product.precio} ${product.categoria} ${product.descripcion}`.toLowerCase();
            return matchesCategory && searchContent.includes(searchText);
        });
    }

    function renderProducts() {
        const filteredProducts = getFilteredProducts();

        if (filteredProducts.length === 0) {
            emptyMessage.classList.add('visible');
            productsGrid.innerHTML = '';
            return;
        }

        emptyMessage.classList.remove('visible');
        productsGrid.innerHTML = filteredProducts.map(product => `
            <article class="catalogo-card">
                <a href="producto.html?id=${encodeURIComponent(product.id)}" class="catalogo-card-link">
                    <div class="catalogo-card-image">
                        <img src="${product.imagenes[0]}" alt="${product.nombre}">
                    </div>
                    <div class="catalogo-card-body">
                        <h3>${product.nombre}</h3>
                        <p class="catalogo-card-price">${product.precio}</p>
                    </div>
                </a>
            </article>
        `).join('');
    }

    searchInput.addEventListener('input', renderProducts);
    categorySelect.addEventListener('change', renderProducts);

    loadProducts();
});
