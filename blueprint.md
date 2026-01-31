# Project Blueprint

## Overview

A web application that allows users to browse and search for Steam game reviews. The application will feature a modern, responsive design and will be built using HTML, CSS, and vanilla JavaScript.

## Current Implementation

### Features
*   Displays a list of games from a predefined dataset.
*   Separates games into a "Hot Right Now" carousel and a main grid.
*   Allows users to switch between Light and Dark themes.
*   Supports English and Korean languages.
*   Features a search bar to filter games by name.
*   Clicking a game card opens a modal with details (Title, Tags, Description, Video Trailer link).
*   A refresh button to shuffle the main list of games.

### Design & Style
*   Modern, clean user interface.
*   Responsive layout that adapts to different screen sizes.
*   Visual distinction between light and dark modes.
*   Interactive elements with hover effects.
*   Reduced card sizes for a more compact view.

## Development Plan (Current Request)

### 1. Add Missing Game Descriptions
*   **Goal:** Ensure every game in the database has a descriptive text available in the modal.
*   **Action:**
    *   Write compelling descriptions for all games currently lacking one.
    *   Add these descriptions to the `translations` object in `main.js` for both English and Korean.
    *   Update the `allGames` array to link each game to its corresponding description key.

### 2. Fix Refresh Logic
*   **Goal:** Prevent the "Hot Right Now" section from changing when the user clicks the refresh button.
*   **Action:**
    *   Refactor the JavaScript logic in `main.js`.
    *   On initial page load, shuffle the list and select the "Hot" games. These will remain fixed.
    *   The refresh button will now only shuffle and re-render the *main* list of games, leaving the "Hot" section untouched.
