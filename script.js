// ----------------- इमेज डेटा (अपनी GitHub लिंक्स यहाँ अपडेट करें) -----------------
const imagesData = [
    {
        url: "https://raw.githubusercontent.com/mustafa2smi-ui/FaithDeepHeart/main/Dua.jpg", 
        alt: "पहाड़ों में सूर्योदय का विहंगम दृश्य",
        caption: "सुबह का सुंदर दृश्य, ताज़ी हवा और शांत माहौल।",
    },
    {
        url: "https://via.placeholder.com/600/28a745/FFFFFF?text=Ancient+Temple",
        alt: "प्राचीन भारतीय मंदिर वास्तुकला", 
        caption: "हमारी ऐतिहासिक धरोहर को दर्शाने वाला एक शानदार मंदिर।",
    },
    {
        url: "https://via.placeholder.com/600/dc3545/FFFFFF?text=City+Nightscape",
        alt: "शहर का रात्रि दृश्य और रोशनी",
        caption: "तेज़ रफ़्तार शहर का चमकदार नाइट लाइफ़।",
    },
    {
        url: "https://via.placeholder.com/600/ffc107/333333?text=Desert+View",
        alt: "विशाल रेगिस्तानी रेत के टीले",
        caption: "सूर्य के ढलने पर रेगिस्तान का सुनहरा नज़ारा।",
    },
];

// ----------------- DOM एलिमेंट्स (सभी को getElementById से सेलेक्ट करें) -----------------
const galleryContainer = document.getElementById('gallery-container');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const lightboxCaption = document.getElementById('lightbox-caption');

// नेविगेशन एलिमेंट्स
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const pageTitle = document.getElementById('page-title');

let currentIndex = 0; 

// ----------------- मुख्य फ़ंक्शंस -----------------

/**
 * गैलरी में इमेजेस को डायनेमिकली लोड करता है
 */
function loadGalleryImages() {
    imagesData.forEach((data, index) => {
        const img = document.createElement('img');
        img.src = data.url; 
        img.alt = data.alt;
        img.className = 'gallery-item';
        img.setAttribute('data-index', index); 
        
        // **सुधार:** यहाँ इवेंट लिसनर को जोड़ें, जब इमेज बनती है।
        img.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index')); 
            lightbox.style.display = 'block'; 
            updateLightboxImage(index); 
            // मोबाइल पर मेनू खुला हो तो बंद कर दें
            mainNav.classList.remove('active'); 
        });
        
        galleryContainer.appendChild(img);
    });
}

/**
 * लाइटबॉक्स में इमेज और कैप्शन को अपडेट करता है
 * यह फ़ंक्शन अब imagesData ऐरे पर पूरी तरह निर्भर है।
 */
function updateLightboxImage(index) {
    if (index >= 0 && index < imagesData.length) {
        currentIndex = index;
        const currentImage = imagesData[currentIndex];
        
        lightboxImage.src = currentImage.url; 
        lightboxImage.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
        
        pageTitle.textContent = currentImage.alt + " | Gallery Pro";
    }
}

function closeLightbox() {
    lightbox.style.display = 'none';
    pageTitle.textContent = "मेरी GitHub इमेज गैलरी"; 
}


// ----------------- इवेंट लिसनर्स सेटअप -----------------

// हैमबर्गर मेनू को टॉगल (Toggle) करता है
menuToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
});


// लाइटबॉक्स नेविगेशन और क्लोजिंग इवेंट्स
closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', function(e) {
    if (e.target === this) { 
        closeLightbox();
    }
});

// पिछली इमेज पर जाएं (स्लाइडिंग)
prevBtn.addEventListener('click', function() {
    // मॉड्युलस ऑपरेटर का उपयोग करके लूपिंग (Looping) सुनिश्चित करें
    let newIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
    updateLightboxImage(newIndex);
});

// अगली इमेज पर जाएं (स्लाइडिंग)
nextBtn.addEventListener('click', function() {
    let newIndex = (currentIndex + 1) % imagesData.length;
    updateLightboxImage(newIndex);
});


// कीबोर्ड नेविगेशन
document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    }
});

// DOM लोड होने पर गैलरी लोड करें
document.addEventListener('DOMContentLoaded', loadGalleryImages);
