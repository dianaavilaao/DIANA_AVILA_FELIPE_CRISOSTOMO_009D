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
});
