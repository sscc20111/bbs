const LoginTokenExpiry = (tokenKeyName = "token") => {
    const localLoginToken = localStorage.getItem(tokenKeyName);
    if (!localLoginToken) return false;

    const StringToObject = JSON.parse(localLoginToken);
    if (Date.now() > StringToObject.expire) {
    localStorage.removeItem(tokenKeyName);
    return false;
    } else return true;
}

export default LoginTokenExpiry