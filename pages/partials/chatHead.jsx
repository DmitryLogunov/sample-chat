import NextHead from "next/head";

const ChatHead = props => (
  <NextHead>
    <meta charSet="UTF-8"></meta>
    <title>Chat</title>    
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"></link>     
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>   
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="/static/style/main.css"></link>  
    <script src="/static/scripts/checkAuth.js"></script>
  </NextHead>
);

export default ChatHead;