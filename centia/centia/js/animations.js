document.addEventListener('DOMContentLoaded', () => {
    // Scroll fade animations
    const scrollFades = document.querySelectorAll('.scroll-fade');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('feature-dishes') ||
                        entry.target.classList.contains('cocktail-grid')) {
                        animateCards(entry.target);
                    }
                }
            });
        },
        { threshold: 0.1 }
    );

    scrollFades.forEach(element => observer.observe(element));

    // Staggered card animations
    function animateCards(container) {
        const cards = container.querySelectorAll('.dish-card, .cocktail-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Modified Image lazy loading
    const images = document.querySelectorAll('.dish-image img, .cocktail-image img');
    images.forEach(img => {
        // Remove the lazy loading logic that was preventing images from loading
        if (!img.src && img.dataset.src) {
            img.src = img.dataset.src;
        }
        img.style.opacity = '1';
        
        // Add error handling for each image
        img.addEventListener('error', function() {
            console.error('Failed to load image:', this.src);
            this.style.backgroundColor = '#333';
            this.style.padding = '20px';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.insertAdjacentHTML('afterbegin', '❌ Image not found');
        });
    });

    // Ambient light effect
    const ambientOverlay = document.querySelector('.ambient-overlay');
    if (ambientOverlay) {
        setInterval(() => {
            const randomOpacity = 0.05 + Math.random() * 0.1;
            ambientOverlay.style.opacity = randomOpacity;
        }, 1000);
    }

    // Image error handling
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Failed to load image:', this.src);
            this.style.backgroundColor = '#333';
            this.style.padding = '20px';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.insertAdjacentHTML('afterbegin', '❌ Image not found');
        });
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Get all images for this category
            currentImages = Array.from(document.querySelectorAll(
                category === 'all' 
                    ? '.gallery-item' 
                    : `.gallery-item[data-category="${category}"]`
            ));

            if (currentImages.length > 0) {
                currentIndex = 0;
                showImage(currentIndex);
                lightbox.classList.add('active');
            }
        });
    });

    // Show image function
    function showImage(index) {
        const item = currentImages[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.item-title').textContent;
        const category = item.querySelector('.item-category').textContent;

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = `${title} - ${category}`;

        // Update navigation buttons visibility
        lightboxPrev.style.display = index > 0 ? 'block' : 'none';
        lightboxNext.style.display = index < currentImages.length - 1 ? 'block' : 'none';
    }

    // Navigation handlers
    lightboxPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    });

    lightboxNext.addEventListener('click', () => {
        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    });

    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    currentIndex--;
                    showImage(currentIndex);
                }
                break;
            case 'ArrowRight':
                if (currentIndex < currentImages.length - 1) {
                    currentIndex++;
                    showImage(currentIndex);
                }
                break;
            case 'Escape':
                lightbox.classList.remove('active');
                break;
        }
    });

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Video background handling
    const video = document.querySelector('.background-video');
    const fallbackImage = video.querySelector('img');

    video.addEventListener('error', () => {
        // Show fallback image if video fails to load
        if (fallbackImage) {
            video.style.display = 'none';
            fallbackImage.style.display = 'block';
        }
    });

    const form = document.getElementById('reservationForm');
    const dateInput = document.getElementById('date');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Form submission handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const popup = document.getElementById('successPopup');

        try {
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show popup
            popup.style.display = 'flex';
            popup.classList.add('active');
            
            // Auto-close popup after 5 seconds
            setTimeout(() => {
                closePopup();
            }, 5000);

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error processing your reservation. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Message display function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = message;

        form.parentNode.insertBefore(messageDiv, form);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Form validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.classList.add('error');
        });

        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
    });

    const popup = document.getElementById('successPopup');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get the submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success popup
            popup.classList.add('active');
            
            // Reset form
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error processing your reservation. Please try again.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});

// Close popup function
function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('active');
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('successPopup');
    if (e.target === popup) {
        closePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
});

