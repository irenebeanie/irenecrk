// CURRENT DEFAULT SORT METHOD (RELEASE DATE)
let currentSortMethod = 'sortOrder';

function loadCookieData() {
    fetch('/assets/cookie-data.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cookie-container');
            container.innerHTML = ''; // CLEARS CONTAINER BEFORE LOADING

            // LOAD ALL COOKIES
            const allCookies = Object.entries(data.cookies)
            .map(([name, cookie]) => ({ ...cookie, name }));

            const cookiesByRarity = {};
            allCookies.forEach(cookie => {
                const { rarity } = cookie || 'Unknown';
                if (!cookiesByRarity[rarity]) cookiesByRarity[rarity] = [];
                cookiesByRarity[rarity].push(cookie);
            });

            // DISPLAY THE COOKIES
            displayCookiesByRarity(cookiesByRarity, container);
        })

        .catch(error => {
            console.error('Error loading cookie data:', error);
        });
}

function displayCookiesByRarity(cookiesByRarity, container) {
    Object.entries(cookiesByRarity).forEach(([rarity, cookies]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'cookie-section';

        const header = document.createElement('h2');
        header.className = 'cookie-rarity-header';
        header.textContent = rarity;
        sectionDiv.appendChild(header);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'cookie-grid';

        cookies.forEach(cookie => {
            const cookieCard = document.createElement('div');
            cookieCard.className = 'cookie-card';

            // Image container
            const imgDiv = document.createElement('div');
            imgDiv.className = 'cookie-image';

            const iconImg = document.createElement('img');
            iconImg.className = 'cookie-icon';
            iconImg.src = cookie['icon-image'] || 'assets/pure-vanilla-awakened-icon.webp';
            iconImg.alt = `${cookie.name} icon`;

            imgDiv.appendChild(iconImg);

            const nameDiv = document.createElement('div');
            nameDiv.className = 'cookie-name';
            nameDiv.textContent = cookie.name;

            cookieCard.appendChild(imgDiv);
            cookieCard.appendChild(nameDiv);

            gridDiv.appendChild(cookieCard);
        });

        sectionDiv.appendChild(gridDiv);
        container.appendChild(sectionDiv);
    });

    // ---- MOVE THIS HERE ----
    document.querySelectorAll('.cookie-name').forEach(el => {
        let parentWidth = el.parentElement.offsetWidth * 0.9; // 90% of parent
        let fontSize = parseInt(window.getComputedStyle(el).fontSize);
        while (el.scrollWidth > parentWidth && fontSize > 8) {
            fontSize--;
            el.style.fontSize = fontSize + 'px';
        }
    });
}


