# Project Blueprint

## Overview

A web application that allows users to browse and search for Steam game reviews. The application will feature a modern, responsive design and will be built using HTML, CSS, and vanilla JavaScript.

## Current Implementation

### Features
*   Displays a list of games from a predefined dataset.
*   Separates games into a "Hot Right Now" carousel and a main grid.
*   Allows users to switch between Light and Dark themes.
*   Supports English and Korean languages with full descriptions for all games.
*   Features a search bar to filter games by name.
*   Clicking a game card opens a modal with details (Title, Tags, Description, Video Trailer link).
*   A refresh button to shuffle the main list of games, while the "Hot" section remains static.

### Design & Style
*   Modern, clean user interface.
*   Responsive layout with appropriately sized game cards.
*   Visual distinction between light and dark modes.
*   Interactive elements with hover effects.

## Development Plan (Current Request)

### 1. Implement 10-Minute "Hot Games" Auto-Refresh
*   **Goal:** Automatically update the "Hot Right Now" section every 10 minutes to keep content fresh and dynamic.
*   **Action:**
    *   Add a visual 10-minute countdown timer next to the "Hot Right Now" title in `index.html`.
    *   Apply styling to the timer in `style.css` for better visual integration.
    *   In `main.js`, create a countdown function that updates the timer display every second.
    *   When the timer reaches `00:00`, the application will automatically:
        1.  Re-shuffle the entire list of games.
        2.  Select 10 new games for the "Hot Right Now" section.
        3.  Update the main game grid with the remaining games.
        4.  Reset the timer back to 10 minutes and start the countdown again.
