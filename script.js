// Modern JavaScript for the Secretaria Online website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add loading animations
    addLoadingAnimations();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add service card interactions
    addCardInteractions();
}

function showSection(sectionId, link) {
    // Remove active class from all sections and nav tabs
    document.querySelectorAll('.service-section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.opacity = '0';
    });
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-pressed', 'false');
    });
    
    // Add active class to selected section and nav tab
    const targetSection = document.getElementById(sectionId);
    const targetTab = link;
    
    if (targetSection && targetTab) {
        targetSection.classList.add('active');
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-pressed', 'true');
        
        // Animate the section appearance
        setTimeout(() => {
            targetSection.style.opacity = '1';
        }, 50);
        
        // Update URL hash for better navigation
        updateURLHash(sectionId);
        
        // Announce to screen readers
        announceSectionChange(sectionId);
    }
}

function addSmoothScrolling() {
    // Smooth scroll to top when clicking on logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function addLoadingAnimations() {
    // Add staggered animation to service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-in');
    });
}

function addKeyboardNavigation() {
    // Add keyboard navigation for nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const sectionId = tab.getAttribute('onclick').match(/'([^']+)'/)[1];
                showSection(sectionId, tab);
            }
        });
        
        // Add proper ARIA attributes
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-pressed', tab.classList.contains('active'));
    });
}

function addCardInteractions() {
    // Add hover effects and click feedback
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Check if the card itself is a link
        const cardHref = card.getAttribute('href');
        if (cardHref && (cardHref.startsWith('http') || cardHref.startsWith('https'))) {
            // Skip adding event listeners for cards that are external links
            return;
        }
        
        const button = card.querySelector('.card-button');
        
        if (button) {
            // Check if it's an external link - if so, skip adding event listeners
            const href = button.getAttribute('href');
            const isExternal = button.getAttribute('data-external') === 'true';
            if (href && (href.startsWith('http') || href.startsWith('https') || isExternal)) {
                // Don't add any event listeners for external links
                return;
            }
            
            // Add click feedback only for internal links
            button.addEventListener('click', (e) => {
                // Add ripple effect
                createRippleEffect(e);
                
                // Add loading state
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Carregando...</span>';
                
                // Simulate loading (remove in production)
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 1000);
            });
        }
    });
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function updateURLHash(sectionId) {
    // Update URL hash without scrolling
    const url = new URL(window.location);
    url.hash = sectionId;
    window.history.replaceState(null, null, url);
}

function announceSectionChange(sectionId) {
    // Announce section change to screen readers
    const sectionNames = {
        'estudantes': 'Área para Estudantes',
        'docentes': 'Área para Docentes',
        'gestores': 'Área para Gestores'
    };
    
    const sectionName = sectionNames[sectionId] || 'Nova seção';
    
    // Create temporary announcement element
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = `Mudou para ${sectionName}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .service-card {
        position: relative;
        overflow: hidden;
    }
    
    .card-button {
        position: relative;
        overflow: hidden;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetTab = document.querySelector(`[onclick*="${hash}"]`);
        if (targetTab) {
            showSection(hash, targetTab);
        }
    }
});

// Initialize with URL hash if present
window.addEventListener('load', function() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetTab = document.querySelector(`[onclick*="${hash}"]`);
        if (targetTab) {
            showSection(hash, targetTab);
        }
    }
});
