# Mini Docs API

Небольшой учебно-практический API-проект на Node.js и Express с подключением MySQL.

## Что реализовано
- получение списка документов
- получение документа по id
- создание документа
- обновление документа
- удаление документа
- базовая валидация
- обработка ошибок
- фильтрация через query params
- поиск по части названия через `LIKE`
- общий поиск по `title` и `description` через параметр `search`
- middleware для логирования запросов
- простая HTML-страница для работы с API через `fetch`

## Стек
- Node.js
- Express
- JavaScript
- MySQL
- HTML
- Fetch API

## Структура данных
Таблица `docs` содержит поля:
- `id`
- `title`
- `createdAt`
- `description`

## Запуск проекта
```bash
npm install
node app.js 
```
Сервер запускается на `http://127.0.0.1:4000`

## Основные маршруты API
- GET /docs
- GET /docs/:id
- POST /docs
- PUT /docs/:id
- DELETE /docs/:id

## Query params
Примеры:
- `GET /docs?title=Doc`
- `GET /docs?date=21.03.2026`
- `GET /docs?description=книги`
- `GET /docs?title=Doc&date=21.03.2026`
- `GET /docs?search=doc`
- `GET /docs?search=doc&date=24.03.2026`

## Что улучшено в текущей версии
- добавлено поле description
- поиск по части названия через LIKE
- общий поиск по title и description через параметр search
- конфигурация базы вынесена в .env
- улучшена демо-страница: поиск, сообщения пользователю, очистка списка

## Главная страница
- index.html — минимальная страница для загрузки, создания, изменения и удаления документов через API

### index.html
![index.html](./screen/web.png)


### MySQL / phpMyAdmin
![docs table](./screen/phpmyadmin.png)

### Thunder Client
![POST docs](./screen/Thunder.png)



