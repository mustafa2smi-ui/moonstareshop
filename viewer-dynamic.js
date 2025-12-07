/**
 * viewer-dynamic.js
 * Category-wise Duas Loader and Smoother Swiping Logic - FIX v3
 */
/*
let duasData = []; 
let filteredDuas = []; 
let currentDuaIndex = 0;

async function loadDuas() {
    try {
        const response = await fetch('duas.json');
        duasData = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category'); 
        const initialSlug = urlParams.get('slug'); 
        
        // 1. Filter the Duas by Category
        if (categoryFilter) {
            filteredDuas = duasData.filter(d => d.category === categoryFilter);
            if (filteredDuas.length === 0) {
                // Fallback: If no duas found for the category, show all.
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

        // Check if filteredDuas is still empty, and if so, prevent errors
        if (filteredDuas.length === 0) {
             console.error('No Duas available in duas.json.');
             document.getElementById('duaContainer').innerHTML = '<p style="text-align:center; color:red; margin-top: 100px;">Data not found in duas.json.</p>';
             return;
        }

        // Initialize content and history (without pushing)
        updatePageContent(false);

    } catch (error) {
        console.error('Error loading Duas or JSON:', error);
        // Changed ID from 'content-area' (not present) to 'duaContainer'
        document.getElementById('duaContainer').innerHTML = '<p style="text-align:center; color:red; margin-top: 100px;">Content loading error. Please check duas.json file.</p>';
    }
}
*/
    /**
 * viewer-dynamic.js (FIX: Strict Validation & Coming Soon Message)
 */

let duasData = []; 
let filteredDuas = []; 
let currentDuaIndex = 0;

async function loadDuas() {
    const duaContainer = document.getElementById('duaContainer');
    
    try {
        const response = await fetch('duas.json');
        duasData = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category'); 
        const initialSlug = urlParams.get('slug'); 
        
        // --- Strict Validation Check ---
        if (!categoryFilter || !initialSlug) {
            // अगर URL में category या slug MISSING है
            showComingSoon(duaContainer, "URL में श्रेणी या सामग्री (slug) मौजूद नहीं है।");
            return;
        }

        // 1. Filter the Duas by Category
        filteredDuas = duasData.filter(d => d.category === categoryFilter);

        // 2. Find the index of the initial slug within the FILTERED array
        let index = -1;
        if (filteredDuas.length > 0) {
            index = filteredDuas.findIndex(d => d.slug === initialSlug);
        }

        // --- Core Validation Check (If no content found) ---
        if (index === -1) {
            // अगर category या slug गलत है, या फिल्टर में कुछ नहीं मिला 
            showComingSoon(duaContainer, `यह दुआ (Slug: ${initialSlug}, Category: ${categoryFilter}) अभी अपलोड नहीं हुई है।`);
            return; 
        }

        // Content Found: Set index and load page
        currentDuaIndex = index;
        updatePageContent(false);

    } catch (error) {
        // अगर duas.json फ़ाइल लोड ही नहीं हो पाई (e.g., File Not Found)
        console.error('Error loading Duas or JSON:', error);
        showComingSoon(duaContainer, "डेटाबेस फ़ाइल (duas.json) लोड नहीं हो पाई। कृपया फ़ाइल पाथ जांचें।");
    }
}

// 💥 New Function: Displays the "Coming Soon" message and hides buttons
function showComingSoon(containerElement, detailedMessage) {
    // Hide floating buttons
    document.querySelector('.download-btn').style.display = 'none';
    document.querySelector('.share-btn').style.display = 'none';

    // Display the main message
    containerElement.innerHTML = `
        <div style="text-align:center; padding: 50px; color: #FFF; margin-top: 100px;">
            <h2 style="color: #4CAF50;">⏳ जल्द ही अपलोड किया जाएगा (Coming Soon)</h2>
            <p style="font-size: 1.1em; margin-top: 20px;">
                क्षमा करें, यह सामग्री (Dua) अभी उपलब्ध नहीं है।
            </p>
            <p style="font-size: 0.9em; opacity: 0.7; margin-top: 30px;">
                (Admin Message: ${detailedMessage})
            </p>
            <a href="index.html" style="color: #007bff; text-decoration: none; display: block; margin-top: 40px;">⬅ गैलरी पर वापस जाएँ</a>
        </div>
    `;
}

// ... (Rest of the functions: updatePageContent, goNext, goPrev, Swiping logic remains the same) ...

// IMPORTANT: updatePageContent, goNext, goPrev, swiping functions
// must remain UNCHANGED, as they rely on filteredDuas array.


function updatePageContent(pushToHistory = true) {
    if (filteredDuas.length === 0) return;

    const dua = filteredDuas[currentDuaIndex];
    const categoryFilter = new URLSearchParams(window.location.search).get('category');
    
    // ===============================================
    // 💥 FIX 1: Image Path and ID (Your main issue)
    // 
    // Image is in the root folder, so we use dua.image directly.
    document.getElementById('duaImage').src = dua.image;
    document.getElementById('duaImage').alt = dua.title;
    
    // 💥 FIX 2: Correcting IDs and JSON fields
    // 
    // Your duas.json uses: 'title', 'arabic', 'hindi_trans', 'explanation'
    // Your viewer.html uses: 'pageTitle', 'metaDescription', 'duaH1', 'duaArabic', 'duaHindi', 'duaExplanation'
    
    // Update Meta and Title (from viewer.html)
    document.getElementById('pageTitle').innerText = dua.title;
    document.getElementById('metaDescription').content = dua.description;
    
    // Update Content (from viewer.html)
    document.getElementById('duaH1').innerText = dua.title;
    document.getElementById('duaArabic').innerHTML = dua.arabic;
    
    // Using the ID from viewer.html which holds the translation
    document.getElementById('duaHindi').innerHTML = `**हिंदी:** ${dua.hindi_trans}`; 
    
    // Explanation Text
    document.getElementById('duaExplanation').innerHTML = `<h2>Importance</h2><p>${dua.explanation}</p>`;
    
    // ===============================================

    // Update the URL in the browser history 
    if (pushToHistory) {
        // We use the category from the URL params or the current dua object
        const newUrl = `viewer.html?category=${categoryFilter || dua.category}&slug=${dua.slug}`;
        window.history.pushState({ path: newUrl, index: currentDuaIndex }, dua.title, newUrl);
    }
}


// Navigation functions (goNext, goPrev) are correct
function goNext() {
    currentDuaIndex = (currentDuaIndex + 1) % filteredDuas.length; 
    updatePageContent();
}

function goPrev() {
    currentDuaIndex = (currentDuaIndex - 1 + filteredDuas.length) % filteredDuas.length; 
    updatePageContent();
}

// Swiping, Keyboard, and Popstate handlers are correct
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; 

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
        return; 
    }

    if (diff > 0) {
        goPrev();
    } else {
        goNext();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goPrev();
    } else if (e.key === 'ArrowRight') {
        goNext();
    }
});

loadDuas();

window.onpopstate = function(event) {
    if (event.state && event.state.index !== undefined) {
        currentDuaIndex = event.state.index;
        updatePageContent(false);
    } else {
        loadDuas();
    }
};
