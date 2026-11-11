/**
 * DISTRITO 44 - JavaScript Común
 * Funcionalidades compartidas por todas las páginas
 */

document.addEventListener('DOMContentLoaded', function () {

    // ===== MENÚ MÓVIL =====
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-menu a');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    navbarLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navbarMenu.classList.contains('active')) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ===== MARCAR PÁGINA ACTIVA =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navbarLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ===== NAVBAR SCROLL =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== ANIMACIONES AL SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.card, .feature-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));

    // ===== VALIDACIÓN FORMULARIO CONTACTO =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formSuccess = document.getElementById('form-success');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Limpiar errores previos
            document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('error'));

            let isValid = true;

            // Validar nombre
            const nombre = document.getElementById('nombre');
            if (!nombre.value.trim()) {
                mostrarError('nombre');
                isValid = false;
            }

            // Validar email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                mostrarError('email');
                isValid = false;
            }

            // Validar teléfono
            const telefono = document.getElementById('telefono');
            if (!telefono.value.trim() || telefono.value.length < 9) {
                mostrarError('telefono');
                isValid = false;
            }

            // Validar mensaje
            const mensaje = document.getElementById('mensaje');
            if (!mensaje.value.trim() || mensaje.value.length < 10) {
                mostrarError('mensaje');
                isValid = false;
            }

            if (isValid) {
                // Aquí iría el código para enviar el formulario a tu servidor
                // Por ahora, simplemente mostramos el mensaje de éxito
                formSuccess.style.display = 'block';
                contactForm.reset();

                // Scroll al mensaje de éxito
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }
        });

        function mostrarError(campo) {
            const input = document.getElementById(campo);
            const error = document.getElementById(campo + '-error');
            input.classList.add('error');
            error.style.display = 'block';
        }
    }

});