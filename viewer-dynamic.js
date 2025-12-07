/**
 * viewer-dynamic.js
 * Category-wise Duas Loader and Smoother Swiping Logic
 */

let duasData = []; // Full raw data will be stored here
let filteredDuas = []; // Category-specific data
let currentDuaIndex = 0;

// Function to fetch data and initialize the viewer
async function loadDuas() {
    try {
        const response = await fetch('duas.json');
        duasData = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category'); // e.g., 'daily'
        const initialSlug = urlParams.get('slug'); // e.g., 'dua-before-sleep.html'
        
        // 1. Filter the Duas by Category
        if (categoryFilter) {
            filteredDuas = duasData.filter(d => d.category === categoryFilter);
            if (filteredDuas.length === 0) {
                // Fallback if category is valid but no duas found
                filteredDuas = duasData;
                alert('Warning: No duas found for this category. Showing all Duas.');
            }
        } else {
            // Fallback: If no category is specified, show all Duas.
            filteredDuas = duasData;
        }

        // 2. Find the index of the initial slug within the FILTERED array
        if (initialSlug) {
            const index = filteredDuas.findIndex(d => d.slug === initialSlug);
            if (index !== -1) {
                currentDuaIndex = index;
            }
        }

        // Initialize content and history (without pushing)
        updatePageContent(false);

    } catch (error) {
        console.error('Error loading Duas or JSON:', error);
        document.getElementById('content-area').innerHTML = '<p style="text-align:center; color:red;">Content loading error. Please check duas.json file.</p>';
    }
}


// Function to update the HTML content with the current Dua
function updatePageContent(pushToHistory = true) {
    if (filteredDuas.length === 0) return;

    // Use the Dua object from the FILTERED array
    const dua = filteredDuas[currentDuaIndex];
    const categoryFilter = new URLSearchParams(window.location.search).get('category');

    // Update the main content
    document.getElementById('dua-title').innerText = dua.title;
    document.getElementById('dua-image').src = dua.image;
    document.getElementById('dua-image').alt = dua.title;
    document.getElementById('arabic-text').innerHTML = dua.arabic;
    document.getElementById('transliteration-text').innerHTML = `**Transliteration:** ${dua.hindi_transliteration}`;
    document.getElementById('translation-text').innerHTML = `**Translation:** ${dua.translation}`;

    // Update sharing data (optional: add share link logic here)

    // Update the URL in the browser history for deep linking (Crucial for SEO)
    if (pushToHistory) {
        const newUrl = `viewer.html?category=${categoryFilter || dua.category}&slug=${dua.slug}`;
        window.history.pushState({ path: newUrl, index: currentDuaIndex }, dua.title, newUrl);
    }
}


// Navigation: Go to the next Dua in the FILTERED list
function goNext() {
    // Navigate within the filteredDuas array
    currentDuaIndex = (currentDuaIndex + 1) % filteredDuas.length; 
    updatePageContent();
}

// Navigation: Go to the previous Dua in the FILTERED list
function goPrev() {
    // Navigate within the filteredDuas array
    currentDuaIndex = (currentDuaIndex - 1 + filteredDuas.length) % filteredDuas.length; 
    updatePageContent();
}


// --- Swiping and Touch Logic (Remains mostly the same, but calls goNext/goPrev) ---

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; // Minimum pixels for a successful swipe

document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) < minSwipeDistance) {
        return; // Not a swipe
    }

    if (diff > 0) {
        // Swiped right (Go to previous dua)
        goPrev();
    } else {
        // Swiped left (Go to next dua)
        goNext();
    }
}

// Keyboard navigation (optional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goPrev();
    } else if (e.key === 'ArrowRight') {
        goNext();
    }
});

// Load the Duas when the page is ready
loadDuas();

// Popstate handler for back/forward browser buttons
window.onpopstate = function(event) {
    if (event.state && event.state.index !== undefined) {
        currentDuaIndex = event.state.index;
        updatePageContent(false);
    } else {
        // Fallback to reload if state is missing
        loadDuas();
    }
};
