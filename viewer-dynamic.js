let duasData = [];
let currentDuaIndex = 0;

// ===================================
// 1. DATA LOADING AND INITIALIZATION
// ===================================

async function loadDuas() {
    try {
        const response = await fetch('duas.json');
        duasData = await response.json();
        
        // Find initial Dua based on URL (e.g., viewer.html?slug=dua1.html)
        const urlParams = new URLSearchParams(window.location.search);
        const initialSlug = urlParams.get('slug'); 
        
        if (initialSlug) {
            const index = duasData.findIndex(d => d.slug === initialSlug);
            if (index !== -1) {
                currentDuaIndex = index;
            }
        }
        
        updatePageContent(false); // Initial load, don't change history state, just replace
    } catch (error) {
        console.error("Duas data load nahi ho paya:", error);
        // Display an error message to the user if data fails to load
        document.getElementById('duaContainer').innerHTML = "<p style='color:#fff; padding:20px;'>Content loading failed. Please check the 'duas.json' file.</p>";
    }
}

// ===================================
// 2. CONTENT UPDATE (NO BLINKING)
// ===================================

function updatePageContent(pushToHistory = true) {
    const dua = duasData[currentDuaIndex];
    if (!dua) return;

    // A. DOM Content Update (Smoothness)
    document.getElementById('duaImage').src = dua.image;
    
    // Text Content
    document.getElementById('duaH1').innerText = dua.title.split('|')[0].trim();
    document.getElementById('duaArabic').innerHTML = dua.arabic;
    document.getElementById('duaHindi').innerHTML = `**हिंदी अनुवाद:** ${dua.hindi_trans}`;
    document.getElementById('duaExplanation').innerHTML = `<h2>इस दुआ का महत्व</h2><p>${dua.explanation}</p>`;

    // B. Meta Tags Update (Title, Description)
    document.getElementById('pageTitle').innerText = dua.title;
    document.getElementById('metaDescription').content = dua.description;
    
    // C. History API for Sharing Link (Changes URL without refreshing)
    const newUrl = `viewer.html?slug=${dua.slug}`;
    if (pushToHistory) {
        // Swiping ke liye, naya state push karein
        history.pushState({ index: currentDuaIndex, slug: dua.slug }, dua.title, newUrl);
    } else {
        // Initial load ya Mobile Back Button fix ke liye
        history.replaceState({ index: currentDuaIndex, slug: dua.slug }, dua.title, newUrl);
    }
    
    // Note: OG Tags (for Facebook/WhatsApp) cannot be updated via JS alone for sharing preview. 
    // They must be present when the page is first loaded by the scraper.
    // However, the correct URL is set for sharing.
}

// ===================================
// 3. NAVIGATION (SMOOTH LOOPING)
// ===================================

function goNext() {
    currentDuaIndex = (currentDuaIndex + 1) % duasData.length; // Loop forward
    updatePageContent();
}

function goPrev() {
    // Ye backward looping ke liye hai
    currentDuaIndex = (currentDuaIndex - 1 + duasData.length) % duasData.length; 
    updatePageContent();
}

// Touch gesture (Touch Swipe Logic)
let startX = 0;
document.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, { passive: true }); // passive: true for performance
document.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].screenX;
  const deltaX = endX - startX;
  
  if (deltaX < -50) goNext(); // Swipe Left -> Next
  if (deltaX > 50) goPrev(); // Swipe Right -> Previous
}, { passive: true });

// Mobile Back Button Fix / History Back
window.onpopstate = function (event) {
    if (event.state && event.state.slug) {
        // Agar history state hai to us par jayein (forward/backward button)
        const index = duasData.findIndex(d => d.slug === event.state.slug);
        if (index !== -1) {
            currentDuaIndex = index;
            updatePageContent(false); // Don't push state again
        }
    } else {
        // Agar user pehli baar back button dabata hai ya history khaali hai, to homepage par jayein
        location.href = 'index.html'; 
    }
};

// ===================================
// 4. FLOATING BUTTON LOGIC
// ===================================

// Share Button Logic (Linked to viewer.html)
function shareCurrentDua() {
    const dua = duasData[currentDuaIndex];
    const url = window.location.href; // History API se updated URL
    
    if (navigator.share) {
        navigator.share({ title: dua.title, text: dua.description, url });
    } else {
        navigator.clipboard.writeText(url);
        alert("Link copied! You can now share it.");
    }
}

// Download Button Logic
function downloadCurrentDua() {
  const dua = duasData[currentDuaIndex];
  const url = dua.image; // Use the image path
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', url); 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Start the application
loadDuas();
