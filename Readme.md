# The sample Chat application

## Implement the basic functionality of the chat application:

 - Authentication (throw SRE API v3 service using the interface of the new API v3 Session service)
 - Possibility to add new comments/notes to maintenance/incident chats
 - The view of comments/incidents history for current  maintenance/incident chat
 - Subscribing to chat flow and viewing new comments

## Requirements

The application is needed next API v3 services to work:

 - SRE API v3 service
 - dictionaries
 - accounts
 - sessions
 - comments

## Usage

1. Copy config.json.example -> /data/configuration/config.json and configure it

2. Build and run:

```
yarn 

yarn start
```
3. The application should be available on 3000 port. Open in browser:

 ```
  http://localhost:3000/
 ```
