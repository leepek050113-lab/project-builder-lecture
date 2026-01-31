class GameReviewCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'developer', 'rating', 'summary'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .card {
                    background-color: #2a475e;
                    border-radius: 4px;
                    padding: 1rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    height: 100%;
                    box-sizing: border-box;
                }
                h3 {
                    color: #66c0f4;
                    margin-top: 0;
                }
                p {
                    margin-bottom: 0.5rem;
                }
            </style>
            <div class="card">
                <h3 data-key="title">${this.getAttribute('title')}</h3>
                <p><strong data-key="developer-label">Developer:</strong> ${this.getAttribute('developer')}</p>
                <p><strong data-key="rating-label">Rating:</strong> ${this.getAttribute('rating')}</p>
                <p data-key="summary">${this.getAttribute('summary')}</p>
            </div>
        `;
    }
}

customElements.define('game-review-card', GameReviewCard);

const translations = {
    en: {
        pageTitle: "Steam Game Reviews",
        searchPlaceholder: "Search for a game...",
        developerLabel: "Developer:",
        ratingLabel: "Rating:",
        reviews: [
            {
                title: 'Portal 2',
                developer: 'Valve',
                rating: 'Overwhelmingly Positive',
                summary: 'A puzzle-platform game developed and published by Valve. It was released in April 2011 for Windows, Mac OS X, Linux, PlayStation 3, and Xbox 360.'
            },
            {
                title: 'Stardew Valley',
                developer: 'ConcernedApe',
                rating: 'Overwhelmingly Positive',
                summary: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.'
            },
            {
                title: 'The Witcher 3: Wild Hunt',
                developer: 'CD PROJEKT RED',
                rating: 'Overwhelmingly Positive',
                summary: 'As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.'
            },
        ]
    },
    ko: {
        pageTitle: "스팀 게임 리뷰",
        searchPlaceholder: "게임을 검색하세요...",
        developerLabel: "개발사:",
        ratingLabel: "평가:",
        reviews: [
            {
                title: '포탈 2',
                developer: 'Valve',
                rating: '압도적으로 긍정적',
                summary: 'Valve가 개발하고 퍼블리싱한 퍼즐 플랫폼 게임입니다. 2011년 4월에 Windows, Mac OS X, Linux, PlayStation 3, Xbox 360용으로 출시되었습니다.'
            },
            {
                title: '스타듀 밸리',
                developer: 'ConcernedApe',
                rating: '압도적으로 긍정적',
                summary: '당신은 스타듀 밸리에 있는 할아버지의 오래된 농장을 물려받았습니다. 물려받은 도구와 약간의 동전을 가지고 새로운 삶을 시작합니다.'
            },
            {
                title: '더 위쳐 3: 와일드 헌트',
                developer: 'CD PROJEKT RED',
                rating: '압도적으로 긍정적',
                summary: '북부 왕국 전역에서 전쟁이 계속되는 동안, 당신은 세상의 모습을 바꿀 수 있는 살아있는 무기인 예언의 아이를 추적하는 일생일대의 계약을 맺습니다.'
            },
        ]
    }
};

let currentLang = 'en';

const reviewsContainer = document.getElementById('gameReviews');
const searchInput = document.getElementById('searchInput');
const pageTitle = document.querySelector('h1');
const langKoButton = document.getElementById('lang-ko');
const langEnButton = document.getElementById('lang-en');

function renderReviews(reviews) {
    reviewsContainer.innerHTML = '';
    for (const review of reviews) {
        const reviewCard = document.createElement('game-review-card');
        reviewCard.setAttribute('title', review.title);
        reviewCard.setAttribute('developer', review.developer);
        reviewCard.setAttribute('rating', review.rating);
        reviewCard.setAttribute('summary', review.summary);
        reviewsContainer.appendChild(reviewCard);
    }
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    const t = translations[lang];
    pageTitle.textContent = t.pageTitle;
    searchInput.placeholder = t.searchPlaceholder;

    renderReviews(t.reviews);

    if (lang === 'ko') {
        langKoButton.classList.add('active');
        langEnButton.classList.remove('active');
    } else {
        langEnButton.classList.add('active');
        langKoButton.classList.remove('active');
    }
}

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredReviews = translations[currentLang].reviews.filter(review => 
        review.title.toLowerCase().includes(searchTerm)
    );
    renderReviews(filteredReviews);
});

langKoButton.addEventListener('click', () => setLanguage('ko'));
langEnButton.addEventListener('click', () => setLanguage('en'));

// Initial setup
setLanguage('en');
