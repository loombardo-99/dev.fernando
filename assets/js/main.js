// Configuração inicial e Imports
gsap.registerPlugin(ScrollTrigger);

class Experience {
    constructor() {
        this.container = document.querySelector('#webgl');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = null;

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
        this.camera.position.z = 6;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.mouse = new THREE.Vector2();
        this.targetMouse = { x: 0, y: 0 };
        this.inputFocus = null; // Novo: Rastrear foco em inputs
        this.warpSpeed = false; // Novo: Efeito de velocidade

        this.objects = [];

        this.init();
    }

    init() {
        this.addObjects();
        this.handleEvents();
        this.render();
    }

    addObjects() {
        // CONCEITO V5: Fluxo Etéreo (Luz Viva)
        const orbsCount = 6;
        this.orbs = [];

        const texture = this.createSoftGlowTexture();
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < orbsCount; i++) {
            const sprite = new THREE.Sprite(material);

            sprite.position.x = (Math.random() - 0.5) * 50;
            sprite.position.y = (Math.random() - 0.5) * 30;
            sprite.position.z = -10 - Math.random() * 20;

            const scale = 20 + Math.random() * 20;
            sprite.scale.set(scale, scale, 1);

            sprite.userData = {
                angle: Math.random() * Math.PI * 2,
                radius: 5 + Math.random() * 10,
                speed: 0.1 + Math.random() * 0.2,
                basePos: sprite.position.clone(),
                pulseSpeed: 0.2 + Math.random() * 0.5,
                baseScale: scale
            };

            this.scene.add(sprite);
            this.orbs.push(sprite);
        }
    }

    createSoftGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 230, 200, 0.4)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    handleEvents() {
        window.addEventListener('resize', this.resize.bind(this));

        window.addEventListener('mousemove', (e) => {
            this.targetMouse = {
                x: (e.clientX / this.width) * 2 - 1,
                y: -(e.clientY / this.height) * 2 + 1
            };
        });
    }

    // Novos Métodos de Interação
    setInputFocus(x, y) {
        this.inputFocus = { x, y };
    }

    removeInputFocus() {
        this.inputFocus = null;
    }

    triggerWarpSpeed() {
        this.warpSpeed = true;
        setTimeout(() => {
            this.warpSpeed = false;
        }, 2000);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        const time = performance.now() * 0.001;

        if (this.orbs) {
            this.orbs.forEach((orb, i) => {

                // Lógica de Movimento Base
                let speedMultiplier = this.warpSpeed ? 5 : 1;
                orb.userData.angle += orb.userData.speed * 0.01 * speedMultiplier;

                // Posição base (orbital)
                let targetX = orb.userData.basePos.x + Math.cos(orb.userData.angle + i) * orb.userData.radius;
                let targetY = orb.userData.basePos.y + Math.sin(orb.userData.angle * 0.8 + i) * orb.userData.radius;

                // Lógica de Atração vs Repulsão
                if (this.inputFocus) {
                    // MODO ATRAÇÃO (Foco no Input)
                    const focusX = this.inputFocus.x * 20;
                    const focusY = this.inputFocus.y * 10;

                    targetX = targetX * 0.9 + focusX * 0.1;
                    targetY = targetY * 0.9 + focusY * 0.1;

                    orb.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
                } else {
                    // MODO REPULSÃO (Mouse Normal)
                    const dx = this.targetMouse.x * 30 - orb.position.x;
                    const dy = this.targetMouse.y * 15 - orb.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 15 && !this.warpSpeed) {
                        const force = (15 - dist) / 15;
                        targetX -= dx * force * 0.05;
                        targetY -= dy * force * 0.05;
                    }

                    const pulse = Math.sin(time * orb.userData.pulseSpeed + i);
                    orb.material.opacity = 0.15 + pulse * 0.05;
                }

                if (this.warpSpeed) {
                    orb.position.z += 0.5;
                    if (orb.position.z > 5) orb.position.z = -40;
                }

                orb.position.x += (targetX - orb.position.x) * 0.05;
                orb.position.y += (targetY - orb.position.y) * 0.05;

                const scaleBase = orb.userData.baseScale || 20;
                const scaleVar = this.inputFocus ? scaleBase * 0.6 : scaleBase;
                orb.scale.set(scaleVar, scaleVar, 1);
            });
        }

        this.camera.position.x += (this.targetMouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.targetMouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(0, 0, -30);

        this.renderer.render(this.scene, this.camera);
    }
}

// Inicialização e Interações
document.addEventListener('DOMContentLoaded', () => {

    const experience = new Experience();

    // ---------------------------------------------
    // 2. Rolagem Horizontal (ScrollTrigger)
    // ---------------------------------------------
    const sections = gsap.utils.toArray(".panel");
    if (sections.length > 0) {
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-scroll-wrapper",
                pin: true,
                scrub: 1,
                end: () => "+=" + document.querySelector(".horizontal-scroll-wrapper").offsetWidth
            }
        });
    }

    // ---------------------------------------------
    // 3. Botões Magnéticos
    // ---------------------------------------------
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            gsap.to(btn, {
                x: (e.clientX - rect.left - rect.width / 2) * 0.3,
                y: (e.clientY - rect.top - rect.height / 2) * 0.3,
                duration: 0.3
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5 });
        });
    });

    // ---------------------------------------------
    // 4. Revelação de Foto (Sobre)
    // ---------------------------------------------
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 60%",
        onEnter: () => {
            const mask = document.querySelector('.image-mask');
            if (mask) mask.classList.add('reveal');
        }
    });

    // Animação de Entrada do Hero
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
    })
        .from(".hero-subtitle", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=1")
        .from(".hero-actions", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.8");


    // ---------------------------------------------
    // 5. Modal de Detalhes do Projeto
    // ---------------------------------------------
    const projectDetails = {
        'proj1': {
            title: 'Fagulha',
            number: '01',
            tags: ['React', 'Node.js', 'PostgreSQL'],
            images: [
                'assets/img/project-commerce.png',
                'assets/img/Image_fx (10).png',
                'assets/img/Image_fx (3).png',
                'assets/img/Image_fx (4).png'
            ],
            description: 'Uma plataforma inovadora para gestão de ideias e inovação corporativa. O Fagulha permite que colaboradores submetam, votem e desenvolvam projetos internos, gamificando o processo de inovação. A interface foi desenhada para promover engajamento máximo.',
            github: 'https://github.com/loombardo-99',
            live: '#'
        },
        'proj2': {
            title: 'Oniria',
            number: '02',
            tags: ['Python', 'TensorFlow', 'OpenCV'],
            images: [
                'assets/img/project-ai.png',
                'assets/img/Image_fx (11).png',
                'assets/img/Image_fx (5).png',
                'assets/img/Image_fx (6).png'
            ],
            description: 'Sistema de visão computacional para análise de sentimentos em tempo real em espaços públicos. Utiliza redes neurais profundas para processar fluxos de vídeo e gerar mapas de calor emocionais, auxiliando no planejamento urbano e segurança.',
            github: 'https://github.com/loombardo-99',
            live: '#'
        },
        'proj3': {
            title: 'ERP Gestor',
            number: '03',
            tags: ['Three.js', 'Vue.js', 'Firebase'],
            images: [
                'assets/img/project-erp.png',
                'assets/img/Image_fx (12).png',
                'assets/img/Image_fx (7).png',
                'assets/img/Image_fx (8).png'
            ],
            description: 'Um ERP completo e imersivo que redefiniu a gestão empresarial. Com visualizações de dados em 3D e uma interface inspirada em glassmorphism, torna a análise financeira e de estoque uma experiência visualmente rica e intuitiva.',
            github: 'https://github.com/loombardo-99',
            live: '#'
        }
    };

    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const mTitle = document.querySelector('.modal-title');
    const mNumber = document.querySelector('.modal-number');
    const mTags = document.querySelector('.modal-tags');
    const mGallery = document.querySelector('.modal-gallery');
    const mDesc = document.querySelector('.modal-description');
    const mGithub = document.querySelector('.modal-link-code');
    const mLive = document.querySelector('.modal-link-live');

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data) return;

        mTitle.textContent = data.title;
        mNumber.textContent = data.number;
        mDesc.textContent = data.description;
        mGithub.href = data.github;
        mLive.href = data.live;

        mTags.innerHTML = data.tags.map(tag => `<span class="card-tags-span" style="display:inline-block; padding:0.5rem 1.5rem; border:1px solid rgba(255,255,255,0.2); border-radius:99px; margin-right:1rem; font-size:0.9rem;">${tag}</span>`).join('');

        mGallery.innerHTML = '';
        data.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'modal-img';
            img.alt = `Detalhe do projeto ${data.title}`;
            mGallery.appendChild(img);
        });

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-img');
            openModal(projectId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) closeModal(); });


    // ---------------------------------------------
    // 6. INTERAÇÃO "GOOGLE MAGIC"
    // ---------------------------------------------

    // Parte A: Ambient Focus (Orbs atraídos pelos inputs)
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const rect = input.getBoundingClientRect();
            // Calcula centro do input em coordenadas normalizadas (-1 a 1)
            const x = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
            const y = -(rect.top + rect.height / 2) / window.innerHeight * 2 + 1;

            experience.setInputFocus(x, y);
        });

        input.addEventListener('blur', () => {
            experience.removeInputFocus();
        });
    });

    // Parte B: Paper Plane Animation (Envio)
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm ? contactForm.querySelector('button') : null;

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede refresh para animação

            // Dados do formulário
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Construir link Mailto
            const subject = `Contato Portfólio: ${name}`;
            const body = `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`;
            const mailtoLink = `mailto:dev.lombardo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            const btnTextSpan = submitBtn.querySelector('.btn-text');
            const icon = submitBtn.querySelector('svg');

            // Travar largura para a animação de encolhimento funcionar bem
            // submitBtn.style.width = submitBtn.offsetWidth + 'px';

            // 1. Timeline de Animação
            const tl = gsap.timeline({
                onComplete: () => {
                    // Abrir cliente de email (Ação real)
                    window.location.href = mailtoLink;

                    // Reset após animação (apenas para demonstração)
                    setTimeout(() => {
                        // Reset visual
                        gsap.set(submitBtn, { clearProps: "all" });
                        gsap.set(icon, { clearProps: "all" });
                        if (btnTextSpan) gsap.set(btnTextSpan, { clearProps: "all" }); // Garante que o texto volte

                        submitBtn.style.opacity = '0';
                        submitBtn.style.pointerEvents = 'none';

                        // Aqui você mostraria uma div de "Sucesso"
                        const successMsg = document.createElement('div');
                        successMsg.innerHTML = '✨ Redirecionando para seu email...';
                        successMsg.style.color = '#ffd700';
                        successMsg.style.fontSize = '1.2rem';
                        successMsg.style.textAlign = 'center';
                        successMsg.style.marginTop = '1rem';

                        // Remove msg anterior se houver
                        const oldMsg = contactForm.querySelector('.success-msg');
                        if (oldMsg) oldMsg.remove();

                        successMsg.classList.add('success-msg');
                        contactForm.appendChild(successMsg);

                        gsap.from(successMsg, { y: 20, opacity: 0 });
                        contactForm.reset();

                        // Reaparecer botão após um tempo (reset total)
                        setTimeout(() => {
                            gsap.to(successMsg, { opacity: 0, height: 0, onComplete: () => successMsg.remove() });
                            submitBtn.style.opacity = '1';
                            submitBtn.style.pointerEvents = 'all';
                        }, 4000);

                    }, 500); // Delay
                }
            });

            // Passo 1: Texto desaparece (mas mantemos o ícone visível fixando a cor)
            // Importante: setar cor do SVG explicitamente antes de mexer no botão
            gsap.set(icon, { color: '#ffffff' });

            tl.to(btnTextSpan, {
                opacity: 0,
                duration: 0.2
            })
                // Passo 2: Botão vira círculo
                .to(submitBtn, {
                    width: '50px',
                    height: '50px',
                    padding: 0,
                    borderRadius: '50%',
                    backgroundColor: '#333', // Feedback visual de estado ativo
                    color: 'transparent', // Garante que nada mais vaze
                    duration: 0.4,
                    ease: 'back.in(1.2)'
                }, "-=0.1")

                // Passo 3: Ícone se prepara (gira e centraliza)
                .to(icon, {
                    x: 0, // Centralizar se necessário (como padding foi removido, flex center deve cuidar, mas ajustamos)
                    scale: 1.8,
                    rotation: -15, // Inclinação inicial
                    duration: 0.3
                }, "-=0.3")

                // Passo 4: DECOLAGEM! (Movimento rápido e orgânico)
                .to(submitBtn, {
                    x: 800,       // Voa muito para a direita
                    y: -300,      // E para cima
                    rotation: 45, // Nariz para cima
                    opacity: 0,
                    scale: 0.5,
                    duration: 1.2,
                    ease: "power2.in"
                });

            // Efeito Extra: Acelerar partículas 3D no momento da decolagem
            // Sincroniza logo antes do voo
            setTimeout(() => experience.triggerWarpSpeed(), 400);
        });
    }

});
