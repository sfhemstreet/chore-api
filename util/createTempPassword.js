const createTempPassword = () => {
    const pw = Math.random().toString(36).substr(2, 8);
    //console.log('generated pw',pw);
    return pw;
}
module.exports = {
    createTempPassword
}