# The sample Chat application

## Implement the basic functionality of the chat application:

 - Authentication (throw authentication service like https://github.com/DmitryLogunov/fake-sessions)
 - Possibility to add new comments/notes to maintenance/incident chats
 - The view of comments/incidents history for current  maintenance/incident chat
 - Subscribing to chat flow and viewing new comments

## Requirements

The application is needed next services to work:

 - authentication service
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
