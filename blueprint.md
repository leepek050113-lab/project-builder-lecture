# Project Blueprint

## Overview

A web application that allows users to browse and search for Steam game reviews. The application will feature a modern, responsive design and will be built using HTML, CSS, and vanilla JavaScript.

## Current Implementation

### Features
*   Displays a list of games from a predefined dataset.
*   Separates games into a "Hot Right Now" carousel and a main grid.
*   Features a 10-minute auto-refresh timer for the "Hot Right Now" section.
*   Allows users to switch between Light and Dark themes.
*   Supports English and Korean languages with full descriptions for all games.
*   Features a search bar to filter games by name.
*   Clicking a game card opens a modal with details (Title, Tags, Description, Video Trailer link).
*   A refresh button to shuffle the main list of games, while the "Hot" section remains static.

### Design & Style
*   Modern, clean user interface with a countdown timer.
*   Responsive layout with appropriately sized game cards.
*   Visual distinction between light and dark modes.
*   Interactive elements with hover effects.

## Development Plan (Current Request)

### 1. Expand Game Library
*   **Goal:** Significantly increase the number of games available in the application to provide more content and variety for users.
*   **Action:**
    *   Add a substantial number of new, popular, and diverse games to the `allGames` array in `main.js`.
    *   For each new game, add its corresponding English and Korean description to the `translations` object.
    *   Ensure all new game objects have the correct `appId`, `videoId`, `tags`, and `descriptionKey`.
