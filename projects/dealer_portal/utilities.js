const redirectLoggedInUser = () => {
    window.location.replace('/dealer_portal/home')
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

const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

const createCookie = (name, value) => {
    document.cookie = name + "=" + value + ";"
}

// Check existing cookies
const checkForLoggedInUser = () => {
    const cookies = getExistingCookies()
    let username_cookie = getCookieData('username', cookies),
        session_id_cookie = getCookieData('session_id', cookies)
    if (username_cookie !== null && session_id_cookie !== null) {
        socket.emit('validate_login_cookie', [username_cookie, session_id_cookie])
    } else {
        document.getElementById('login-page').style.display = "Block"
    }
}