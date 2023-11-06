const LoginToken = (userName) => {
    const tts = 3600000;
    const tokenValue = {
    user_data: userName,
    expire: Date.now() + tts, // 토큰 생산일 기준 + 1일 만료기간
    };
    const objectToString = JSON.stringify(tokenValue);
    localStorage.setItem('token', objectToString);

}
export default LoginToken