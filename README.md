## API Bate Papo Uol

API Bate Papo Uol is the backend with mongodb for the best brazilian website chat, you can connect to anyone just insert you name and chat.
Below are the implemented features:

- Insert participants
- Get participants
- Send global and private messages to chat
- Keep and check participants connection
- Kick afk participants

## Endpoints

<details>
    <summary>
        <strong style="color:green;">POST</strong> /participants
    </summary>
send body request like this:

```json
{
  "name": "joe"
}
```

- it returns status <strong style="color:green;">201</strong> for success

- it returns status <strong style="color:purple;">422</strong> for empty name

- it returns status <strong style="color:purple;">409</strong> for name already in use

</details>
<details>
    <summary>
        <strong style="color:orange;">GET</strong> /participants
    </summary>
- it returns an array like this:

```json
[
  { "name": "joe", "lastStatus": 1643488289206 },
  { "name": "mary", "lastStatus": 1643488289216 }
]
```

- last status is UTC timestamp

</details>
<details>
    <summary>
        <strong style="color:green;">POST</strong> /messages
    </summary>

- send a body like this:

```json
{
  "to": "Maria",
  "text": "Hello guys",
  "type": "private_message"
}
```

- send username that is sending the message on headers

For the following validations you get status <strong style="color:purple;">422</strong>:

- type needs to be 'message' or 'private_message'

- to and text can't be empty

- username from headers

- "to" needs to be "Todos" (for all) or a connected user

- it returns status <strong style="color:green;">201</strong> for success

</details>
<details>
    <summary>
        <strong style="color:orange;">GET</strong> /messages
    </summary>

- it returns an array like this:

```json
[
  {
    "_id": "61f2f8d996187a6d33d7427f",
    "from": "jorel",
    "to": "Todos",
    "text": "entra na sala...",
    "type": "status",
    "time": "15:56:09"
  },
  {
    "_id": "61f2f90defb14acd481c9563",
    "from": "joel",
    "to": "Todos",
    "text": "entra na sala...",
    "type": "status",
    "time": "15:57:01"
  },
]
```

- you can limit the number of messages by query messages?limit=100

- send a connected user on headers, so you can recieve private messages

</details>
<details>
    <summary>
        <strong style="color:red;">DELETE</strong> /messages/message_id
    </summary>

- send message's owner username on headers

- send message id by path params

- it returns status <strong style="color:green;">204</strong> for success

- it returns status <strong style="color:purple;">404</strong> for invalid message id

- it returns status <strong style="color:purple;">401</strong> for user not owner

</details>
<details>
    <summary>
        <strong style="color:blue;">PUT</strong> /messages/message_id
    </summary>

- send a body like this:

```json
{
  "to": "Maria",
  "text": "Hello guys",
  "type": "private_message"
}
```

- send username that is sending the message on headers

For the following validations you get status <strong style="color:purple;">422</strong>:

- type needs to be 'message' or 'private_message'

- to and text can't be empty

- username from headers

- "to" needs to be "Todos" (for all) or a connected user

- send message id by path params

- it returns status <strong style="color:green;">204</strong> for success

- it returns status <strong style="color:purple;">404</strong> for invalid message id

- it returns status <strong style="color:purple;">401</strong> for user not owner

</details>
<details>
    <summary>
        <strong style="color:green;">POST</strong> /status
    </summary>
(keep connection) need be sent every 10 seconds

- send user on headers

- it returns status <strong style="color:green">200</strong> for success

- it returns status <strong style="color:purple">404</strong> when user isn't connected already

</details>

## Technologies

<a title="JavaScript" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> 
</a>
<a title="Node JS" href="https://nodejs.org" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> 
</a>
<a title="Express JS" href="https://expressjs.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg" alt="expressjs" width="40" height="40"/> 
</a>
<a title="Mongodb" href="https://mongodb.com/" target="_blank" rel="noreferrer"> 
    <img src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" alt="mongodb" width="40" height="40"/> 
</a>

## Requirements

### [npm](https://www.npmjs.com/)

<details>
    <summary>install npm</summary>

```bash
wget -qO- <https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh> | bash

## Ou esse comando
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Feche e abra o terminal novamente
nvm install --lts
nvm use --lts
# Verificar a versão do node
node --version # Deve exibir v14.16.1
# Verificar a versão do npm
npm -v
```
</details>

### [mongodb](https://www.mongodb.com/)

<details>
    <summary>install mongodb</summary>

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
mkdir ~/.mongo
```
* Se falhar execute o seguinte comando e tente novamente o primeiro

```bash
sudo apt-get install gnupg wget
```
</details>


## How to run

1. Clone this repository
2. Install dependencies

```bash
npm i
```

3. Run mongodb with

```bash
mongod --dbpath ~/.mongo
```

4. set you .env file

5. Run the project with

```bash
npm run start
```

6. Run the project in development mode (nodemon)

```bash
npm run start:dev
```
