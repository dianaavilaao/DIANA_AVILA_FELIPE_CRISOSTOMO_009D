$(document).ready(function() {
    var products = [];

    // Capture products
    $('.card').each(function() {
        var priceText = $(this).find('.precio').text().replace('.', '').replace(',', ''); // Clean up the price string
        var price = parseFloat(priceText);
        var card = $(this).closest('.col-md-3');
        products.push({ price: price, card: card });
    });

    // Function to update the product container
    function updateProductContainer(sortedProducts) {
        $('#productContainer').empty();
        sortedProducts.forEach(function(product) {
            $('#productContainer').append(product.card);
        });
    }

    // Event listener for sort order change
    $('#sortOrder').on('change', function() {
        var sortOrder = $(this).val();
        var sortedProducts = products.slice(); // Create a copy of the products array

        if (sortOrder === 'asc') {
            sortedProducts.sort(function(a, b) {
                return a.price - b.price;
            });
        } else if (sortOrder === 'desc') {
            sortedProducts.sort(function(a, b) {
                return b.price - a.price;
            });
        }

        updateProductContainer(sortedProducts);
    });

    // Initial sort
    $('#sortOrder').trigger('change');

    // Product card hover and click functionality
    const productCards = document.querySelectorAll('.product-card');
    const cartItemsContainer = document.getElementById('cartItems');
    const itemCountElement = document.querySelector('.numero-obj');

    // Load cart items from localStorage
    loadCartItems();

    productCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            card.classList.add('selected');
        });

        card.addEventListener('mouseout', function() {
            card.classList.remove('selected');
        });

        card.addEventListener('click', function() {
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price');
            const img = card.getAttribute('data-img');

            addToCart(name, price, img);
        });
    });

    function addToCart(name, price, img) {
        const newItem = createCartItem(name, price, img);
        cartItemsContainer.appendChild(newItem);

        newItem.querySelector('.remove-item').addEventListener('click', function(event) {
            event.stopPropagation();
            newItem.remove();
            updateCartTotal();
            updateItemCount(-1);
            saveCartItems();
        });

        updateCartTotal();
        updateItemCount(1);
        saveCartItems();
    }

    function createCartItem(name, price, img) {
        const newItem = document.createElement('div');
        newItem.classList.add('row', 'align-items-center', 'mb-3');
        newItem.innerHTML = `
            <div class="col-4">
                <a href="#"><img src="${img}" alt="${name}" class="img-fluid"></a>
            </div>
            <div class="col-6 text-start">
                <p class="lead mb-0">${name}</p>
                <p class="lead"><b>$${price}</b></p>
            </div>
            <div class="col-2 text-end">
                <button class="btn btn-danger btn-sm remove-item">X</button>
            </div>
        `;
        return newItem;
    }

    function updateCartTotal() {
        const cartItems = document.querySelectorAll('#cartItems .row');
        let total = 0;
        cartItems.forEach(item => {
            const price = item.querySelector('.lead b').innerText.replace('$', '');
            total += parseFloat(price);
        });
        document.querySelector('.total-carrito').innerText = `$${total}`;
    }

    function updateItemCount(change) {
        let itemCount = parseInt(itemCountElement.innerText);
        itemCount += change;
        itemCountElement.innerText = itemCount;
    }

    function saveCartItems() {
        const cartItems = [];
        document.querySelectorAll('#cartItems .row').forEach(item => {
            const name = item.querySelector('.lead.mb-0').innerText;
            const price = item.querySelector('.lead b').innerText.replace('$', '');
            const img = item.querySelector('img').src;
            cartItems.push({ name, price, img });
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('itemCount', itemCountElement.innerText);
    }

    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemCount = parseInt(localStorage.getItem('itemCount')) || 0;
        itemCountElement.innerText = itemCount;

        cartItems.forEach(item => {
            const newItem = createCartItem(item.name, item.price, item.img);
            cartItemsContainer.appendChild(newItem);

            newItem.querySelector('.remove-item').addEventListener('click', function(event) {
                event.stopPropagation();
                newItem.remove();
                updateCartTotal();
                updateItemCount(-1);
                saveCartItems();
            });
        });

        updateCartTotal();
    }

    // Load items on the cart page
    if (document.body.classList.contains('cart-page')) {
        loadCartItemsOnCartPage();
    }

    function loadCartItemsOnCartPage() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartTableBody = document.querySelector('.cart-table tbody');

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">
                    <div class="d-flex align-items-center">
                        <img src="${item.img}" class="img-fluid rounded-3" style="width: 120px;">
                        <div class="flex-column ms-4">
                            <p class="mb-2">${item.name}</p>
                        </div>
                    </div>
                </th>
                <td class="align-middle">
                    <p class="mb-0 text-center" style="font-weight: 500;">1</p>
                </td>
                <td class="align-middle">
                    <p class="mb-0" style="font-weight: 500;">$${item.price}</p>
                </td>
            `;
            cartTableBody.appendChild(row);
        });

        updateCartPageTotal();
    }

    function updateCartPageTotal() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let total = 0;
        cartItems.forEach(item => {
            total += parseFloat(item.price);
        });
        document.querySelector('.cart-page-total').innerText = `$${total}`;
    }
});
