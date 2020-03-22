# cookit-BE

## About

This is my self-study project to learn how to build REST API with Node/Express.js. The ambition is to create something like a recipe social platform where people can share recipes, follow other users etc.

## Run the API locally

`nodemon server.js`

## Routes

### Get all recipes

`GET` `/api/v1/recipes`

### Get single recipe

`GET` `/api/v1/recipes/:recipeId`

### Create recipe

`POST` `/api/v1/recipes`

Request body:

```javascript
{
    name: String,
    description: String,
    ingredients: [
        {
            name: String,
            amount: Number,
            unit: String
            }
        ],
    instructions: String,
    duration: Number,
    public: Boolean
}
```

### Update recipe

`PUT` `/api/v1/recipes/:recipeId`

Request body: same as Create recipe

### Delete recipe

`DELETE` `/api/v1/recipes/:recipeId`

### Upload photo for recipe

`PUT` `/api/v1/recipes/:recipeId/photo`

### Register user

`POST` `api/v1/auth/register`

### Login user

`POST` `/api/v1/auth/login`

### Get current logged in user

`GET` `/api/v1/auth/me`

### Log user out / clear cookie

`GET` `/api/v1/auth/logout`
