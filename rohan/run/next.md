# Refactoring Code into Separate Files: Instructions

## Overview
Today you'll be refactoring your maze game by splitting your code into three separate files:
1. HTML (index.html)
2. CSS (styles.css)
3. JavaScript (game.js)

## Why We Do This
Splitting your code into separate files is an important practice in web development for several reasons:

1. **Organization**: Each file has a specific purpose, making your codebase easier to navigate.
   - HTML: Structure of the page
   - CSS: Styling and appearance
   - JavaScript: Game logic and behavior

2. **Maintenance**: When you need to change something, you'll know exactly which file to edit.
   - Need to change how the game looks? Edit the CSS.
   - Need to change how the game behaves? Edit the JavaScript.

4. **Reusability**: You can reuse your CSS and JavaScript files across multiple HTML pages.

5. **Loading Performance**: Browsers can cache separate files, potentially making your website load faster.

## Steps to Take

1. Create three new files:
   - index.html
   - styles.css
   - game.js

2. For the HTML file:
   - Keep only the basic structure of the page
   - Add a link to the CSS file in the `<head>` section
   - Add a script tag linking to the JavaScript file at the end of the `<body>` section

3. For the CSS file:
   - Move all style-related code (everything inside the `<style>` tags) here

4. For the JavaScript file:
   - Move all JavaScript code (everything inside the `<script>` tags) here

5. Test your game to make sure everything still works after the refactoring

## After Refactoring

Once you've completed this refactoring, you'll have a more organized project that will be easier to expand as you add more features to your game. This is how professional web developers structure their projects!

# Introduction to JavaScript Timers

## Overview
JavaScript timers allow you to schedule code to run at specific times - either once after a delay or repeatedly at intervals. You'll use these to control ghost movement in future lessons.

## Two Main Types of Timers

1. **setTimeout** - Runs code once after a specified delay
   - Example use: Making something happen after the player does something
   - Like a time bomb with a fuse

2. **setInterval** - Runs code repeatedly at a specified interval
   - Example use: Moving a ghost every second
   - Like a ticking clock

## How to Use setTimeout

```javascript
// Basic structure
setTimeout(function() {
    // Code to run after delay
}, timeInMilliseconds);
```

## How to Use setInterval

```javascript
// Basic structure
let timerName = setInterval(function() {
    // Code to run repeatedly
}, timeInMilliseconds);

// To stop the timer later
clearInterval(timerName);
```

## Experiment with Timers

After refactoring your code, try adding some simple timer examples to your game.js file. Use console.log statements to see them working (press F12 to open the console in your browser).

These timer concepts will be the foundation for adding movement to your ghost in future lessons!