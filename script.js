 let currentQuote = 0;
        const quotes = [
            { text: "You are my sun, my moon, and all my stars.", author: "— E.E. Cummings" },
            { text: "I love you more than yesterday, and less than tomorrow.", author: "— Rosemonde Gerard" },
            { text: "In all the world, there is no heart for me like yours.", author: "— Maya Angelou" }
        ];

        const defaultCmsText = {
            'hero-title': "I'm Sorry, My Love...",
            'hero-text': "Every moment without your smile feels like a lifetime. I made a mistake, and my heart aches for you. Please let me make it right, my beautiful girl. 💕",
            'quotes-title': "A Few Words From My Heart",
            'quote-text': "\"You are my sun, my moon, and all my stars.\"",
            'quote-author': "— E.E. Cummings",
            'gallery-title': "Our Beautiful Memories",
            'gallery-img-1': "https://picsum.photos/id/1015/800/500",
            'gallery-img-2': "https://picsum.photos/id/1027/800/500",
            'gallery-img-3': "https://picsum.photos/id/106/800/500",
            'gallery-img-4': "https://picsum.photos/id/1005/800/500",
            'emoji-title': "Are you happy right now?",
            'emoji-text': "Click me if I'm making you smile...",
            'forgive-title': "Have you forgotten me already?",
            'thankyou-title': "Thank You, My Love ❤️",
            'poem-text': "In your eyes I found my home,<br>In your arms I found my peace.<br>Forgive me for the clouds I brought,<br>Let me be the sunshine you deserve.",
            'final-title': "My Forever Valentine",
            'final-img-1': "https://picsum.photos/id/1011/280/280",
            'final-img-2': "https://picsum.photos/id/1027/280/280",
            'final-message': "You are the most beautiful chapter of my life.<br>I promise to love you louder, better, and forever.<br><br><strong>Will you be mine again?</strong>"
        };

        const cmsStorageKey = 'lovelyCmsData';
        
        let currentSlide = 0;
        let emojiState = 0;
        const emojis = ["😊", "🥰", "😍", "💖"];
        let confettiPieces = [];
        let confettiAnimationFrame;
        let confettiActive = false;
        
        function startJourney() {
            document.getElementById('hero').classList.remove('active');
            setTimeout(() => {
                document.getElementById('hero').style.display = 'none';
                const quotesSec = document.getElementById('quotes');
                quotesSec.style.display = 'flex';
                setTimeout(() => quotesSec.classList.add('active'), 100);
            }, 800);
        }
        
        function nextQuote() {
            currentQuote = (currentQuote + 1) % quotes.length;
            document.getElementById('quote-text').innerHTML = `"${quotes[currentQuote].text}"<br><small style="font-size:1rem;">${quotes[currentQuote].author}</small>`;
            
            if (currentQuote === quotes.length - 1) {
                setTimeout(() => {
                    document.getElementById('quotes').style.display = 'none';
                    const gallery = document.getElementById('gallery');
                    gallery.style.display = 'flex';
                    setTimeout(() => gallery.classList.add('active'), 100);
                }, 1200);
            }
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + 4) % 4;
            updateSlider();
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % 4;
            updateSlider();
        }
        
        function updateSlider() {
            const slides = document.getElementById('slides');
            slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        function changeEmoji() {
            emojiState = (emojiState + 1) % emojis.length;
            const emojiEl = document.getElementById('emoji');
            emojiEl.textContent = emojis[emojiState];
            emojiEl.style.transform = 'scale(1.4)';
            setTimeout(() => emojiEl.style.transform = 'scale(1)', 300);
        }
        
        function dodgeNo(btn) {
            const x = Math.random() * 250 - 125;
            const y = Math.random() * 160 - 80;
            btn.style.transform = `translate(${x}px, ${y}px)`;
            
            setTimeout(() => {
                btn.style.transform = 'translate(0,0)';
            }, 800);
        }
        
        function sayYes() {
            document.getElementById('forgive-section').style.display = 'none';
            const thankyou = document.getElementById('thankyou');
            thankyou.style.display = 'flex';
            setTimeout(() => thankyou.classList.add('active'), 100);
            launchConfetti();
        }
        
        function showCard() {
            document.getElementById('thankyou').style.display = 'none';
            const final = document.getElementById('final-card');
            final.style.display = 'flex';
            setTimeout(() => final.classList.add('active'), 100);
            launchConfetti();
        }
        
        function nextSection(nextId) {
            const current = document.querySelector('.section[style*="display: flex"]');
            if (current) current.style.display = 'none';
            
            const next = document.getElementById(nextId);
            next.style.display = 'flex';
            setTimeout(() => next.classList.add('active'), 50);
        }

        function openCMSPanel() {
            const panel = document.getElementById('cms-panel');
            panel.classList.add('visible');
            panel.setAttribute('aria-hidden', 'false');
            populateCMSForm();
        }

        function closeCMSPanel() {
            const panel = document.getElementById('cms-panel');
            panel.classList.remove('visible');
            panel.setAttribute('aria-hidden', 'true');
        }

        function populateCMSForm() {
            const fields = document.querySelectorAll('[data-cms-key]');
            fields.forEach(field => {
                const key = field.dataset.cmsKey;
                const pageField = document.querySelector(`[data-edit-key="${key}"]`);
                const srcField = document.querySelector(`[data-edit-src="${key}"]`);
                const preview = document.querySelector(`[data-preview-for="${key}"]`);

                if (field.type === 'file') {
                    if (preview) {
                        if (srcField) preview.src = srcField.src;
                        else if (defaultCmsText[key]) preview.src = defaultCmsText[key];
                    }
                    return;
                }

                if (srcField) {
                    field.value = srcField.src;
                    return;
                }
                if (!pageField) return;
                if (field.tagName.toLowerCase() === 'textarea') {
                    field.value = pageField.innerHTML.replace(/<br\s*\/?/gi, '\n');
                } else {
                    field.value = pageField.textContent.trim();
                }
            });
        }

        function updateImagePreview(input) {
            const preview = document.querySelector(`[data-preview-for="${input.dataset.cmsKey}"]`);
            if (!preview) return;
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
            };
            reader.readAsDataURL(file);
        }

        function loadExistingCMSData() {
            const saved = localStorage.getItem(cmsStorageKey);
            if (!saved) return {};
            try {
                return JSON.parse(saved);
            } catch (e) {
                return {};
            }
        }

        async function saveCMS() {
            const fields = Array.from(document.querySelectorAll('[data-cms-key]'));
            const existing = loadExistingCMSData();
            const saved = Object.assign({}, existing);
            const readPromises = [];

            fields.forEach(field => {
                const key = field.dataset.cmsKey;
                if (field.type === 'file') {
                    const file = field.files[0];
                    if (file) {
                        readPromises.push(new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                saved[key] = reader.result;
                                resolve();
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        }));
                    }
                    return;
                }
                const value = field.value.replace(/\n/g, '<br>');
                saved[key] = value;
            });

            await Promise.all(readPromises);
            localStorage.setItem(cmsStorageKey, JSON.stringify(saved));
            applyCMSData(saved);
            closeCMSPanel();
        }

        function resetCMS() {
            localStorage.removeItem(cmsStorageKey);
            applyCMSData(defaultCmsText);
            populateCMSForm();
        }

        function applyCMSData(data) {
            const values = Object.assign({}, defaultCmsText, data);
            Object.keys(values).forEach(key => {
                const field = document.querySelector(`[data-edit-key="${key}"]`);
                const srcField = document.querySelector(`[data-edit-src="${key}"]`);
                if (field) field.innerHTML = values[key];
                if (srcField) srcField.src = values[key];
            });
            if (values['quote-text']) {
                quotes[0].text = values['quote-text'].replace(/^"|"$/g, '');
            }
            if (values['quote-author']) {
                quotes[0].author = values['quote-author'];
            }
        }

        function loadTextEdits() {
            const saved = localStorage.getItem(cmsStorageKey);
            if (!saved) return;
            let values = {};
            try {
                values = JSON.parse(saved);
            } catch (e) {
                return;
            }
            applyCMSData(values);
        }

        // Simple Confetti
        function launchConfetti() {
            if (confettiActive) return;

            const canvas = document.getElementById('confetti');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const ctx = canvas.getContext('2d');
            
            const colors = ['#ff69b4', '#ffb6c1', '#ff1493', '#ffc0cb', '#ffffff'];
            confettiPieces = [];
            
            class Piece {
                constructor() {
                    // start across the full width, near the top edge
                    this.x = Math.random() * canvas.width;
                    this.y = -Math.random() * 80; // originate from just above the viewport
                    this.size = Math.random() * 12 + 8;
                    this.speed = Math.random() * 3 + 2; // downward speed
                    this.vx = (Math.random() - 0.5) * 1.6; // slight horizontal drift
                    this.angle = Math.random() * 360;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }
                
                update() {
                    // apply motion: fall + horizontal drift + rotation
                    this.y += this.speed;
                    this.x += this.vx;
                    this.angle += 5;

                    // when a piece leaves the bottom, respawn it at the top
                    if (this.y > canvas.height) {
                        this.y = -Math.random() * 60;
                        this.x = Math.random() * canvas.width;
                        this.speed = Math.random() * 3 + 2;
                        this.vx = (Math.random() - 0.5) * 1.6;
                    }
                }
                
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle * Math.PI / 180);
                    ctx.fillStyle = this.color;
                    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                    ctx.restore();
                }
            }
            
            for (let i = 0; i < 150; i++) {
                confettiPieces.push(new Piece());
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confettiPieces.forEach(piece => {
                    piece.update();
                    piece.draw();
                });
                confettiAnimationFrame = requestAnimationFrame(animate);
            }
            
            animate();
            confettiActive = true;
        }
        
        // Keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key === "Escape") {
                // Optional: reset if needed
            }
        });

        // Initialize touch / pointer swipe support for the photo slider
        function initSliderSwipe() {
            const slidesEl = document.getElementById('slides');
            if (!slidesEl) return;
            let startX = 0;
            let pointerActive = false;
            let activePointerId = null;
            const THRESHOLD = 50; // px

            slidesEl.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            slidesEl.addEventListener('touchend', (e) => {
                const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
                const dx = endX - startX;
                if (Math.abs(dx) > THRESHOLD) {
                    if (dx > 0) prevSlide(); else nextSlide();
                }
            });

            // pointer events for stylus / pointer-capable tablets
            slidesEl.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse') return;
                pointerActive = true;
                activePointerId = e.pointerId;
                startX = e.clientX;
                try { slidesEl.setPointerCapture(activePointerId); } catch (err) {}
            });

            slidesEl.addEventListener('pointerup', (e) => {
                if (!pointerActive) return;
                pointerActive = false;
                try { slidesEl.releasePointerCapture(activePointerId); } catch (err) {}
                const dx = e.clientX - startX;
                if (Math.abs(dx) > THRESHOLD) {
                    if (dx > 0) prevSlide(); else nextSlide();
                }
            });

            slidesEl.addEventListener('pointercancel', () => { pointerActive = false; });
        }

        // Make body scrollable if needed and initialize components
        window.onload = () => {
            loadTextEdits();
            initSliderSwipe();
            console.log("%c❤️ Made with love for your girlfriend ❤️", "color:#ff1493; font-size:16px; font-family: cursive;");
        };