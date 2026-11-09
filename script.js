// ===== EXPANDING PANELS =====
const panels = document.querySelectorAll('.panel');

function openPanel(target) {
    panels.forEach((panel) => {
        const isTarget = panel === target;
        panel.classList.toggle('is-open', isTarget);
        panel.querySelector('.panel-head').setAttribute('aria-expanded', String(isTarget));
    });
}

panels.forEach((panel) => {
    const head = panel.querySelector('.panel-head');

    // Tap or click (phones, and keyboard Enter/Space)
    head.addEventListener('click', () => openPanel(panel));

    // Keyboard focus anywhere inside the panel
    panel.addEventListener('focusin', () => openPanel(panel));

    // Hover, only on devices that really hover and have the wide layout
    panel.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover) and (min-width: 800px)').matches) {
            openPanel(panel);
        }
    });
});

// ===== HERO VIDEO PAUSE BUTTON =====
const heroVideo = document.getElementById('heroVideo');
const videoToggle = document.getElementById('videoToggle');

if (heroVideo && videoToggle) {
    videoToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
            heroVideo.play();
            videoToggle.textContent = 'Pause';
            videoToggle.setAttribute('aria-label', 'Pause background video');
        } else {
            heroVideo.pause();
            videoToggle.textContent = 'Play';
            videoToggle.setAttribute('aria-label', 'Play background video');
        }
    });
}

// ===== THEME TOGGLE (light / dark) =====
const themeToggle = document.getElementById('themeToggle');

function setThemeLabel(theme) {
    themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
}

if (themeToggle) {
    setThemeLabel(document.documentElement.getAttribute('data-theme'));

    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        setThemeLabel(next);
        try {
            localStorage.setItem('theme', next);
        } catch (err) {
            console.log(err);
        }
    });
}

// ===== CONTACT FORM: VALIDATE, THEN SEND =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Clear previous messages and red boxes
        formError.hidden = true;
        formSuccess.hidden = true;
        contactForm.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));

        // 2. Validate every field
        const errors = [];

        // NAME
        const nameField = contactForm.elements['name'];
        if (nameField.value.trim().length < 2) {
            nameField.classList.add('invalid');
            errors.push('Enter your name.');
        }

        // EMAIL
        const emailField = contactForm.elements['email'];
        const emailVal = emailField.value.trim();
        if (emailVal === '') {
            emailField.classList.add('invalid');
            errors.push('Enter your email address.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            emailField.classList.add('invalid');
            errors.push('Enter a valid email address, like name@example.com.');
        }

        // MESSAGE: at least 10 characters
        const messageField = contactForm.elements['message'];
        const messageLength = messageField.value.trim().length;
        console.log('TEST: validation ran, message length =', messageLength);
        if (messageLength < 10) {
            messageField.classList.add('invalid');
            errors.push(`Your message needs at least 10 characters (you typed ${messageLength}).`);
        }

        // 3. THE GUARD: any error blocks the send
        if (errors.length > 0) {
            formError.textContent = errors.join(' ');
            formError.hidden = false;
            contactForm.querySelector('.invalid').focus();
            return;
        }

        // 4. Send
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formSuccess.textContent = 'Message sent successfully. I will get back to you soon.';
                formSuccess.hidden = false;
                contactForm.reset();
            } else {
                formError.textContent = "Sorry, your message wasn't sent. Please try again.";
                formError.hidden = false;
            }
        } catch (err) {
            console.log(err);
            formError.textContent = 'Network error. Please check your connection and try again.';
            formError.hidden = false;
        } finally {
            submitBtn.disabled = false;
        }
    });
}