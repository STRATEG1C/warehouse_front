# Как поднять проект локально

1. Склонировать этот репозиторий
2. Установить зависимости
#### `npm install`
3. Запустить проект в дев режиме
#### `npm start`

# Инструкция как сделать чат приложение на AWS c использованием Amplify

Для создания чатов на [AWS](https://aws.amazon.com/ru/) в этом примере использоваться сервис [AWS Amplify](https://aws.amazon.com/ru/amplify/), и библиотека для frontend [aws-amplify](https://docs.amplify.aws/start/q/integration/react), что позволяет в короткие сроки построить backend для мобильных и веб приложений.

Авторизация и регистрация пользователей происходит через сервис [Amazon Cognito](https://aws.amazon.com/ru/cognito/) который включает регистрацию, авторизацию пользователей по стандартной процедуре и через социальные сети и отправку писем подтверждения.

<b style='color:red'>ВАЖНО!</b> В этом случае необходимо сразу закладывать что пользователи приложения будут регистрироваться и авторизоваться именно с помощью сервиса AWS Cognito. В противном случае API нужно будет делать полностью открытым и управлять доступом внутри приложения.

Запросы к backend реализованы с помощью [GraphQL API](https://docs.amplify.aws/lib/graphqlapi/getting-started/q/platform/js), предоставляемый Amplify, и, который является удобным решением для frontend разработки.

Для хранения записей используется [DynamoDB](https://aws.amazon.com/ru/dynamodb/), который является JSON базой данных, и автоматически создается при использовании GraphQL API.

Схема архитектуры приложения показана на рисунке

![Architecture image](./images/architecture.jpg?raw=true)

Схема организации базы данных примера представлена на рисунке

![Chat app scheme](./images/chat-app-scheme.jpg?raw=true)

## 1. Подготовка окружения

Если в проекте уже используется amplify, можно перейти к пункту 2 “Добавление авторизации”.

- 1.1. Развернуть фронтенд приложение (react, react-native, vue, js).
- 1.2. Установить глобально amplify cli для работы с сервисами aws из консоли, выполнив команду.

`npm i -g @aws-amplify/cli`

- 1.3 Добавить пользователя (клиента) для разработки и получить ключи доступа (accessKey и secretKey), выполнив команду.

`amplify configure`

Сохранить на машине предоставляемый csv документ с доступами к клиенту.

- 1.4. В папке с проектом инициализировать backend для приложения.

`amplify init`

- Ввести имя проекта.
- Ввести имя текущего env (по умолчанию dev).
- Выбрать свой редактор (PHPStorm нет, выбираем none)
- Выбрать тип нашего приложения (javascript)
- Выбрать фреймворк, который мы используем (React)
- Даем еще пару настроек, связанных с React
- Выбрать тип аутентификации нашего приложения для связи с AWS сервисами при разработке (AWS profile).
- Выбрать профиль, который мы создали ранее.

<br />

- 1.5 В папке с проектом установить библиотеку aws-amplify для работы с aws сервисами из кода.

`npm install aws-amplify`

## 2. Добавление авторизации
Если уже есть настроенный User Pool на AWS Cognito, его можно переиспользовать, [как здесь](https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource) и сразу перейти к пункту 3 “Добавление API” .

- 2.1 Настроить Cognito User Pool через web-интерфейс AWS и перейти к пункту 3.
- 2.2 Если настраивать Cognito User Pool через amplify cli в приложении, добавить Auth категорию с помощью команды

`amplify add auth`

- Выбрать дефолтную конфигурацию
- Выбрать авторизацию по email
- Пропустить расширенные настройки

<br>

- 2.3 Загрузить изменения для инициализации необходимых сервисов на AWS с помощью команды

`amplify push`

Посмотреть добавленные сервисы и редактировать настройки проекта можно через web-интерфейс. Открыть его можно, выполнив в приложении команду

`amplify console`

## 3. Добавление API

- 3.1 Добавить категорию API с помощью команды

`amplify add request`

- Выбрать тип API (GraphQL API)
- Ввести имя API для отображения в AWS консоле
- Выбрать тип авторизации по API key
- Согласиться со стандартными настроками
- В настройке шаблона схемы выбираем Single object… “Todo”...
- На вопросе хотим ли начать редактирование схемы ответить Yes

В директории проекта появится папка amplify с такой структурой, как на рисунке 3.1.

![Folder structure](./images/folder-structure.png?raw=true)

- 3.2 Открыть файл схем по пути /amplify/request/{apiName}/schema.graphql (apiName - на картинке ChatApi) и поменять его содержимое слудующее:

```
type User
@searchable
@model {
 id: ID!
 email: String!
 username: String!
 status: String
 conversations: [UserConversation] @connection(keyName: "byUser", fields: ["id"])
}

type UserConversation
@model
@key(name: "byUser", fields: ["userID", "chatRoomID"])
@key(name: "byChatRoom", fields: ["chatRoomID", "userID"]) {
 id: ID!
 userID: ID!
 chatRoomID: ID!
 user: User @connection(fields: ["userID"])
 chatRoom: ChatRoom @connection(fields: ["chatRoomID"])
 isWaitForAccept: Boolean!
 isAccepted: Boolean!
 lastSeenTime: String
}

type ChatRoom @model {
 id: ID!
 initiatorID: ID!
 subscriberID: ID!
 initiator: User @connection(fields: ["initiatorID"])
 subscriber: User @connection(fields: ["subscriberID"])
 lastMessageID: ID
 lastMessage: Message @connection(fields: ["lastMessageID"])
 messages: [Message]  @connection(keyName: "byChatRoom", fields: ["id"], limit: 30)
}

type Message
@model
@key(
 name: "byChatRoom",
 fields: ["chatRoomID", "createdAt"],
 queryField: "messagesByChatRoom") {
 id: ID!
 createdAt: String!
 content: String!
 userID: ID!
 chatRoomID: ID!
 user: User @connection(fields: ["userID"])
 chatRoom: ChatRoom @connection(fields: ["chatRoomID"])
}

type Subscription {
 onNewMessageInChat(chatRoomID: ID!): Message
 @aws_subscribe(mutations: ["createMessage"])

 onCreateChatRoomBySubscriberId(subscriberID: ID!): ChatRoom
 @aws_subscribe(mutations: ["createChatRoom"])

 onUpdateChatRoomBySubscriberId(subscriberID: ID!): ChatRoom
 @aws_subscribe(mutations: ["updateChatRoom"])

 onUpdateChatRoomByInitiatorId(initiatorID: ID!): ChatRoom
 @aws_subscribe(mutations: ["updateChatRoom"])

 onCreateUserConversationByUserId(userID: ID!): UserConversation
 @aws_subscribe(mutations: ["createUserConversation"])

 onUpdateUserConversationByUserId(userID: ID!): UserConversation
 @aws_subscribe(mutations: ["updateUserConversation"])
}

```

- @model - означает, что на основании сущности будет создана таблица.
- @connection - означает, что содержимое этого поля будет взято из связанной таблицы.
- @key - означает индекс. По нему можно делать @connection из других таблиц, или же делать запросы с сортировкой по этому ключу.
- @searchable - означает, что на поле будет создан полнотекстовый индекс и запрос для поиска по слову или части слова.

<br>
- 3.3 Загрузить изменения и согласиться со стандартными настройками.

`amplify push`

После публикации изменений API, в проекте появится папка graphql с запросами к API, как на рисунке 3.2.

![Queries](https://github.com/STRATEG1C/react-chat-aws-amplify/blob/master/images/queries.png?raw=true)

- mutations.js - запросы на создание, редактирование и удаление данных.
- queries.js - запросы на получение данных.
- subscriptions.js - подписки на создание, обновление, удаление сущностей.

### Мы создали API для чатов!

## 4. Построение Frontend

Пример реализации приложения чатов на React + Amplify можно найти в этом репозитории :)

Запросы к DynamoDB вынесены в отдельные сервисы. Их возможная реализация расположена в файлах ниже.

### [AuthService](./src/providers/AuthProvider.js)
  Сервис работает с AWS Cognito и имеет методы регистрации, авторизации и выхода пользователя из системы 
  <br>
  - register - регистрация, создание нового пользователя в UserPool сервиса AWS Cognito
  - login - авторизация пользователя, получение информации с Cognito и токена
  - logout - выход из системы, удаление токена, выданного Cognito

### [ChatService](./src/providers/ChatProvider.js)
  Сервис работает со всем, что связано с чатами.
  <br>
  - createChatRoom - создание чат комнаты между инициатором и подписчиком
  - createUserConversation - добавление пользователя в чат комнату, создание подписки на чат. Нужно для отображения чата у пользователя.
  - updateConversation - обновление подписки на чат, на пример, пользователь подтвердил участие в чате или отклонил.
  - getChatRoom - получение информации о чат комнате
  - getUserConversations - получение списка подписок на чаты пользователя для отображения списка его чатов
  - getBannedChats - получение чатов, которые пользователь отклонил
  - getUserConversation - получение одной подписки на чат, на пример, для проверки, является ли пользователь его участником
  - getMessagesByChatId - получение списка сообщений для конкретной чат комнаты
  - updateChatRoom - обновление информации о чат комнате, на пример обновить последнее сообщение
  - createChatMessage - отправка сообщения в комнату
  - subscribeToChatRoom - подписка на отслеживание новых сообщений в конкретной комнате и показа их на экране
  - subscribeToUpdateRoomBySubscriberId - подписка на отслеживание новых сообщений в чатах, где пользователь есть подписчиком
  - subscribeToUpdateRoomByInitiatorId - подписка на отслеживание новых сообщений в чатах, где пользователь есть инициатором
  - subscribeToUpdateOwnConversation - подписка на обновление подписок пользователя на чаты, на пример, если пользователь отклонил чат, обновить список

### [UserService](./src/providers/UserProvider.js)
  Сервис работает со всеми пользователями системы.
  <br>
  - create - создание пользователя, после первой успешной авторизации
  - getById - получение пользователя
  - getList - получение списка пользователей
  - searchUser - поиск пользователей по username по части слова или целому слову

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
