document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const floatingShapes = document.getElementById('floatingShapes');
    let currentSlide = 0;
    const slideDuration = 4000; // 4 seconds
    let autoSlideInterval;
    let isFinalSlide = false;

    // Create floating shapes
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        const shapeType = Math.random() > 0.5 ? 'shape-circle' : 'shape-triangle';
        const size = Math.random() * 50 + 20;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight + window.innerHeight;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.1 + 0.05;

        shape.classList.add('shape', shapeType);
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${posX}px`;
        shape.style.top = `${posY}px`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.opacity = opacity;

        floatingShapes.appendChild(shape);
    }

    // Create sparkles for each creative element
    function createSparkles(element, count) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');

            const size = Math.random() * 6 + 4;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 2;

            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${posX}%`;
            sparkle.style.top = `${posY}%`;
            sparkle.style.animationDelay = `${delay}s`;

            element.appendChild(sparkle);
        }
    }

    // Automatically add sparkles to all .creative-element elements
    document.querySelectorAll('.creative-element').forEach((el) => {
        const sparkleCount = el.id === 'actionSparkles' ? 20 : 15;
        createSparkles(el, sparkleCount);
    });

    // Show current slide with animation
    function showSlide(n) {
        if (n >= slides.length - 1) {
            isFinalSlide = true;
            clearInterval(autoSlideInterval);
        }

        const currentActive = document.querySelector('.slide.active');
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('exiting');

            setTimeout(() => {
                currentActive.classList.remove('exiting');
            }, 1500);
        }

        currentSlide = (n + slides.length) % slides.length;

        setTimeout(() => {
            slides[currentSlide].classList.add('entering');
            void slides[currentSlide].offsetWidth;

            setTimeout(() => {
                slides[currentSlide].classList.add('active');
                slides[currentSlide].classList.remove('entering');
            }, 50);
        }, 500);
    }

    // Move to next slide (if not on final)
    function nextSlide() {
        if (!isFinalSlide) {
            showSlide(currentSlide + 1);
        }
    }

    // Start auto sliding
    function startAutoSlide() {
        if (!isFinalSlide) {
            autoSlideInterval = setInterval(nextSlide, slideDuration);
        }
    }

    // Start everything
    startAutoSlide();

    // Animate button press (final button)
    const creativeBtn = document.querySelector('.creative-btn');
    if (creativeBtn) {
        creativeBtn.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            // Optional: Add action when button is clicked
            // window.location.href = "/create";
        });
    }
    if (creativeBtn) {
        creativeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create heart element
            const heart = document.createElement('div');
            heart.innerHTML = '💛';
            heart.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(1);
                font-size: 20px;
                opacity: 0;
                z-index: 1000;
                transition: all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
            `;
            document.body.appendChild(heart);

            // Trigger animation
            setTimeout(() => {
                heart.style.opacity = '1';
                heart.style.fontSize = '20px';
                
                setTimeout(() => {
                    heart.style.fontSize = '2000px';
                    heart.style.opacity = '0.9';
                    
                    // Fade out all content
                    document.querySelectorAll('.slide, .floating-shapes, .music-control').forEach(el => {
                        el.style.transition = 'opacity 0.8s ease';
                        el.style.opacity = '0';
                    });

                    // Redirect after animation completes
                    setTimeout(() => {
                        window.close();
                    }, 1500);
                }, 100);
            }, 10);

            // Button press effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
});
