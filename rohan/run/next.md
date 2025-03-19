# Adding Pellets: Getting Started

## Today's Goal
Today you'll create a simple way to track pellets in your maze. Then you'll try drawing them yourself.

## Step 1: Create the Pellet Variable
Add this with your other variables at the top:
```javascript
let PELLETS = [];  // This will store where our pellets are
```

## Step 2: Create an Empty Pellets Array
Add this function to your code:
```javascript
// This creates an empty pellets array with the same size as the maze
function initEmptyPellets() {
  PELLETS = [];
  for (let x = 0; x < SIZE; x++) {
    PELLETS[x] = [];
    for (let y = 0; y < SIZE; y++) {
      PELLETS[x][y] = 0;  // 0 means no pellet here
    }
  }
}
```

## Step 3: Add Some Pellets by Hand
Add this function to your code:
```javascript
// This adds a few pellets to specific locations
function addSomePellets() {
  // First create empty pellets array
  initEmptyPellets();
  
  // Now add pellets at specific positions
  PELLETS[3][3] = 1;
  PELLETS[3][5] = 1;
  PELLETS[5][3] = 1;
  PELLETS[5][5] = 1;
  PELLETS[10][10] = 1;
  PELLETS[15][15] = 1;
}
```

## Step 4: Initialize Pellets When Game Starts
Add this near the beginning of your code, after you set up the canvas:
```javascript
// Add this pellets to the game
addSomePellets();
```

## Your Challenge
Now you need to figure out how to draw the pellets on the screen!

Think about:
- How can you use the `drawBox` function to draw the pellets?
- What color should the pellets be?
- Where in your code should you add the pellet drawing?

Hint: Look at how the walls are drawn and do something similar for pellets.

Good luck! Let me know if you need more hints.