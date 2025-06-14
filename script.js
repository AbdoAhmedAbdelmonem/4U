document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const passwordContainer = document.getElementById('passwordContainer');
    const mainContent = document.getElementById('mainContent');
    const errorMessage = document.getElementById('errorMessage');
    const otpInputs = document.querySelectorAll('.otp-input');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Security configuration
    const STORED_HASH = "170460";
    
    // Simple MD5 hash function (for demonstration)
    function simpleHash(input) {
        // Note: In production, use a more secure hashing algorithm like SHA-256
        // This is a simplified version for demonstration purposes
        let hash = 0;
        if (input.length === 0) return hash.toString(16);
        
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return hash.toString(16);
    }
    
    // 1. PASSWORD PROTECTION ======================================
    function checkPassword() {
        let enteredPassword = '';
        otpInputs.forEach(input => {
            enteredPassword += input.value;
        });
        
        // Hash the entered password and compare with stored hash
        const enteredHash = simpleHash(enteredPassword);
        
        if (enteredHash === STORED_HASH) {
            // Correct password - show content
            passwordContainer.style.opacity = '0';
            setTimeout(() => {
                passwordContainer.style.display = 'none';
                mainContent.style.display = 'block';
                initializeMainContent();
            }, 500);
        } else {
            // Wrong password - show error
            errorMessage.textContent = 'كلمة المرور غير صحيحة';
            otpInputs.forEach(input => {
                input.value = '';
                input.style.borderColor = '#ff4d6d';
            });
            otpInputs[0].focus();
            
            // Reset border color after animation
            setTimeout(() => {
                otpInputs.forEach(input => {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                });
            }, 1000);
        }
    }

    function moveToNext(input) {
        const value = input.value;
        const index = parseInt(input.dataset.index);
        
        if (value.length === 1) {
            if (index < 3) {
                otpInputs[index + 1].focus();
            }
        }
        
        // Clear error when typing
        errorMessage.textContent = '';
    }

    // Event listeners for password protection
    otpInputs.forEach(input => {
        input.addEventListener('input', function() {
            moveToNext(this);
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && this.value === '') {
                const index = parseInt(this.dataset.index);
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });

    submitBtn.addEventListener('click', checkPassword);

    // Auto-focus first password input
    otpInputs[0].focus();

    // 2. MAIN CONTENT INITIALIZATION =============================
    function initializeMainContent() {
        // Elements
        const slides = document.querySelectorAll('.slide');
        const floatingShapes = document.getElementById('floatingShapes');
        const bgMusic = document.getElementById('bgMusic');
        const musicToggle = document.getElementById('musicToggle'); // Ensure this element exists in HTML
        const creativeBtn = document.querySelector('.creative-btn');
        
        // State variables
        let currentSlide = 0;
        const slideDuration = 4000; // 4 seconds per slide
        let autoSlideInterval;
        let isFinalSlide = false;
        let isMusicPlaying = false;
        
        // MUSIC SYSTEM ===========================================
        // Directly configure and handle music without a separate 'initialized' flag
        bgMusic.volume = 0.3;
        bgMusic.loop = true;
        bgMusic.src = 'https://assets.mixkit.co/music/preview/mixkit-inspiring-cinematic-ambient-1167.mp3';
        bgMusic.load(); // Load the audio but don't play it yet

        function toggleMusic() {
            if (isMusicPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        }

        function playMusic() {
            bgMusic.play()
                .then(() => {
                    isMusicPlaying = true;
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => {
                    console.error("Audio playback failed:", error);
                    // Provide visual feedback if autoplay is blocked
                    musicToggle.innerHTML = '<i class="fas fa-music"></i> (click to enable)';
                    musicToggle.style.color = '#ff9a9e';
                    setTimeout(() => {
                        musicToggle.style.color = 'white';
                    }, 2000);
                });
        }

        function pauseMusic() {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }

        function fadeOutMusic() {
            if (!isMusicPlaying) return;
            
            const fadeInterval = setInterval(() => {
                if (bgMusic.volume > 0.05) {
                    bgMusic.volume -= 0.05;
                } else {
                    clearInterval(fadeInterval);
                    pauseMusic();
                    bgMusic.volume = 0.3; // Reset volume
                }
            }, 100);
        }

        // VISUAL EFFECTS =========================================
        function createFloatingShapes() {
            const shapeTypes = ['shape-circle', 'shape-triangle'];
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < 15; i++) {
                const shape = document.createElement('div');
                const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                
                Object.assign(shape.style, {
                    width: `${Math.random() * 50 + 20}px`,
                    height: `${Math.random() * 50 + 20}px`,
                    left: `${Math.random() * window.innerWidth}px`,
                    top: `${Math.random() * window.innerHeight + window.innerHeight}px`,
                    animationDuration: `${Math.random() * 30 + 20}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.1 + 0.05
                });
                
                shape.className = `shape ${shapeType}`;
                fragment.appendChild(shape);
            }
            floatingShapes.appendChild(fragment);
        }

        function createSparkles(element, count) {
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < count; i++) {
                const sparkle = document.createElement('div');
                Object.assign(sparkle.style, {
                    width: `${Math.random() * 6 + 4}px`,
                    height: `${Math.random() * 6 + 4}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                });
                sparkle.className = 'sparkle';
                fragment.appendChild(sparkle);
            }
            element.appendChild(fragment);
        }

        function createHeartAnimation() {
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

                    // Close window after animation completes
                    setTimeout(() => {
                        window.location.href = "https://chameleon-nu.vercel.app/";
                    }, 1500);
                }, 100);
            }, 10);
        }

        // SLIDESHOW SYSTEM =======================================
        function showSlide(n) {
            if (n >= slides.length - 1 && !isFinalSlide) {
                isFinalSlide = true;
                clearInterval(autoSlideInterval);
                fadeOutMusic();
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
                void slides[currentSlide].offsetWidth; // Trigger reflow for animation
                
                setTimeout(() => {
                    slides[currentSlide].classList.add('active');
                    slides[currentSlide].classList.remove('entering');
                }, 50);
            }, 500);
        }

        function nextSlide() {
            if (!isFinalSlide) {
                showSlide(currentSlide + 1);
            }
        }

        function startAutoSlide() {
            if (!isFinalSlide) {
                // Immediately show first slide
                slides[0].classList.add('active');
                
                // Start the interval
                autoSlideInterval = setInterval(() => {
                    if (!document.hidden) {
                        nextSlide();
                    }
                }, slideDuration);
            }
        }

        // EVENT LISTENERS ========================================
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }

        if (creativeBtn) {
            creativeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Button press effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
                
                createHeartAnimation();
            });
        }

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(autoSlideInterval);
                if (isMusicPlaying) {
                    bgMusic.pause();
                }
            } else if (!isFinalSlide) {
                startAutoSlide();
                // Attempt to play music only if it was playing and not due to user interaction
                // For better user experience, often music playback on visibility change should be user-initiated or a soft resume
                // For simplicity here, we re-attempt playback if it was playing
                if (isMusicPlaying) {
                    playMusic().catch(console.error);
                }
            }
        });

        // INITIALIZATION =========================================
        createFloatingShapes();
        document.querySelectorAll('.creative-element').forEach((el, index) => {
            createSparkles(el, el.id === 'actionSparkles' ? 20 : 15);
        });
        
        // Start slideshow
        startAutoSlide();
    }
});
