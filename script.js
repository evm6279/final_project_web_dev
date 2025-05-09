document.addEventListener('DOMContentLoaded', function() {
    // DOM Queries
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    const indicatorsContainer = document.querySelector('.gallery-indicators');
    
    // Variables for gallery functionality
    let currentIndex = 0;
    const itemWidth = galleryItems[0].offsetWidth;
    const itemsPerView = window.innerWidth >= 768 ? 3 : 1;
    const itemCount = galleryItems.length;
    const maxIndex = Math.max(0, itemCount - itemsPerView);
    
    // Create indicator dots
    for (let i = 0; i <= maxIndex; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.setAttribute('data-index', i);
      indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = document.querySelectorAll('.indicator');
    
    // Function to update gallery position
    function updateGalleryPosition() {
      const newPosition = -currentIndex * (itemWidth + 16); 
      galleryTrack.style.transform = `translateX(${newPosition}px)`;
      
      // Update indicators
      indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
      
      // Update button states
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === maxIndex;
      
      // Announce for screen readers
      const announcer = document.getElementById('gallery-announcer') || createAnnouncer();
      announcer.textContent = `Item ${currentIndex + 1} of ${maxIndex + 1} displayed`;
    }
    
    // Create screen reader announcer
    function createAnnouncer() {
      const announcer = document.createElement('div');
      announcer.id = 'gallery-announcer';
      announcer.className = 'visually-hidden';
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
      return announcer;
    }
    
    // Event handlers
    function navigatePrev() {
      if (currentIndex > 0) {
        currentIndex--;
        updateGalleryPosition();
      }
    }
    
    function navigateNext() {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateGalleryPosition();
      }
    }
    
    // Event listeners
    prevButton.addEventListener('click', navigatePrev);
    nextButton.addEventListener('click', navigateNext);
    
    // Indicator click events
    indicators.forEach(dot => {
      dot.addEventListener('click', function() {
        currentIndex = parseInt(this.getAttribute('data-index'));
        updateGalleryPosition();
      });
    });
    
    // Keyboard navigation for focused gallery items
    galleryItems.forEach(item => {
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          // Simulate click on the item
          this.click();
        }
      });
    });
    
    // Click event for gallery items
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        // Get item details for navigation
        const title = this.querySelector('.item-title').textContent;
        const meta = this.querySelector('.item-meta').textContent;
        
        // Log or navigate to detail page
        console.log(`Clicked on: ${title} by ${meta}`);
        // For actual implementation:
        // window.location.href = `detail.html?item=${encodeURIComponent(title)}`;
      });
    });
    
    // Handle touch events for swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryTrack.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    }, false);
    
    galleryTrack.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    }, false);
    
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for a swipe
      
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left, go next
        navigateNext();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right, go previous
        navigatePrev();
      }
    }
    
    // Resize handler to maintain responsive behavior
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Recalculate values on resize
        const newItemsPerView = window.innerWidth >= 768 ? 3 : 1;
        
        if (newItemsPerView !== itemsPerView) {
          // Reset position if view mode changes
          currentIndex = 0;
          updateGalleryPosition();
        }
      }, 250);
    });
    
    // Initialize gallery
    updateGalleryPosition();
  });
  /*-------------------------------------------Motorsports Page---------------------------------------------*/
 // Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle vehicle reveal
  function setupVehicleReveal(buttonId, vehicleId) {
    const button = document.getElementById(buttonId);
    const vehicle = document.getElementById(vehicleId);
    
    if (button && vehicle) {
      button.addEventListener('click', function() {
        // Check if this vehicle is already shown
        const isShown = vehicle.classList.contains('show');
        
        // If it's shown, hide it
        if (isShown) {
          vehicle.classList.remove('show');
          button.textContent = `Reveal My ${vehicleId === 'my-motorcycle' ? 'Motorcycle' : 'Car'}`;
          button.classList.remove('active');
        } else {
          // First, hide any other vehicles that might be shown
          document.querySelectorAll('.hidden-vehicle').forEach(el => {
            el.classList.remove('show');
          });
          
          // Reset all button states
          document.querySelectorAll('.reveal-button').forEach(btn => {
            if (btn.id === 'reveal-motorcycle') {
              btn.textContent = 'Reveal My Motorcycle';
            } else if (btn.id === 'reveal-car') {
              btn.textContent = 'Reveal My Car';
            }
            btn.classList.remove('active');
          });
          
          // Then show this vehicle
          vehicle.classList.add('show');
          button.textContent = `Hide My ${vehicleId === 'my-motorcycle' ? 'Motorcycle' : 'Car'}`;
          button.classList.add('active');
          
          // Scroll to the vehicle section with smooth animation
          setTimeout(() => {
            vehicle.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      });
    }
  }
  
  // Set up reveal functionality for both vehicles
  setupVehicleReveal('reveal-motorcycle', 'my-motorcycle');
  setupVehicleReveal('reveal-car', 'my-car');
  
  // Add click functionality to the thumbnail images
  const thumbnails = document.querySelectorAll('.vehicle-thumbnails img');
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Get the parent vehicle showcase section
      const vehicleShowcase = this.closest('.vehicle-showcase');
      // Get the main image in this section
      const mainImage = vehicleShowcase.querySelector('.vehicle-main-image img');
      
      // Swap the source attributes
      mainImage.src = this.src.replace('_small', '');
      mainImage.srcset = this.srcset || '';
      mainImage.alt = this.alt;
      
      // Add a highlight effect to the clicked thumbnail
      vehicleShowcase.querySelectorAll('.vehicle-thumbnails img').forEach(thumb => {
        thumb.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
});