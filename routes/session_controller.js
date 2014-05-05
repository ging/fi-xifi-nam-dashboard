var OAuth2 = require('./../lib/oauth2').OAuth2;
var oauth_config = require('./../config').oauth;
var oauth_client = new OAuth2(oauth_config.client_id,
                    oauth_config.client_secret,
                    oauth_config.account_server,
                    '/oauth2/authorize',
                    '/oauth2/token',
                    oauth_config.callbackURL);
var crypto = require('crypto');
var secret = "a3455ddjhhjpsdddiga989808989ohsd1gfa";

// Middleware: Login is required:
exports.requiresLogin = function (req, res, next) {

    var tok;

    try {
        tok = decrypt(req.cookies.oauth_token);
    } catch (err) {
        req.cookies.oauth_token = undefined;
    }


    if(!req.cookies.oauth_token) {
        var path = oauth_client.getAuthorizeUrl();
        res.redirect(path);
    } else {
        next();
    }
};

// Login
exports.new = function(req, res) {

    oauth_client.getOAuthAccessToken(
        req.query.code,
        function (e, results){
            res.cookie('oauth_token', encrypt(results.access_token));
            res.cookie('expires_in', results.expires_in);
            res.redirect('/');
        }
    );;
};

// Logout
exports.destroy = function(req, res) {
    res.clearCookie('oauth_token');
    res.clearCookie('expires_in');
    res.redirect('/');
};

function encrypt(str){
  var cipher = crypto.createCipher('aes-256-cbc',secret);
  var crypted = cipher.update(str,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(str){
  var decipher = crypto.createDecipher('aes-256-cbc',secret);
  var dec = decipher.update(str,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}