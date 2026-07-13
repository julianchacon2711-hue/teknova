document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const categoryEl = document.getElementById('productoCategoria');
    const nameEl = document.getElementById('productoNombre');
    const priceEl = document.getElementById('productoPrecio');
    const descEl = document.getElementById('productoDescripcion');
    const mainImageEl = document.getElementById('productoImagenPrincipal');
    const thumbsContainer = document.getElementById('productoMiniaturas');
    const specsList = document.getElementById('productoEspecificaciones');
    const relatedContainer = document.getElementById('productosRelacionados');
    const whatsappBtn = document.getElementById('productoWhatsapp');

    if (!productId) {
        window.location.replace('productos.html');
        return;
    }

    let products = [];

    try {
        const response = await fetch('productos.json');
        const data = await response.json();
        products = data.productos || [];
    } catch (error) {
        console.error('Error cargando productos.json', error);
    }

    const product = products.find(item => item.id === productId);
    if (!product) {
        window.location.replace('productos.html');
        return;
    }

    function setActiveImage(src) {
        mainImageEl.src = src;
        mainImageEl.alt = product.nombre;
    }

    categoryEl.textContent = product.categoria;
    nameEl.textContent = product.nombre;
    priceEl.textContent = product.precio;
    descEl.textContent = product.descripcion;
    whatsappBtn.href = `https://wa.me/543417496188?text=${encodeURIComponent('Hola, estoy interesado en el producto: ' + product.nombre)}`;

    specsList.innerHTML = product.especificaciones.map(item => `<li>${item}</li>`).join('');
    setActiveImage(product.imagenes[0] || 'img/logo.jpg');

    thumbsContainer.innerHTML = product.imagenes.map((imagen, index) => `
        <button type="button" class="producto-thumb" data-src="${imagen}" aria-label="Ver imagen ${index + 1}">
            <img src="${imagen}" alt="Miniatura ${index + 1}">
        </button>
    `).join('');

    thumbsContainer.querySelectorAll('.producto-thumb').forEach((button, index) => {
        button.addEventListener('click', () => {
            const src = button.dataset.src;
            setActiveImage(src);
            thumbsContainer.querySelectorAll('.producto-thumb').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
        if (index === 0) {
            button.classList.add('active');
        }
    });

    const relatedProducts = products.filter(item => item.categoria === product.categoria && item.id !== product.id).slice(0, 4);
    relatedContainer.innerHTML = relatedProducts.map(item => `
        <article class="catalogo-card related-card">
            <a href="producto.html?id=${encodeURIComponent(item.id)}" class="catalogo-card-link">
                <div class="catalogo-card-image">
                    <img src="${item.imagenes[0]}" alt="${item.nombre}">
                </div>
                <div class="catalogo-card-body">
                    <h3>${item.nombre}</h3>
                    <p class="catalogo-card-price">${item.precio}</p>
                </div>
            </a>
        </article>
    `).join('');
});
