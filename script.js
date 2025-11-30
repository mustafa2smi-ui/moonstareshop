// ज़रूरी DOM एलिमेंट्स को सेलेक्ट करें
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0; // वर्तमान में खुली हुई इमेज का इंडेक्स
const images = Array.from(galleryItems); // सभी इमेजेस का ऐरे

// लाइटबॉक्स को बंद करने का फ़ंक्शन
function closeLightbox() {
    lightbox.style.display = 'none';
}

// लाइटबॉक्स में इमेज को अपडेट करने का फ़ंक्शन
function updateLightboxImage(index) {
    if (index >= 0 && index < images.length) {
        currentIndex = index;
        const largeImageUrl = images[currentIndex].getAttribute('data-large');
        lightboxImage.src = largeImageUrl;
    }
}

// ----------------- इवेंट लिसनर्स -----------------

// 1. गैलरी आइटम पर क्लिक करें
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        
        lightbox.style.display = 'block'; // लाइटबॉक्स दिखाएं
        updateLightboxImage(index); // बड़ी इमेज लोड करें
    });
});

// 2. बंद करने के बटन पर क्लिक करें
closeBtn.addEventListener('click', closeLightbox);

// 3. लाइटबॉक्स के बाहर क्लिक करें (लाइटबॉक्स को बंद करने के लिए)
lightbox.addEventListener('click', function(e) {
    // अगर क्लिक लाइटबॉक्स कंटेनर पर हुआ है, न कि इमेज या बटन पर
    if (e.target === this) { 
        closeLightbox();
    }
});

// 4. पिछली इमेज पर जाएं (prev-btn)
prevBtn.addEventListener('click', function() {
    let newIndex = currentIndex - 1;
    // अगर पहली इमेज पर हैं, तो अंतिम इमेज पर जाएं (लूप)
    if (newIndex < 0) {
        newIndex = images.length - 1;
    }
    updateLightboxImage(newIndex);
});

// 5. अगली इमेज पर जाएं (next-btn)
nextBtn.addEventListener('click', function() {
    let newIndex = currentIndex + 1;
    // अगर अंतिम इमेज पर हैं, तो पहली इमेज पर जाएं (लूप)
    if (newIndex >= images.length) {
        newIndex = 0;
    }
    updateLightboxImage(newIndex);
});

// 6. कीबोर्ड नेविगेशन (Optional - Esc, Left, Right Arrow)
document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click(); // पिछली इमेज दिखाएं
        } else if (e.key === 'ArrowRight') {
            nextBtn.click(); // अगली इमेज दिखाएं
        }
    }
});
