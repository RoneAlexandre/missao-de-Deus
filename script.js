// ===== HIDE HEADER ON SCROLL =====
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrollando para baixo
        header.classList.add('header-hidden');
    } else {
        // Scrollando para cima
        header.classList.remove('header-hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Menu Mobile
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle do menu
mobileBtn.addEventListener('click', () => {
    const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');

    // Trocar ícone
    const icon = mobileBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// ===== CARROSSEL SWIPER =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrossel
    // Inicializar carrossel (com verificação)
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.photo-carousel', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }


    // ===== MODAL DE PAGAMENTO =====
    const paymentModal = document.getElementById('paymentModal');
    const openModalBtns = document.querySelectorAll('.open-payment-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const confirmDonationBtn = document.querySelector('.confirm-donation');

    if (paymentModal) {
        // Abrir modal (se houver botões)
        if (openModalBtns && openModalBtns.length) {
            openModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    paymentModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });
        }

        // Fechar modal
        function closeModal() {
            paymentModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

        // Fechar modal ao clicar fora
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                closeModal();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Selecionar método de pagamento
        if (paymentMethods && paymentMethods.length) {
            paymentMethods.forEach(method => {
                method.addEventListener('click', () => {
                    paymentMethods.forEach(m => m.classList.remove('active'));
                    method.classList.add('active');
                });
            });
        }

        // Selecionar valor
        if (amountButtons && amountButtons.length) {
            amountButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    amountButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (customAmountInput) customAmountInput.value = '';
                });
            });
        }

        // Valor personalizado
        if (customAmountInput) {
            customAmountInput.addEventListener('input', () => {
                if (amountButtons && amountButtons.length) amountButtons.forEach(b => b.classList.remove('active'));
            });
        }

        // Copiar chave PIX
        if (copyButtons && copyButtons.length) {
            copyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const textToCopy = btn.getAttribute('data-copy') || btn.textContent || '';

                    // Usar Clipboard API se disponível
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(textToCopy)
                            .then(() => {
                                showCopyFeedback(btn);
                            })
                            .catch(err => {
                                console.error('Erro ao copiar:', err);
                                fallbackCopy(textToCopy, btn);
                            });
                    } else {
                        fallbackCopy(textToCopy, btn);
                    }
                });
            });
        }

        function fallbackCopy(text, btn) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                showCopyFeedback(btn);
            } catch (err) {
                console.error('Fallback: Erro ao copiar texto', err);
                alert('Não foi possível copiar. Copie manualmente: ' + text);
            }

            document.body.removeChild(textArea);
        }

        function showCopyFeedback(btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            btn.classList.add('copied');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }

        // Confirmar doação
        if (confirmDonationBtn) {
            confirmDonationBtn.addEventListener('click', () => {
                const activeMethod = document.querySelector('.payment-method.active');
                const method = activeMethod ? activeMethod.getAttribute('data-method') : 'pix';

                // Obter valor selecionado
                let amount = '';
                const activeAmountBtn = document.querySelector('.amount-btn.active');
                if (activeAmountBtn) {
                    amount = activeAmountBtn.getAttribute('data-amount');
                } else if (customAmountInput && customAmountInput.value) {
                    amount = customAmountInput.value;
                } else {
                    amount = '100'; // Valor padrão
                }

                // Se SweetAlert2 não estiver disponível, fallback simples
                if (typeof Swal === 'undefined') {
                    alert('Oferta Confirmada!\nValor: R$ ' + amount + '\nMétodo: ' + method.toUpperCase());
                    closeModal();
                    return;
                }

                // Mostrar confirmação
                Swal.fire({
                    title: 'Oferta Confirmada!',
                    html: `
                        <div style="text-align: left; padding: 20px;">
                            <p><strong>Valor:</strong> R$ ${amount}</p>
                            <p><strong>Método:</strong> ${method.toUpperCase()}</p>
                            <p><strong>Status:</strong> Aguardando confirmação</p>
                            <hr style="margin: 15px 0;">
                            <p style="font-size: 0.9em; color: #666;">
                                <i class="fas fa-info-circle"></i> Você receberá um comprovante por e-mail em breve.
                            </p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#27ae60',
                    customClass: {
                        popup: 'sweet-alert-popup'
                    }
                }).then(() => {
                    closeModal();

                    // Resetar formulário
                    if (amountButtons && amountButtons.length) {
                        amountButtons.forEach(b => b.classList.remove('active'));
                        if (amountButtons.length > 2) amountButtons[2].classList.add('active'); // R$ 100
                    }
                    if (customAmountInput) customAmountInput.value = '';
                });
            });
        }
    }

    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ANIMAÇÃO DE ENTRADA =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.timeline-item, .mission-card, .donation-card, .bible-card').forEach(el => {
        observer.observe(el);
    });

    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Simular delay de envio
            setTimeout(() => {
                Swal.fire({
                    title: 'Mensagem Enviada!',
                    text: 'Obrigado pelo contato. Em breve responderei sua mensagem.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#27ae60'
                });

                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.reset();
            }, 1500);
        });
    }

    // ===== NEWSLETTER =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');

            if (emailInput.value) {
                const btn = this.querySelector('button');
                const originalHTML = btn.innerHTML;

                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                setTimeout(() => {
                    Swal.fire({
                        title: 'Inscrição Confirmada!',
                        text: 'Você receberá nossas atualizações por e-mail.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#27ae60'
                    });

                    emailInput.value = '';
                    btn.innerHTML = originalHTML;
                }, 1000);
            }
        });
    }

    // ===== HEADER COM EFEITO DE SCROLL =====
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll para baixo
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll para cima
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });

    // ===== BOTÃO VOLTAR AO TOPO =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');

    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--gradient-accent);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // ===== CARREGAMENTO INICIAL =====
    document.body.classList.add('loaded');

    // Inicializar tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(el => {
        el.setAttribute('aria-label', el.getAttribute('title'));
    });
});

// ===== SWEETALERT2 ESTILOS PERSONALIZADOS =====
const style = document.createElement('style');
style.textContent = `
    .swal2-popup {
        font-family: var(--font-body);
        border-radius: var(--radius-lg) !important;
    }
    
    .sweet-alert-popup {
        max-width: 500px !important;
    }
    
    .swal2-title {
        color: var(--primary) !important;
        font-family: var(--font-heading) !important; 
    }
    
    .swal2-confirm {
        background: var(--gradient-accent) !important;
        border: none !important;
        padding: 12px 30px !important;
        border-radius: 50px !important;
        font-weight: 600 !important;
    }
`;
document.head.appendChild(style);

