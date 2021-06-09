# Introduction
Hint + input = Hintput
It is a small tool, which give hint and suggestions.

# Installation
> yarn add hintput

> npm i hintput

# Example:
https://rhnh.github.io/hintput/

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