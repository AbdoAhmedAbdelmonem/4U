document.addEventListener('DOMContentLoaded', function() {
    const passwordContainer = document.getElementById('passwordContainer');
    const mainContent = document.getElementById('mainContent');
    const errorMessage = document.getElementById('errorMessage');
    const otpInputs = document.querySelectorAll('.otp-input');
    const submitBtn = document.querySelector('.submit-btn');

    const STORED_HASH = "170067";

    function simpleHash(input) {
        let hash = 0;
        if (input.length === 0) return hash.toString(16);

        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return hash.toString(16);
    }

    function checkPassword() {
        let enteredPassword = '';
        otpInputs.forEach(input => {
            enteredPassword += input.value;
        });

        const enteredHash = simpleHash(enteredPassword);

        if (enteredHash === STORED_HASH) {
            passwordContainer.style.opacity = '0';
            setTimeout(() => {
                passwordContainer.style.display = 'none';
                mainContent.style.display = 'block';
                initializeMainContent();
            }, 500);
        } else {
            errorMessage.textContent = 'كلمة المرور غير صحيحة';
            otpInputs.forEach(input => {
                input.value = '';
                input.style.borderColor = '#ff4d6d';
            });
            otpInputs[0].focus();

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
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            } else {
                submitBtn.focus();
            }
        }

        errorMessage.textContent = '';
    }

    otpInputs.forEach((input, index) => {
        input.dataset.index = index;
        input.addEventListener('input', function() {
            moveToNext(this);
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });

    submitBtn.addEventListener('click', checkPassword);
    
    // Also allow form submission with Enter key
    otpInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    });

    otpInputs[0].focus();

    function initializeMainContent() {
        const slides = document.querySelectorAll('.slide');
        const floatingShapes = document.getElementById('floatingShapes');
        const creativeBtn = document.querySelector('.creative-btn');

        let currentSlide = 0;
        const slideDuration = 5000;
        let autoSlideInterval;
        let isFinalSlide = false;

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

        function createHeartBubbles() {
            const bubbleContainer = document.createElement('div');
            bubbleContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
                overflow: hidden;
            `;
            document.body.appendChild(bubbleContainer);

            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.innerHTML = '💛';

                    const startX = Math.random() * 100;
                    const size = Math.random() * 30 + 20;
                    const duration = Math.random() * 6 + 4;
                    const delay = Math.random() * 2;
                    const opacity = Math.random() * 0.7 + 0.3;

                    heart.style.cssText = `
                        position: absolute;
                        bottom: -50px;
                        left: ${startX}%;
                        font-size: ${size}px;
                        opacity: ${opacity};
                        transform: translateX(-50%);
                        animation: floatUp ${duration}s ease-in ${delay}s forwards;
                    `;

                    bubbleContainer.appendChild(heart);

                    setTimeout(() => {
                        heart.remove();
                    }, (duration + delay) * 1000);
                }, i * 200);
            }

            setTimeout(() => {
                bubbleContainer.remove();
            }, 30 * 200 + 6000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateX(-50%) translateY(0) scale(0.5);
                    opacity: 0.3;
                }
                50% {
                    transform: translateX(-50%) translateY(-50vh) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateX(-50%) translateY(-100vh) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        function showSlide(n) {
            if (n >= slides.length - 1 && !isFinalSlide) {
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

        function nextSlide() {
            if (!isFinalSlide) {
                showSlide(currentSlide + 1);
            }
        }

        function startAutoSlide() {
            if (!isFinalSlide) {
                slides[0].classList.add('active');
                autoSlideInterval = setInterval(() => {
                    if (!document.hidden) {
                        nextSlide();
                    }
                }, slideDuration);
            }
        }

        if (creativeBtn) {
            creativeBtn.addEventListener('click', function(e) {
                e.preventDefault();

                // Only allow the button to be clicked if it's on the active last slide
                if (currentSlide === slides.length - 1 && slides[currentSlide].classList.contains('active')) {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);

                    createHeartBubbles();
                }
            });
        }

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                clearInterval(autoSlideInterval);
            } else if (!isFinalSlide) {
                startAutoSlide();
            }
        });

        createFloatingShapes();
        document.querySelectorAll('.creative-element').forEach((el, index) => {
            createSparkles(el, el.id === 'actionSparkles' ? 20 : 15);
        });

        startAutoSlide();
    }
});
