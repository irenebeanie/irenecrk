// CURRENT DEFAULT SORT METHOD (RELEASE DATE)
let currentSortMethod = 'sortOrder';
let currentBuildIndex = 0;
let currentBuilds = [];
let currentBuildNames = [];
let currentCookieName = "";

function loadCookieData() {
    fetch('/assets/cookie-data.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cookie-container');
            container.innerHTML = ''; // CLEARS CONTAINER BEFORE LOADING

            // LOAD ALL COOKIES
            const allCookies = Object.entries(data.cookies)
            .map(([name, cookie]) => ({ ...cookie, name }));

            window.allCookies = allCookies;
            
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
        header.className = `cookie-rarity-header ${rarity.toLowerCase().replace(' ', '-')}`;
        header.textContent = rarity;
        sectionDiv.appendChild(header);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'cookie-grid';

        cookies.forEach(cookie => {
            const cookieCard = document.createElement('div');
            cookieCard.className = 'cookie-card';

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

            cookieCard.onclick = () => onCookieClick(cookie.name);

            gridDiv.appendChild(cookieCard);
        });

        sectionDiv.appendChild(gridDiv);
        container.appendChild(sectionDiv);
    });

    document.querySelectorAll('.cookie-name').forEach(el => {
        let parentWidth = el.parentElement.offsetWidth * 0.9; // 90% of parent
        let fontSize = parseInt(window.getComputedStyle(el).fontSize);
        while (el.scrollWidth > parentWidth && fontSize > 8) {
            fontSize--;
            el.style.fontSize = fontSize + 'px';
        }
    });
}

function showBuildView(cookie) {
    // Hide grid, show build view
    document.getElementById('cookie-container').style.display = 'none';
    document.getElementById('build-view').style.display = '';
    document.getElementById('main-title').textContent = cookie.name || "Cookie Build";
    document.getElementById('main-subtitle').style.display = 'none';

    // Prepare builds
    currentBuilds = cookie.builds || [];
    currentBuildNames = currentBuilds.map(b => b.name || "Build");
    currentBuildIndex = 0;
    currentCookieName = cookie.name;

    renderBuild();
}

function renderBuild() {
    const buildDetail = document.getElementById('build-detail');
    const buildNav = document.getElementById('build-nav');

    if (!currentBuilds || currentBuilds.length === 0) {
        buildDetail.innerHTML = `<em>No builds available for ${currentCookieName}.</em>`;
        buildNav.innerHTML = "";
        return;
    }

    const build = currentBuilds[currentBuildIndex];
    buildDetail.innerHTML = `
        <h2>${build.name || "Build"}</h2>
        ${build.toppings ? `<div><strong>Toppings:</strong> ${build.toppings.join(', ')}</div>` : ""}
        ${build.beascuit ? `<div><strong>Beascuit:</strong> ${build.beascuit.join(', ')}</div>` : ""}
        ${build.tart ? `<div><strong>Tart:</strong> ${build.tart}</div>` : ""}
        ${build.stats ? `<div><strong>Stats:</strong> ${build.stats.replace(/\n/g, "<br>")}</div>` : ""}
        ${build.notes ? `<div><strong>Notes:</strong> ${build.notes}</div>` : ""}
    `;

    // Navigation arrows and build names
    if (currentBuilds.length > 1) {
        let leftArrow = `<button class="build-nav-btn" id="build-prev"${currentBuildIndex === 0 ? " disabled" : ""}>&lt;</button>`;
        let rightArrow = `<button class="build-nav-btn" id="build-next"${currentBuildIndex === currentBuilds.length - 1 ? " disabled" : ""}>&gt;</button>`;
        let namesText = "";

        // Show previous/next build names if available
        if (currentBuilds.length === 2) {
            // Only one arrow, show the other build name
            if (currentBuildIndex === 0) {
                namesText = `${currentBuildNames[1]}`;
                rightArrow = `<button class="build-nav-btn" id="build-next">&gt;</button>`;
                leftArrow = "";
            } else {
                namesText = `${currentBuildNames[0]}`;
                leftArrow = `<button class="build-nav-btn" id="build-prev">&lt;</button>`;
                rightArrow = "";
            }
        } else {
            namesText = `${currentBuildIndex > 0 ? "&lt; " + currentBuildNames[currentBuildIndex - 1] : ""} ${currentBuildNames[currentBuildIndex]} ${currentBuildIndex < currentBuilds.length - 1 ? "&gt; " + currentBuildNames[currentBuildIndex + 1] : ""}`;
        }

        buildNav.innerHTML = `${leftArrow}<span>${namesText}</span>${rightArrow}`;
        if (document.getElementById('build-prev'))
            document.getElementById('build-prev').onclick = () => { currentBuildIndex--; renderBuild(); };
        if (document.getElementById('build-next'))
            document.getElementById('build-next').onclick = () => { currentBuildIndex++; renderBuild(); };
    } else {
        buildNav.innerHTML = "";
    }
}

// Back button
document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-to-showcase');
    if (backBtn) {
        backBtn.onclick = function() {
            document.getElementById('build-view').style.display = 'none';
            document.getElementById('cookie-container').style.display = '';
            document.getElementById('main-title').textContent = "Cookie Builds";
            document.getElementById('main-subtitle').style.display = '';
        };
    }
});

// Hook up cookie card clicks (add this in your card rendering code)
function onCookieClick(cookieName) {
    // Find cookie data (assuming window.allCookies is an array of all cookies)
    const cookie = window.allCookies.find(c => c.name === cookieName);
    showBuildView(cookie || { name: cookieName });
}


