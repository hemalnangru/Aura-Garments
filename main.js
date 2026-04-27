document.addEventListener('DOMContentLoaded', () => {
  console.log("Website loaded");
    /* ===============================
       HAMBURGER MENU
    =============================== */
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavLinks = document.querySelector('.nav-links');
    if (hamburgerMenu && mobileNavLinks) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });
    }

    /* ===============================
       NAVBAR SCROLL
    =============================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  
    /* ===============================
       SCROLL REVEAL
    =============================== */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if (revealEls.length) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  
      revealEls.forEach(el => revealObserver.observe(el));
    }
  
    /* ===============================
       CONTACT FORM
    =============================== */
    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const oldText = btn.textContent;
  
        btn.textContent = 'Sending...';
  
        setTimeout(() => {
          btn.textContent = 'Message Sent!';
          form.reset();
  
          setTimeout(() => {
            btn.textContent = oldText;
          }, 2500);
        }, 1500);
      });
    }
  
    /* ===============================
       STORAGE
    =============================== */
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
    let currentUser = JSON.parse(localStorage.getItem('aura_user')) || null;
  
    /* ===============================
       CART ELEMENTS
    =============================== */
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const addButtons = document.querySelectorAll('.quick-add');
    const checkoutBtn = document.getElementById('checkout-btn');
  
    /* ===============================
       CHECKOUT ELEMENTS
    =============================== */
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckout = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutFinalTotal = document.getElementById('checkout-final-total');
    const deliveryType = document.getElementById('delivery-type');
  
    /* ===============================
       AUTH ELEMENTS
    =============================== */
    const navLoginBtn = document.getElementById('nav-login-btn');
    const authOverlay = document.getElementById('auth-overlay');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth');
    const authTitle = document.getElementById('auth-title');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToSignin = document.getElementById('switch-to-signin');
  
    /* ===============================
       ORDERS ELEMENTS
    =============================== */
    const ordersOverlay = document.getElementById('orders-overlay');
    const ordersModal = document.getElementById('orders-modal');
    const ordersClose = document.getElementById('orders-close');
    const ordersList = document.getElementById('orders-list');
  
    /* ===============================
       ADD ORDERS LINK TO NAV
    =============================== */
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('open-orders')) {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" id="open-orders">Orders</a>`;
      navLinks.appendChild(li);
    }
    const openOrdersBtn = document.getElementById('open-orders');
  
    /* ===============================
       HELPERS
    =============================== */
    const closeAllModals = () => {
      if (checkoutOverlay) checkoutOverlay.classList.remove('active');
      if (checkoutModal) checkoutModal.classList.remove('active');
      if (ordersOverlay) ordersOverlay.classList.remove('active');
      if (ordersModal) ordersModal.classList.remove('active');
      if (authOverlay) authOverlay.classList.remove('active');
      if (authModal) authModal.classList.remove('active');
    };
  
    const toggleCart = (force) => {
      if (!cartOverlay || !cartSidebar) return;
  
      if (typeof force === "boolean") {
        cartOverlay.classList.toggle('active', force);
        cartSidebar.classList.toggle('active', force);
      } else {
        cartOverlay.classList.toggle('active');
        cartSidebar.classList.toggle('active');
      }
    };
  
    const getCartTotal = () => {
      let total = 0;
      cart.forEach(item => total += item.price * item.quantity);
      return total;
    };
  
    /* ===============================
       CART RENDER
    =============================== */
    function renderCart() {
      if (!cartItemsContainer) return;
  
      cartItemsContainer.innerHTML = '';
  
      let total = 0;
      let count = 0;
  
      if (cart.length === 0) {
        cartItemsContainer.innerHTML =
          '<p class="empty-cart-message">Your bag is empty.</p>';
      } else {
        cart.forEach(item => {
          total += item.price * item.quantity;
          count += item.quantity;
  
          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
  
          itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
  
              <div class="cart-item-controls">
                <div>
                  <button class="quantity-btn minus" data-id="${item.id}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
  
                <button class="remove-item" data-id="${item.id}">
                  Remove
                </button>
              </div>
            </div>
          `;
  
          cartItemsContainer.appendChild(itemEl);
        });
      }
  
      if (cartBadge) cartBadge.textContent = count;
      if (cartTotalPrice) cartTotalPrice.textContent = `₹${total.toFixed(2)}`;
  
      localStorage.setItem('aura_cart', JSON.stringify(cart));
  
      attachCartEvents();
    }
  
    function attachCartEvents() {
      document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.onclick = () => updateQuantity(btn.dataset.id, 1);
      });
  
      document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.onclick = () => updateQuantity(btn.dataset.id, -1);
      });
  
      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => removeFromCart(btn.dataset.id);
      });
    }
  
    function updateQuantity(id, change) {
      const item = cart.find(x => x.id === id);
      if (!item) return;
  
      item.quantity += change;
  
      if (item.quantity <= 0) {
        cart = cart.filter(x => x.id !== id);
      }
  
      renderCart();
    }
  
    function removeFromCart(id) {
      cart = cart.filter(x => x.id !== id);
      renderCart();
    }
  
    function addToCart(product) {
      const existing = cart.find(x => x.id === product.id);
  
      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
  
      renderCart();
      toggleCart(true);
    }
  
    addButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        const sizeSelect = card ? card.querySelector('.size-selector') : null;
        const size = sizeSelect ? sizeSelect.value : 'M';

        const product = {
          id: btn.dataset.id + '-' + size,
          baseId: btn.dataset.id,
          name: btn.dataset.name + ' (' + size + ')',
          price: parseFloat(
            btn.dataset.price.replace("₹", "").replace("$", "")
          ),
          image: btn.dataset.image,
          size: size
        };
  
        addToCart(product);
      });
    });
  
    if (cartIcon) {
      cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
      });
    }
  
    if (closeCartBtn) closeCartBtn.onclick = () => toggleCart(false);
    if (cartOverlay) cartOverlay.onclick = () => toggleCart(false);
  
    /* ===============================
       CHECKOUT
    =============================== */

    // Delivery Charges & Total — defined first so checkoutBtn can call it
    let discountAmount = 0;

    function updateCheckoutTotal() {
        const baseTotal = getCartTotal();
        const deliveryCharge =
            deliveryType ? parseFloat(deliveryType.value) : 0;
        const finalTotal =
            Math.max(0, baseTotal - discountAmount + deliveryCharge);
        if (checkoutFinalTotal)
            checkoutFinalTotal.textContent = `₹${finalTotal.toFixed(2)}`;
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
  
        if (cart.length === 0) {
          alert("Your bag is empty.");
          return;
        }
  
        if (checkoutFinalTotal) {
            updateCheckoutTotal();
        }
  
        if (checkoutOverlay) checkoutOverlay.classList.add('active');
        if (checkoutModal) checkoutModal.classList.add('active');
      });
    }
  
    if (closeCheckout) {
      closeCheckout.onclick = () => {
        if (checkoutOverlay) checkoutOverlay.classList.remove('active');
        if (checkoutModal) checkoutModal.classList.remove('active');
      };
    }
  
    if (checkoutOverlay) {
      checkoutOverlay.onclick = () => {
        checkoutOverlay.classList.remove('active');
        checkoutModal.classList.remove('active');
      };
    }
  
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const total = getCartTotal().toFixed(2);
        const payment =
          document.getElementById('payment-method')?.value || 'N/A';
    
        async function completeOrder() {
          const orderId =
            "AURA" + Math.floor(Math.random() * 999999);
    
          const email = document.getElementById('customer-email').value;

          // Generate invoice and get base64 string
          const invoiceBase64 = generateInvoice(orderId, total);

          // Make API call to backend
          try {
            const response = await fetch('/api/checkout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                orderId,
                total,
                email,
                cart,
                payment,
                invoiceBase64
              })
            });

            const data = await response.json();

            let orders =
              JSON.parse(localStorage.getItem('aura_orders')) || [];
      
            orders.push({
              id: orderId,
              total: total,
              payment: payment,
              email: email,
              date: new Date().toLocaleString(),
              status: "Confirmed"
            });
      
            localStorage.setItem('aura_orders', JSON.stringify(orders));

            // Reduce stock for admin-added products
            let savedProducts = JSON.parse(localStorage.getItem('aura_products')) || [];
            cart.forEach(cartItem => {
              const prod = savedProducts.find(p => String(p.id) === String(cartItem.id));
              if (prod) {
                prod.stock = Math.max(0, parseInt(prod.stock) - cartItem.quantity);
              }
            });
            localStorage.setItem('aura_products', JSON.stringify(savedProducts));

            if (data.success) {
              alert(`Order Placed Successfully!\nOrder ID: ${orderId}\n\nA real confirmation email has been sent to ${email}!`);
            } else {
              alert(`Order Placed Successfully!\nOrder ID: ${orderId}\n\nWarning: Could not send email confirmation.`);
            }
      
            cart = [];
            renderCart();
            checkoutForm.reset();
      
            checkoutOverlay.classList.remove('active');
            checkoutModal.classList.remove('active');
            toggleCart(false);

          } catch (err) {
            console.error(err);
            alert("Order completed, but there was an error sending the confirmation email.");
          }
        }
    
        if (payment === "Razorpay") {
          const options = {
            key: "rzp_test_1234567890",
            amount: parseFloat(total) * 100,
            currency: "INR",
            name: "Aura Garments",
            description: "Order Payment",
            handler: function () {
              alert("Payment Successful!");
              completeOrder();
            },
            theme: {
              color: "#000000"
            }
          };
    
          const rzp = new Razorpay(options);
          rzp.open();
          return;
        }
    
        completeOrder();
      });
    }
    
  
    /* ===============================
       ORDERS
    =============================== */
    function renderOrders() {
      if (!ordersList) return;
  
      let orders = JSON.parse(localStorage.getItem('aura_orders')) || [];
  
      if (orders.length === 0) {
        ordersList.innerHTML = `<p>No orders yet.</p>`;
        return;
      }
  
      ordersList.innerHTML = '';
  
      [...orders].reverse().forEach(order => {
        ordersList.innerHTML += `
          <div class="order-box">
            <h4>Order ID: ${order.id}</h4>
            <p>Total: ₹${order.total}</p>
            <p>Payment: ${order.payment}</p>
            <p>Date: ${order.date}</p>
            <p>Email: ${order.email}</p>
            <p>Status: ${order.status}</p>
          </div>
        `;
      });
    }
  
    if (openOrdersBtn) {
      openOrdersBtn.onclick = (e) => {
        e.preventDefault();
        renderOrders();
  
        if (ordersOverlay) ordersOverlay.classList.add('active');
        if (ordersModal) ordersModal.classList.add('active');
      };
    }
  
    if (ordersClose) {
      ordersClose.onclick = () => {
        ordersOverlay.classList.remove('active');
        ordersModal.classList.remove('active');
      };
    }
  
    if (ordersOverlay) {
      ordersOverlay.onclick = () => {
        ordersOverlay.classList.remove('active');
        ordersModal.classList.remove('active');
      };
    }
  
    /* ===============================
       LOGIN / SIGNUP
    =============================== */
    function updateNavAuth() {
      if (!navLoginBtn) return;
  
      if (currentUser) {
        navLoginBtn.textContent = `Hi, ${currentUser.name}`;
        navLoginBtn.title = "Click to Logout";
      } else {
        navLoginBtn.textContent = "Login";
        navLoginBtn.title = "Click to Login";
      }
    }
  
    function toggleAuth() {
      if (authOverlay) authOverlay.classList.toggle('active');
      if (authModal) authModal.classList.toggle('active');
    }
  
    if (navLoginBtn) {
      navLoginBtn.onclick = (e) => {
        e.preventDefault();
  
        if (currentUser) {
          localStorage.removeItem('aura_user');
          currentUser = null;
          updateNavAuth();
          return;
        }
  
        toggleAuth();
      };
    }
  
    if (closeAuthBtn) closeAuthBtn.onclick = toggleAuth;
    if (authOverlay) authOverlay.onclick = toggleAuth;
  
    if (switchToSignup) {
      switchToSignup.onclick = (e) => {
        e.preventDefault();
        signinForm.classList.remove('active');
        signupForm.classList.add('active');
        authTitle.textContent = "Create Account";
      };
    }
  
    if (switchToSignin) {
      switchToSignin.onclick = (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        signinForm.classList.add('active');
        authTitle.textContent = "Sign In";
      };
    }
  
    if (signinForm) {
      signinForm.onsubmit = (e) => {
        e.preventDefault();
  
        const email = document.getElementById('signin-email').value;
  
        currentUser = {
          name: email.split('@')[0],
          email
        };
  
        localStorage.setItem('aura_user', JSON.stringify(currentUser));
  
        updateNavAuth();
        toggleAuth();
        signinForm.reset();
      };
    }
  
    if (signupForm) {
      signupForm.onsubmit = async (e) => {
        e.preventDefault();
  
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;

        // Send Welcome Email
        try {
          await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
          });
        } catch (error) {
          console.error("Welcome email error", error);
        }
  
        currentUser = { name, email };
  
        localStorage.setItem('aura_user', JSON.stringify(currentUser));
  
        updateNavAuth();
        toggleAuth();
        signupForm.reset();
        alert(`Account created! A welcome email has been sent to ${email}`);
      };
    }
  
    /* ===============================
       SEARCH + FILTER
    =============================== */
    const searchInput = document.getElementById('product-search');
    const priceFilter = document.getElementById('price-filter');
    const productCards = document.querySelectorAll('.product-card');
  
    function filterProducts() {
      const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
      const priceValue = priceFilter ? priceFilter.value : "all";
  
      productCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const price = parseFloat(
          card.querySelector('.price').textContent.replace("₹", "")
        );
  
        let show = true;
  
        if (!name.includes(searchValue)) show = false;
  
        if (
          priceValue !== "all" &&
          price > parseFloat(priceValue)
        ) {
          show = false;
        }
  
        card.style.display = show ? "block" : "none";
      });
    }
  
    if (searchInput) searchInput.oninput = filterProducts;
    if (priceFilter) priceFilter.onchange = filterProducts;
  
    /* ===============================
       WISHLIST
    =============================== */
    let wishlist = JSON.parse(localStorage.getItem('aura_wishlist')) || [];

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const quickAdd = btn.parentElement.querySelector('.quick-add');
      const id = quickAdd ? quickAdd.dataset.id : null;

      if (id && wishlist.includes(id)) {
          btn.classList.add('active');
          btn.textContent = '♥';
      }

      btn.onclick = () => {
        btn.classList.toggle('active');
        const isActive = btn.classList.contains('active');
        btn.textContent = isActive ? "♥" : "♡";

        if (id) {
            if (isActive) {
                if (!wishlist.includes(id)) wishlist.push(id);
            } else {
                wishlist = wishlist.filter(x => x !== id);
            }
            localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
        }
      };
    });
  
    /* ===============================
       QUICKVIEW
    =============================== */
    const quickviewOverlay = document.getElementById('quickview-overlay');
    const quickviewModal = document.getElementById('quickview-modal');
    const quickviewClose = document.getElementById('quickview-close');
    const quickviewImg = document.getElementById('quickview-img');
    const quickviewTitle = document.getElementById('quickview-title');
    const quickviewPrice = document.getElementById('quickview-price');
    const quickviewCartBtn = document.getElementById('quickview-cart-btn');
  
    document.querySelectorAll('.product-image img').forEach(img => {
      img.onclick = () => {
  
        const card = img.closest('.product-card');
  
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        const image = img.src;
  
        if (quickviewImg) quickviewImg.src = image;
        if (quickviewTitle) quickviewTitle.textContent = title;
        if (quickviewPrice) quickviewPrice.textContent = price;
  
        if (quickviewCartBtn) {
          quickviewCartBtn.onclick = () => {
            const qSize = document.getElementById('quickview-size');
            if (qSize) {
                const sizeSelect = card.querySelector('.size-selector');
                if (sizeSelect) sizeSelect.value = qSize.value;
            }
            card.querySelector('.quick-add').click();
  
            quickviewOverlay.classList.remove('active');
            quickviewModal.classList.remove('active');
          };
        }
  
        if (quickviewOverlay) quickviewOverlay.classList.add('active');
        if (quickviewModal) quickviewModal.classList.add('active');
      };
    });
  
    if (quickviewClose) {
      quickviewClose.onclick = () => {
        quickviewOverlay.classList.remove('active');
        quickviewModal.classList.remove('active');
      };
    }
  
    if (quickviewOverlay) {
      quickviewOverlay.onclick = () => {
        quickviewOverlay.classList.remove('active');
        quickviewModal.classList.remove('active');
      };
    }
  
    /* ===============================
       INIT
    =============================== */
    renderCart();
    updateNavAuth();

    // Invoice PDF
    function generateInvoice(orderId, total) {

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Aura Garments", 20, 20);

        doc.setFontSize(12);
        doc.text("Premium Fashion Invoice", 20, 30);

        doc.text("Order ID: " + orderId, 20, 45);
        doc.text("Date: " + new Date().toLocaleDateString(), 20, 55);

        doc.text("Amount: ₹" + total, 20, 65);

        doc.text("Thank you for shopping with Aura Garments.", 20, 85);

        doc.save("Aura-Invoice-" + orderId + ".pdf");
        
        return doc.output('datauristring');
    }

    // Admin Dashboard
    const adminOverlay = document.getElementById('admin-overlay');
    const adminModal = document.getElementById('admin-modal');
    const closeAdmin = document.getElementById('close-admin');
    const exportOrdersBtn = document.getElementById('export-orders-btn');

    const adminOrdersCount = document.getElementById('admin-orders-count');
    const adminRevenue = document.getElementById('admin-revenue');
    const adminProductsCount = document.getElementById('admin-products-count');

    // Add Admin button in navbar
    if (navLinks && !document.getElementById('open-admin')) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" id="open-admin">Admin</a>`;
        navLinks.appendChild(li);
    }

    const openAdminBtn = document.getElementById('open-admin');

    function renderAdminStats() {
        const orders = JSON.parse(localStorage.getItem('aura_orders')) || [];
        const products = document.querySelectorAll('.product-card');

        let revenue = 0;

        orders.forEach(order => {
            revenue += parseFloat(order.total);
        });

        adminOrdersCount.textContent = orders.length;
        adminRevenue.textContent = `₹${revenue.toFixed(2)}`;
        adminProductsCount.textContent = products.length;
    }

    // Open Admin
    if (openAdminBtn) {
        openAdminBtn.onclick = (e) => {
            e.preventDefault();
            renderAdminStats();

            adminOverlay.classList.add('active');
            adminModal.classList.add('active');
        };
    }

    // Close Admin
    if (closeAdmin) {
        closeAdmin.onclick = () => {
            adminOverlay.classList.remove('active');
            adminModal.classList.remove('active');
        };
    }

    if (adminOverlay) {
        adminOverlay.onclick = () => {
            adminOverlay.classList.remove('active');
            adminModal.classList.remove('active');
        };
    }

    // Export Orders
    if (exportOrdersBtn) {
        exportOrdersBtn.onclick = () => {
            const orders = JSON.parse(localStorage.getItem('aura_orders')) || [];

            const text = JSON.stringify(orders, null, 2);

            const blob = new Blob([text], { type: "text/plain" });
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = "Aura-Orders.txt";
            link.click();
        };
    }
    // Product Manager
    const addProductBtn = document.getElementById('add-product-btn');
    const newProductName = document.getElementById('new-product-name');
    const newProductPrice = document.getElementById('new-product-price');
    const newProductImage = document.getElementById('new-product-image');
    const newProductStock = document.getElementById('new-product-stock');

    if (addProductBtn) {
        addProductBtn.onclick = () => {

            const name = newProductName.value.trim();
            const price = newProductPrice.value.trim();
            const image = newProductImage.value.trim();
            const stock = newProductStock.value.trim();

            if (!name || !price || !image || !stock) {
                alert("Fill all product fields.");
                return;
            }

            const grid = document.querySelector('.product-grid');

            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-image">
                    <img src="${image}" alt="${name}">
                    <button class="wishlist-btn">♡</button>
                    <button class="quick-add"
                        ${parseInt(stock) <= 0 ? 'disabled style="opacity:.6;cursor:not-allowed;"' : ""}
                        data-id="${Date.now()}"
                        data-name="${name}"
                        data-price="₹${price}"
                        data-image="${image}">
                        Add to Bag
                    </button>
                </div>

                <div class="product-info">
                    <h3>${name}</h3>
                    <p class="price">₹${price}</p>
                </div>
            `;

            grid.prepend(card);

            newProductName.value = "";
            newProductPrice.value = "";
            newProductImage.value = "";

            alert("Product Added Successfully!");

            // location.reload();
        };
    }
    // Permanent Products Load
    function loadCustomProducts() {

        const savedProducts =
            JSON.parse(localStorage.getItem('aura_products')) || [];

        const grid = document.querySelector('.product-grid');

        savedProducts.forEach(product => {

            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="wishlist-btn">♡</button>

                    <button class="quick-add"
                        ${parseInt(product.stock) <= 0 ? 'disabled style="opacity:.6;cursor:not-allowed;"' : ""}
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="₹${product.price}"
                        data-image="${product.image}">
                        Add to Bag
                    </button>
                </div>

                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price}</p>
                        <p style="font-size:14px;color:#666;">
                        ${parseInt(product.stock) > 0 ? "Stock: " + product.stock : "Out of Stock"}
                    </p>
                </div>
            `;

            grid.prepend(card);

            // Save permanently
            let savedProducts =
            JSON.parse(localStorage.getItem('aura_products')) || [];

            savedProducts.push({
                id: Date.now(),
                name: name,
                price: price,
                image: image,
                stock: stock
            });

            localStorage.setItem(
                'aura_products',
                JSON.stringify(savedProducts)
            );
        });
    }

    loadCustomProducts();

    // Delete Products
    const deleteSelect = document.getElementById('delete-product-select');
    const deleteBtn = document.getElementById('delete-product-btn');

    function loadDeleteOptions() {

        if (!deleteSelect) return;

        deleteSelect.innerHTML =
            `<option value="">Select Product</option>`;

        const savedProducts =
            JSON.parse(localStorage.getItem('aura_products')) || [];

        savedProducts.forEach(product => {
            deleteSelect.innerHTML += `
                <option value="${product.id}">
                    ${product.name}
                </option>
            `;
        });
    }

    loadDeleteOptions();

    if (deleteBtn) {
        deleteBtn.onclick = () => {

            const id = deleteSelect.value;

            if (!id) {
                alert("Select a product.");
                return;
            }

            let savedProducts =
                JSON.parse(localStorage.getItem('aura_products')) || [];

            savedProducts =
                savedProducts.filter(
                    product => String(product.id) !== String(id)
                );

            localStorage.setItem(
                'aura_products',
                JSON.stringify(savedProducts)
            );

            alert("Product Deleted!");

            location.reload();
        };
    }

    // Edit Products
    const editSelect = document.getElementById('edit-product-select');
    const editBtn = document.getElementById('edit-product-btn');
    const editName = document.getElementById('edit-product-name');
    const editPrice = document.getElementById('edit-product-price');
    const editStock = document.getElementById('edit-product-stock');

    function loadEditOptions() {

        if (!editSelect) return;

        editSelect.innerHTML =
            `<option value="">Select Product</option>`;

        const savedProducts =
            JSON.parse(localStorage.getItem('aura_products')) || [];

        savedProducts.forEach(product => {
            editSelect.innerHTML += `
                <option value="${product.id}">
                    ${product.name}
                </option>
            `;
        });
    }

    loadEditOptions();

    if (editBtn) {
        editBtn.onclick = () => {

            const id = editSelect.value;

            if (!id) {
                alert("Select a product.");
                return;
            }

            let savedProducts =
                JSON.parse(localStorage.getItem('aura_products')) || [];

            const product =
                savedProducts.find(
                    p => String(p.id) === String(id)
                );

            if (!product) return;

            if (editName.value.trim())
                product.name = editName.value.trim();

            if (editPrice.value.trim())
                product.price = editPrice.value.trim();

            if (editStock.value.trim())
                product.stock = editStock.value.trim();

            localStorage.setItem(
                'aura_products',
                JSON.stringify(savedProducts)
            );

            alert("Product Updated!");

            location.reload();
        };
    }
    // Coupon System
    const couponInput = document.getElementById('coupon-code');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');

    if (applyCouponBtn) {
        applyCouponBtn.onclick = () => {

            const code = couponInput.value.trim().toUpperCase();
            const total = getCartTotal();

            discountAmount = 0;

            if (code === "SAVE10") {
                discountAmount = total * 0.10;
            }
            else if (code === "SAVE20") {
                discountAmount = total * 0.20;
            }
            else if (code === "FLAT500") {
                discountAmount = 500;
            }
            else {
                alert("Invalid Coupon Code");
                return;
            }

            const finalAmount =
                Math.max(0, total - discountAmount);

            checkoutFinalTotal.textContent =
                `₹${finalAmount.toFixed(2)}`;

            alert("Coupon Applied Successfully!");
        };
    }
    // Delivery Charges

    if (deliveryType) {
        deliveryType.onchange = updateCheckoutTotal;
    }
    // Auto Order Tracking
    function updateOrderStatuses() {

        let orders =
            JSON.parse(localStorage.getItem('aura_orders')) || [];

        orders.forEach(order => {

            if (order.status === "Confirmed") {
                order.status = "Packed";
            }
            else if (order.status === "Packed") {
                order.status = "Shipped";
            }
            else if (order.status === "Shipped") {
                order.status = "Out for Delivery";
            }
            else if (order.status === "Out for Delivery") {
                order.status = "Delivered";
            }

        });

        localStorage.setItem(
            'aura_orders',
            JSON.stringify(orders)
        );
    }

    // Update every 30 seconds
    setInterval(updateOrderStatuses, 30000);

    // Premium Cursor Glow
    const cursorGlow = document.getElementById('cursor-glow');

    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

});