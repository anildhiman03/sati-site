/* ============================================
   NEXALINK TELECOM - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Page Loader ---
    const loader = document.querySelector('.page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 400);
        });
        // Fallback: hide loader after 2s
        setTimeout(() => loader.classList.add('hidden'), 2000);
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            if (navOverlay) navOverlay.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                if (navOverlay) navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Back to Top Button ---
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));

            // Open clicked if not already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Stat Counter Animation ---
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCount = () => {
                        current += step;
                        if (current < target) {
                            el.textContent = Math.floor(current) + suffix;
                            requestAnimationFrame(updateCount);
                        } else {
                            el.textContent = target + suffix;
                        }
                    };
                    updateCount();
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => countObserver.observe(c));
    }

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formFields = {
            firstName: {
                element: document.getElementById('firstName'),
                error: document.getElementById('firstNameError'),
                validate: (value) => {
                    if (!value.trim()) return 'First name is required';
                    if (value.trim().length < 2) return 'First name must be at least 2 characters';
                    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Please enter a valid name';
                    return '';
                }
            },
            lastName: {
                element: document.getElementById('lastName'),
                error: document.getElementById('lastNameError'),
                validate: (value) => {
                    if (!value.trim()) return 'Last name is required';
                    if (value.trim().length < 2) return 'Last name must be at least 2 characters';
                    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Please enter a valid name';
                    return '';
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: (value) => {
                    if (!value.trim()) return 'Email address is required';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
                    return '';
                }
            },
            phone: {
                element: document.getElementById('phone'),
                error: document.getElementById('phoneError'),
                validate: (value) => {
                    if (!value.trim()) return 'Phone number is required';
                    if (!/^[\d\s\-\+\(\)]{7,15}$/.test(value.trim())) return 'Please enter a valid phone number';
                    return '';
                }
            },
            service: {
                element: document.getElementById('service'),
                error: document.getElementById('serviceError'),
                validate: (value) => {
                    if (!value) return 'Please select a service';
                    return '';
                }
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('messageError'),
                validate: (value) => {
                    if (!value.trim()) return 'Message is required';
                    if (value.trim().length < 10) return 'Message must be at least 10 characters';
                    return '';
                }
            }
        };

        // Real-time validation on blur
        Object.keys(formFields).forEach(key => {
            const field = formFields[key];
            if (field.element) {
                field.element.addEventListener('blur', () => {
                    validateField(field);
                });

                field.element.addEventListener('input', () => {
                    // Clear error styling on input
                    if (field.element.classList.contains('error')) {
                        field.element.classList.remove('error');
                        field.error.classList.remove('visible');
                        field.error.textContent = '';
                    }
                });
            }
        });

        function validateField(field) {
            const errorMsg = field.validate(field.element.value);
            if (errorMsg) {
                field.element.classList.add('error');
                field.element.classList.remove('success');
                field.error.textContent = errorMsg;
                field.error.classList.add('visible');
                return false;
            } else {
                field.element.classList.remove('error');
                field.element.classList.add('success');
                field.error.classList.remove('visible');
                field.error.textContent = '';
                return true;
            }
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Validate all fields
            Object.keys(formFields).forEach(key => {
                const field = formFields[key];
                if (field.element) {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                // Show success message
                const formWrapper = document.getElementById('formWrapper');
                const successMsg = document.getElementById('formSuccess');

                if (formWrapper && successMsg) {
                    formWrapper.style.display = 'none';
                    successMsg.classList.add('visible');
                }

                // Reset form
                contactForm.reset();
                Object.keys(formFields).forEach(key => {
                    if (formFields[key].element) {
                        formFields[key].element.classList.remove('success', 'error');
                    }
                });
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.form-input.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // --- Active Nav Link Highlight ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a:not(.nav-cta .btn)').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});
