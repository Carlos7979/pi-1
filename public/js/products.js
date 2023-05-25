let category, status, sort, manualChange
const handleDetail = e => {
    window.location.href = `/products/${e.id}`
}

const handlePlus = async e => {
    await editProductCart(e.target.id.split('-')[1], 'plus')
}

const handleMinus = async e => {
    await editProductCart(e.target.id.split('-')[1], 'minus')
}

const handleLimit = (e, limit, page) => {
    let link = ''
    const setLimit = e.value
    if (category) link += `&category=${category}`
    if (status) link += `&status=${status}`
    if (sort) link += `&sort=${sort}`
    sessionStorage.setItem('filters', JSON.stringify({ category, status, sort }))
    if (manualChange)
        window.location.href = `/products?limit=${setLimit ? setLimit : 10}&page=${1}${link}`
}

const handleCategory = (e, limit, page) => {
    let link = ''
    category = e.value
    if (category) link += `&category=${category}`
    if (status) link += `&status=${status}`
    if (sort) link += `&sort=${sort}`
    sessionStorage.setItem('filters', JSON.stringify({ category, status, sort }))
    if (manualChange) window.location.href = `/products?limit=${limit}&page=${1}${link}`
}

const handleStatus = (e, limit, page) => {
    let link = ''
    status = e.value
    if (category) link += `&category=${category}`
    if (status) link += `&status=${status}`
    if (sort) link += `&sort=${sort}`
    sessionStorage.setItem('filters', JSON.stringify({ category, status, sort }))
    if (manualChange) window.location.href = `/products?limit=${limit}&page=${1}${link}`
}

const handleSort = (e, limit, page) => {
    let link = ''
    sort = e.value
    if (category) link += `&category=${category}`
    if (status) link += `&status=${status}`
    if (sort) link += `&sort=${sort}`
    sessionStorage.setItem('filters', JSON.stringify({ category, status, sort }))
    if (manualChange) window.location.href = `/products?limit=${limit}&page=${page}${link}`
}

const handleTotalCart = () => {
    console.log('Hello')
}

const setTotalCartValue = async () => {
    let cart = sessionStorage.getItem('cart')
    if (cart) {
        cart = JSON.parse(cart)
    } else {
        cart = await postCart(cart)
    }
    cart?.products?.forEach(e => {
        const id = e.product._id
        const stock = e.product.stock
		const quantity = e.quantity
		const plus = document.getElementById(`plus-${id}`)
		if (quantity >= stock) {
			plus.removeEventListener('click', handlePlus)
			plus.setAttribute('class', 'fa fa-plus cart-button-disable')
		}
        const counter = document.getElementById(`counter-${id}`)
        const minus = document.getElementById(`minus-${id}`)
        counter.innerText = quantity
        minus.setAttribute('class', 'fa fa-minus cart-button')
        minus.addEventListener('click', handleMinus)
    })
    const cartLength = document.getElementById('cart-length')
    cartLength.innerText = cart?.products?.reduce((acc, curr) => acc + curr.quantity, 0)
}

setTotalCartValue()

window.addEventListener('load', function () {
    const limitInput = document.getElementById('limit')
    if (limitInput) {
        const limit = limitInput.getAttribute('limit')
        const categorySelect = document.getElementById('category')
        const statusSelect = document.getElementById('status')
        const sortSelect = document.getElementById('sort')
        let filters = sessionStorage.getItem('filters')
        if (filters) {
            filters = JSON.parse(filters)
            if (filters.hasOwnProperty('category')) {
                category = filters.category
            } else {
                category = ''
            }
            if (filters.hasOwnProperty('status')) {
                status = filters.status
            } else {
                status = ''
            }
            if (filters.hasOwnProperty('sort')) {
                sort = filters.sort
            } else {
                sort = ''
            }
            categorySelect.value = category
            statusSelect.value = status
            sortSelect.value = sort
            limitInput.value = limit
        }
        manualChange = true
        const products = document.getElementsByClassName('fa fa-plus cart-button')
        for (const iterator of products) {
            iterator.addEventListener('click', handlePlus)
        }
    }
})