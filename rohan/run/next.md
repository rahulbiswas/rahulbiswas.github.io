# Collecting Pellets: Making Them Disappear

## Today's Goal
Let's make pacman collect pellets when moving over them! When pacman moves to a spot with a pellet, that pellet should disappear.

## The Plan
In your movement code, after confirming a valid move and updating pacman's position:
1. Check if there's a pellet at pacman's new position in the PELLETS array
2. If there is a pellet there, set that spot in PELLETS to 0 to "collect" it
3. Make sure the display updates to show the pellet is gone

## Your Challenge
Once basic pellet collection is working, think about adding:
- A collection animation
- A sound effect
- A pellet counter

Hint: Think carefully about when to check for pellets - after the move is confirmed but before drawing!
