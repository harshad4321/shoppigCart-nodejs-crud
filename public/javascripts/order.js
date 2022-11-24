               function changeQuandity(cartId, proId, userId, count) {
        let quantity = parseInt(document.getElementById(proId).innerHTML)
        count = parseInt(count)
        console.log(userId)

        $.ajax({
            url: '/change-product-quandity',
            data: {
                user: userId,
                cart: cartId,
                product: proId,
                count: count,
                quantity: quantity
            },
            method: 'post',
            success: (response) => {
                if (response.removeProduct) {
                    alert(" Product Removed from Cart");location.reload()
                } else {
                    document.getElementById(proId).innerHTML = quantity + count
                    document.getElementById('total').innerHTML = response.total
                }
            }
        })
    }
function changeQuandity(cartId, proId, userId, count) {
        let quantity = parseInt(document.getElementById(proId).innerHTML)
        count = parseInt(count)
        console.log(userId)

        $.ajax({
            url: '/change-product-quandity',
            data: {
                user: userId,
                cart: cartId,
                product: proId,
                count: count,
                quantity: quantity
            },
            method: 'post',
            success: (response) => {
                if (response.removeProduct) {
                    alert(" Product Removed from Cart");location.reload()
                } else {
                    document.getElementById(proId).innerHTML = quantity + count
                    document.getElementById('total').innerHTML = response.total
                }
            }
        })
    }
