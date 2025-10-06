// Base de Datos de Productos con imágenes
const products = [
    {
        id: 1,
        name: "Collar Océano Azul",
        description: "Collar de plata con cristales azules inspirados en el mar",
        price: 89000,
        category: "collares",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Anillo Perla Marina",
        description: "Anillo de oro con perla cultivada del océano",
        price: 125000,
        category: "anillos",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Aretes Concha Nácar",
        description: "Aretes de plata con incrustaciones de nácar",
        price: 65000,
        category: "aretes",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Pulsera Olas del Mar",
        description: "Pulsera de plata con diseño de olas marinas",
        price: 98000,
        category: "pulseras",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Collar Coral Turquesa",
        description: "Collar artesanal con piedras turquesa",
        price: 145000,
        category: "collares",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Anillo Aguamarina",
        description: "Anillo de plata con piedra aguamarina natural",
        price: 175000,
        category: "anillos",
        image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=400&fit=crop"
    },
    {
        id: 7,
        name: "Aretes Sirena",
        description: "Aretes largos con cristales azul mar",
        price: 85000,
        category: "aretes",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop"
    },
    {
        id: 8,
        name: "Pulsera Estrella de Mar",
        description: "Pulsera de plata con dije de estrella marina",
        price: 72000,
        category: "pulseras",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop"
    }
];

// Variables Globales
let cart = [];
let visitCount = 0;

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando aplicación Mar de Gemas...');
    initApp();
});

function initApp() {
    loadCart();
    loadVisitCount();
    displayFeaturedProducts();
    displayAllProducts();
    updateCartCount();
    updateProductCount();
    setupContactForm();
    console.log('Aplicación iniciada correctamente');
}

// ===== CONTADOR DE VISITAS =====
function loadVisitCount() {
    // Obtener visitas desde memoria temporal
    if (!window.tempVisitCount) {
        window.tempVisitCount = 0;
    }
    window.tempVisitCount++;
    visitCount = window.tempVisitCount;
    
    const visitElement = document.getElementById('visitCount');
    if (visitElement) {
        // Animación de conteo
        animateCounter(visitElement, 0, visitCount, 1000);
    }
}

function animateCounter(element, start, end, duration) {
    let startTime = null;
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = currentTime - startTime;
        const value = Math.floor((progress / duration) * (end - start) + start);
        
        element.textContent = Math.min(value, end);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// ===== CONTADOR DE PRODUCTOS =====
function updateProductCount() {
    const productElement = document.getElementById('productCount');
    if (productElement) {
        animateCounter(productElement, 0, products.length, 1000);
    }
}

// ===== MOSTRAR PRODUCTOS =====
function displayFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

function displayAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400/00CED1/FFFFFF?text=Mar+de+Gemas'">
                </div>
                <div class="product-body">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toLocaleString('es-CO')}</div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== FUNCIONES DEL CARRITO =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Producto no encontrado');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} agregado al carrito`, 'success');
    console.log('Carrito actualizado:', cart);
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
    
    if (product) {
        showNotification(`${product.name} eliminado del carrito`, 'info');
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        
        // Animación de rebote
        if (count > 0) {
            cartCountElement.style.animation = 'none';
            setTimeout(() => {
                cartCountElement.style.animation = 'pulse 0.5s';
            }, 10);
        }
    }
}

function updateCartDisplay() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');

    if (!container || !totalElement) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #ccc;"></i>
                <p class="text-muted mt-3">El carrito está vacío</p>
                <p class="text-muted">¡Agrega productos para empezar a comprar!</p>
            </div>
        `;
        totalElement.textContent = '0';
        return;
    }

    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h6>${item.name}</h6>
                <p class="text-muted mb-0">$${item.price.toLocaleString('es-CO')} c/u</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" title="Disminuir cantidad">-</button>
                    <span class="px-3 fw-bold">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" title="Aumentar cantidad">+</button>
                </div>
                <strong class="ms-3" style="color: #00CED1;">$${(item.price * item.quantity).toLocaleString('es-CO')}</strong>
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = cartHTML;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total.toLocaleString('es-CO');
}

function openCart() {
    updateCartDisplay();
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        const modal = new bootstrap.Modal(cartModal);
        modal.show();
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showNotification(`¡Gracias por tu compra! Total: $${total.toLocaleString('es-CO')} (${itemCount} productos)`, 'success');
    
    // Limpiar carrito
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Cerrar modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        const modalInstance = bootstrap.Modal.getInstance(cartModal);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    
    console.log('Compra finalizada exitosamente');
}

// ===== ALMACENAMIENTO =====
function saveCart() {
    // Guardar en variable temporal de la ventana (no usar localStorage)
    window.tempCartData = JSON.stringify(cart);
    console.log('Carrito guardado en memoria');
}

function loadCart() {
    // Cargar desde variable temporal
    if (window.tempCartData) {
        try {
            cart = JSON.parse(window.tempCartData);
            console.log('Carrito cargado desde memoria');
        } catch (e) {
            console.error('Error al cargar carrito:', e);
            cart = [];
        }
    }
}

// ===== NAVEGACIÓN ENTRE PÁGINAS =====
function showPage(pageName) {
    console.log('Navegando a:', pageName);
    
    // Ocultar todas las páginas
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la página seleccionada
    const pageMap = {
        'home': 'homePage',
        'products': 'productsPage',
        'about': 'aboutPage',
        'contact': 'contactPage'
    };

    const targetPage = document.getElementById(pageMap[pageName]);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Scroll to top suave
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });

    // Cerrar el menú en móvil
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        }
    }
}

// ===== FORMULARIO DE CONTACTO =====
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleContactForm);
    }
}

function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    
    console.log('Formulario enviado:', { name, email, phone, message });
    
    showNotification(`¡Gracias ${name}! Te responderemos pronto a ${email}`, 'success');
    
    // Limpiar formulario
    event.target.reset();
    
    return false;
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'success') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    
    const colors = {
        success: '#00CED1',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 18px 30px;
        border-radius: 50px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: bold;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><span>${message}</span>`;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ===== UTILIDADES =====
// Prevenir errores de consola
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.log('Error capturado:', msg);
    return false;
};

// Log de inicio
console.log('Script Mar de Gemas cargado correctamente');
console.log(`Total de productos: ${products.length}`);
console.log('Versión: 1.0.0');