function changeQuandity(cartId, proId, userId, count) {
        let quantity = parseInt(document.getElementById(proId).innerHTML)
        count = parseInt(count)

        $.ajax({
            url: '/change-product-quantity',
            data: {
                user: userId,
                cart: cartId,
                product: proId,
                count: count,
                quantity: quantity,
            },
            method: 'post',
            success: (response) => {
                if (response.removeProduct) {
                    alert("Product removed from Cart:")
                    location.reload()
                } else {
                    console.log('sasa', response)
                    document.getElementById(proId).innerHTML = quantity + count
                    document.getElementById('total').innerHTML = response.total
                }
            },
        })

    }
function removeProduct(cartId, proId) {
        $.ajax({
            url: '/remove-product',
            data: {
                product: proId,
                cart: cartId,
            },
            method: 'post',
            success: (response) => {
                if (response.removeProduct) {
                    alert("Product is successfully removed from Cart:")
                    location.reload();
                } else {
                    document.getElementById(proId).innerHTML = response.removeProduct
                }

            }
        });

    };
