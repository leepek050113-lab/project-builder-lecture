document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.body.classList.add(currentTheme + '-mode');
    themeSwitcher.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeSwitcher.addEventListener('click', () => {
        let theme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme + '-mode');
        themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    });

    // Existing language switcher logic
    const langKo = document.getElementById('lang-ko');
    const langEn = document.getElementById('lang-en');

    langKo.addEventListener('click', () => setLanguage('ko'));
    langEn.addEventListener('click', () => setLanguage('en'));

    function setLanguage(lang) {
        // In a real app, you would load the correct language file
        // or change text content dynamically.
        console.log(`Language set to ${lang}`);
        // For demonstration, we'll just update the placeholder
        const searchInput = document.getElementById('searchInput');
        if (lang === 'ko') {
            searchInput.placeholder = '게임 검색...';
        } else {
            searchInput.placeholder = 'Search for a game...';
        }
    }

    // Placeholder for game reviews - in a real app, you'd fetch this data
    const gameReviews = document.getElementById('gameReviews');
    const games = [
        { name: 'Stardew Valley', review: 'A relaxing farming simulation game.', image: 'https://via.placeholder.com/300x150.png?text=Stardew+Valley' },
        { name: 'Hades', review: 'An action-packed roguelike with a great story.', image: 'https://via.placeholder.com/300x150.png?text=Hades' },
        { name: 'Celeste', review: 'A challenging platformer with a touching narrative.', image: 'https://via.placeholder.com/300x150.png?text=Celeste' }
    ];

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <img src="${game.image}" alt="${game.name}">
            <h2>${game.name}</h2>
            <p>${game.review}</p>
        `;
        gameReviews.appendChild(card);
    });
});
