import NextHead from "next/head";

const AuthHead = props => (
  <NextHead>
    <meta charSet="UTF-8"></meta>
    <title>Authentication Login Form</title>
    <link rel="stylesheet" href="/static/style/auth.css"></link> 
    <script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
    <script src="/static/scripts/auth.js"></script>  
    <script src="/static/config/config.json"></script> 
    <script src="/static/scripts/config.js"></script>  
  </NextHead>
);

export default AuthHead;