# Introduction
Hint + input = Hinput
It is a small tool, which give hint and suggestions.

# Installation
> yarn add hintput

> npm i hintput


# Usage
use is just like an input box.
You need to function, if you want to retrieve the value of input

```jsx
  const items = ['james','john doe', 'jane doe'];

        <label htmlFor="favorite">Favorites: </label>
        <Hinput
          placeholder="favorite"
          name="favorite"
          items={items}
          handleChange={handleChange}
          handleBlur={handleBlur}
          numberOfSuggestions={3}
        />
```