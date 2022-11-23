module.exports = {
    baseUrl
    // baseUrl: function (req) {
    //     const url = req.protocol+"://"+req.headers.host;
    //     return url;
	// },
}
function baseUrl(req){
    const url = req.protocol+"://"+req.headers.host;
     return url;
}
   
