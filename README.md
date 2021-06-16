# Introduction
> It is an enhanced input field

> In other words: It is a small input field, which give hints and suggestions

> Hints + input  = Hintput


# Installation
> yarn add @ribrary/hintput

> npm i  @ribrary/hintput

# Example:
https://rhnh.github.io/hintput/

# Usage
use is just like an input box.
You need to function, if you want to retrieve the value of input
- an example
```jsx
  const items = ['james','john doe', 'jane doe'];
  <p>
        <label htmlFor="favorite">Favorites: </label>
        <Hinput
          placeholder="favorite" //optional
          name="favorite"
          items={items}
          handleChange={handleChange}
          handleBlur={handleBlur}
          numberOfSuggestions={3} //optional
          style={{color:'green',      
           width: '100%', //optional
            fontSize: '30px', //optional
            borderStyle: 'dashed', //optional
            borderRadius: '19px', //optional
            padding: '30px',}} //optional { It has  1px default border }
          className='my-custom-css' //optional   { It has  1px default border }
        />
</p>
```
----------------------------
An example for regular ```html<input type='text' />```
```jsx
<p>
        <label htmlFor="favorite">Favorites: </label>
        <input
          placeholder="favorite"
          name="favorite"
          items={items}
          handleChange={handleChange}
          handleBlur={handleBlur}
          numberOfSuggestions={3}
        />
  </p>
```

## if you want to add your own css.
```css
.hint {
  font-family: monospace; /*one font-family should be existed*/
  margin: 0;
  padding: 10px; /* this padding is needed*/
  box-sizing: border-box;
}
``