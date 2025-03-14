# Day 2: Implementing Wall Collision Detection

## Goal
Today we'll improve our game by preventing our player from walking through walls and adding a move counter to track progress.

## What You'll Learn
- How to use conditional logic to check maze positions
- How to implement collision detection with walls
- How to track and display game statistics

## Instructions

1. Right now, your player can move anywhere in the maze, even through walls! Let's fix that.

2. First, add these console.log statements to understand what's happening when you move:
```javascript
// Add this to your keydown event listener
console.log("Player trying to move to position:", px, py);
console.log("What's at this position?", MAZE[px][py]);
```

3. Think about the problem:
   - Before allowing a move, we need to check if the new position would be inside a wall
   - We can use the MAZE array to check what's at any position
   - Remember that 1 means "wall" and 0 means "empty space"

4. Now, try to modify your keydown event handler to:
   - Calculate the new position the player wants to move to
   - Check if that position is a wall or not
   - Only update the player position if it's not a wall

5. Add a move counter to keep track of how many valid moves the player has made:
   - Create a variable to track moves
   - Only increment it when the player makes a successful move
   - Display it on the screen

## Hints (if you get stuck)

- You'll need to use an `if` statement to check the value at the new position
- Instead of immediately updating `px` and `py`, try storing the potential new position in temporary variables first
- Remember how we access maze positions: `MAZE[row][column]`
- To draw text on the canvas, use:
  ```javascript
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('Your text here', x, y);
  ```

## Challenge

Create a move counter with these features:
1. Add a variable at the top of your script: `let moveCount = 0;`
3. Display it on the canvas using ctx.fillText()
4. Bonus: Add a "reset" button that sets the counter and player position back to the start

## Remember
- Planning your solution before coding is important
- Break the problem down into smaller steps
- Use console.log to help you understand what's happening in your code
- Test your solution with different scenarios

Tomorrow we'll learn how to add collectible items to our maze game!​​​​​​​​​​​​​​​​