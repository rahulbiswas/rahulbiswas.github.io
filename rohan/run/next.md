# Adding Ghost Movement: Instructions

## Overview
Today you'll make the ghost move around the maze by implementing a random movement system. This will make the game more challenging and fun!

## Why We Add Ghost Movement
Adding movement to the ghost makes your game more dynamic:
1. **Challenge**: A moving ghost gives the player something to avoid
2. **Gameplay**: It creates excitement as the player tries to navigate while avoiding the ghost
3. **Game Logic**: You'll learn to use timers to create continuous action in your game

## Understanding the Current Timer
You already have a timer set up in your code that runs every 1 second, but right now it only outputs a message to the console. You'll add your ghost movement code inside this timer function.

## Steps for Implementing Ghost Movement

1. **Find where the ghost can move**
   - For each move, check all four possible directions (up, down, left, right)
   - Only move into spaces where MAZE[x][y] equals 0 (open path)
   - Create an array to store all possible moves

2. **Choose a random direction**
   - Use `randInt()` or `Math.random()` to select a random direction from your array of possible moves
   - This will make the ghost's movement unpredictable

3. **Move the ghost**
   - Update the ghost's position (gx, gy) based on the chosen direction
   - Remember: moving up decreases x, moving down increases x
   - Moving left decreases y, moving right increases y

4. **Check if the player is caught**
   - Use the `checkEaten()` function that's already in your code
   - This resets the player if the ghost catches them

5. **Redraw the game**
   - Call `drawBoxes()` to update the display with the new positions

## Extension Ideas
After you've implemented random movement, consider these improvements:
1. Make the ghost smarter by having it move toward the player
2. Add multiple ghosts with different colors
3. Make the ghost move faster as the game progresses

## Testing Your Game
After implementing ghost movement:
1. Reload your game in the browser
2. Watch how the ghost moves around
3. Try to avoid the ghost while navigating the maze
4. Check that the player resets when caught by the ghost

Good luck with your programming!