$(document).ready(function() {
    var products = [];

    // Capturar productos
    $('.card').each(function() {
        var priceText = $(this).find('.precio').text().replace('.', '').replace(',', ''); // Limpiar el texto del precio
        var price = parseFloat(priceText);
        var card = $(this).closest('.col-md-3');
        products.push({ price: price, card: card });
    });

    // Función para actualizar el contenedor de productos
    function updateProductContainer(sortedProducts) {
        $('#productContainer').empty();
        sortedProducts.forEach(function(product) {
            $('#productContainer').append(product.card);
        });
    }

    // Evento para cambiar el orden de los productos
    $('#sortOrder').on('change', function() {
        var sortOrder = $(this).val();
        var sortedProducts = products.slice(); // Crear una copia del array de productos

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

    // Orden inicial
    $('#sortOrder').trigger('change');

    // Funcionalidad del carrito
    const productCards = document.querySelectorAll('.product-card');
    const cartItemsContainer = document.getElementById('cartItems');
    const itemCountElement = document.querySelector('.numero-obj');

    // Cargar elementos del carrito desde localStorage
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

        //formulario

        
    // Validate Username 
    $("#usercheck").hide(); 
    let usernameError = true; 
    $("#usernames").keyup(function () { 
        validateUsername(); 
    }); 
  
    function validateUsername() { 
        let usernameValue = $("#usernames").val(); 
        if (usernameValue.length == "") { 
            $("#usercheck").show(); 
            usernameError = false; 
            return false; 
        } else if (usernameValue.length < 3 || usernameValue.length > 10) { 
            $("#usercheck").show(); 
            $("#usercheck").html("**Largo del nombre de usuario debe ser de entre 3 y 10"); 
            usernameError = false; 
            return false; 
        } else { 
            $("#usercheck").hide(); 
        } 
    } 
  
    // Validate Email 
    const email = document.getElementById("email"); 
    email.addEventListener("blur", () => { 
        let regex =  
        /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/; 
        let s = email.value; 
        if (regex.test(s)) { 
            email.classList.remove("is-invalid"); 
            emailError = true; 
        } else { 
            email.classList.add("is-invalid"); 
            emailError = false; 
        } 
    }); 
  
    // Validate Password 
    $("#passcheck").hide(); 
    let passwordError = true; 
    $("#password").keyup(function () { 
        validatePassword(); 
    }); 
    function validatePassword() { 
        let passwordValue = $("#password").val(); 
        if (passwordValue.length == "") { 
            $("#passcheck").show(); 
            passwordError = false; 
            return false; 
        } 
        if (passwordValue.length < 3 || passwordValue.length > 10) { 
            $("#passcheck").show(); 
            $("#passcheck").html( 
                "**Largo de la contraseña debe ser de entre 3 y 10"
            ); 
            $("#passcheck").css("color", "red"); 
            passwordError = false; 
            return false; 
        } else { 
            $("#passcheck").hide(); 
        } 
    } 
  
    // Validate Confirm Password 
    $("#conpasscheck").hide(); 
    let confirmPasswordError = true; 
    $("#conpassword").keyup(function () { 
        validateConfirmPassword(); 
    }); 
    function validateConfirmPassword() { 
        let confirmPasswordValue = $("#conpassword").val(); 
        let passwordValue = $("#password").val(); 
        if (passwordValue != confirmPasswordValue) { 
            $("#conpasscheck").show(); 
            $("#conpasscheck").html("**Las contraseñas no coinciden"); 
            $("#conpasscheck").css("color", "red"); 
            confirmPasswordError = false; 
            return false; 
        } else { 
            $("#conpasscheck").hide(); 
        } 
    } 
  
    // Submit button 
    $("#submitbtn").click(function () { 
        validateUsername(); 
        validatePassword(); 
        validateConfirmPassword(); 
        validateEmail(); 
        if ( 
            usernameError == true && 
            passwordError == true && 
            confirmPasswordError == true && 
            emailError == true
        ) { 
            return true; 
        } else { 
            return false; 
        } 
    }); 
    
});
