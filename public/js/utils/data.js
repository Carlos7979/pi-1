async function postCart() {
    const response = await axios.post('api/carts', {})
    if (response) {
        const cart = response.data.payload
        sessionStorage.setItem('cart', JSON.stringify(cart))
		return cart
    }
}

async function editProductCart(pid, type) {
    let cart = sessionStorage.getItem('cart')
	if (cart) cart = JSON.parse(cart)
	let product
	try {
		product = await axios.get(`api/products/${pid}`)
		if (!cart) cart = await postCart(cart)
	} catch (error) {
		const { stack, ...rest } = error
		console.log(rest)
		return
	}
	if (product?.data?.status !== 'success') return
	const stock = product.data.payload.stock
	const products = cart.products.find(e => e.product._id === pid)
	const quantity = products?.quantity ? products?.quantity : 0
	let addedProducts
	const card = document.getElementById(pid)
	const img = document.getElementById(`img-${pid}`)
	try {
		card.removeAttribute('style')
		img.setAttribute('style', 'opacity: 0.3;')
		if (type === 'plus' && quantity < stock) addedProducts  = await axios.post(`api/carts/${cart._id}/product/${pid}`)
		if (type === 'minus' && quantity > 0) addedProducts  = await axios.delete(`api/carts/${cart._id}/product/${pid}`)
		card.setAttribute('style', 'background: none;')
		img.removeAttribute('style')
	} catch (error) {
		card.setAttribute('style', 'background: none;')
		img.removeAttribute('style')
		const { stack, ...rest } = error
		console.log(rest)
		return
	}
    if (addedProducts?.data?.status === 'success') {
        const updatedCart = addedProducts?.data?.payload
        sessionStorage.setItem('cart', JSON.stringify(updatedCart))
        const cartLength = document.getElementById('cart-length')
		cartLength.innerText = updatedCart?.products?.reduce((acc, curr) => acc + curr.quantity, 0)
		const counter = document.getElementById(`counter-${pid}`)
		const minus = document.getElementById(`minus-${pid}`)
		const plus = document.getElementById(`plus-${pid}`)
		const productContainer = updatedCart.products.find(e => e.product._id === pid)
		const newQuantity = productContainer?.quantity ? productContainer?.quantity : 0
		counter.innerText = newQuantity
		if (type === 'plus') {
			if (quantity === 0) {
				minus.setAttribute('class', 'fa fa-minus cart-button')
				minus.addEventListener('click', handleMinus)
			}
			if (newQuantity >= stock) {
				plus.removeEventListener('click', handlePlus)
				plus.setAttribute('class', 'fa fa-plus cart-button-disable')
			}
		}
		if (type === 'minus') {
			if (quantity === stock) {
				plus.setAttribute('class', 'fa fa-plus cart-button')
				plus.addEventListener('click', handlePlus)
			}
			if (newQuantity === 0) {
				minus.setAttribute('class', 'fa fa-minus cart-button-disable')
				minus.removeEventListener('click', handleMinus)
			}
		}
    }
}