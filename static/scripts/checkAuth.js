function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

const authCookieName = "__RCOPSOSO__";

$( window, document ).ready(function() {
  const sessionID = getCookie(authCookieName);
  if (typeof sessionID === 'undefined' || sessionID === 'null' ) {
    window.location.href = '/';
  }
});