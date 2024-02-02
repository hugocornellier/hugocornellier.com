const redirectLoggedInUser = () => {
    window.location.replace('/dealer_portal/hometest')
}

const redirectLoggedOutUser = () => {
    window.location.replace('/dealer_portal')
}

const getExistingCookies = () => {
    let cookie_dict = {}
    let cookie_str = String(document.cookie)
    if (cookie_str.length > 0 && cookie_str.includes(";")) {
        cookie_str.split(';').forEach((cookie) => {
            const split = String(cookie).split('=')
            cookie_dict[split[0].trim()] = split[1].trim()
        });
    }
    return cookie_dict
}

const getCookieData = (name, cookies) => {
    return (name in cookies) ? cookies[name] : null
}

const createCookie = (name, value) => {
    document.cookie = name + "=" + value + ";"
}

const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

const deleteCookiesAndRedirect = () => {
    deleteCookie('username')
    deleteCookie('session_id')
    redirectLoggedOutUser()
}

// Check existing cookies
const checkForLoggedInUser = () => {
    const cookies = getExistingCookies()
    let username_cookie = getCookieData('username', cookies),
        session_id_cookie = getCookieData('session_id', cookies)
    if (username_cookie !== null && session_id_cookie !== null) {
        socket.emit('validate', [username_cookie, session_id_cookie])
    } else {
        document.getElementById('login-page').style.display = "Block"
    }
}

const setBtnToLoading = (btn) => {
    btn.innerText = "Loading..."
    btn.style.background = 'black'
}

const setBtnToSuccess = (btn) => {
    btn.innerText = "Success!"
    btn.style.background = 'green'
}

const setBtnToFailure = (btn) => {
    btn.innerText = "Failure"
    btn.style.background = 'red'
}

const setBtnToDefault = (btn) => {
    btn.innerText = btn.getAttribute('data-value')
    btn.style.background = ''
}