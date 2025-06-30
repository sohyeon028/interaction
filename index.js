document.addEventListener('DOMContentLoaded', function() {
    // ScrollMagic 
    // var controller = new ScrollMagic.Controller();

    const sectionsWrapper = document.querySelector('.sections-wrapper');
    const sections = Array.from(document.querySelectorAll('.main-content, .portfolio-section, .gallery-section'));
    const navTabs = document.querySelectorAll('.main-nav li');
    const sectionHeight = 500; // 각 섹션의 고정 높이 (CSS와 일치해야 함)
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0; 

    let currentSectionIndex = 0;
    let isAnimating = false;

    
    const sectionMap = {
        'cover': 0,
        'profile': 1,
        'portfolio': 2,
        'gallery': 3,
        'community': 4
    };

    // 섹션 전환 함수
    function goToSection(index) {
        if (isAnimating || index < 0 || index >= sections.length) {
            return;
        }

        isAnimating = true;
        
        // 현재 섹션 비활성화
        sections[currentSectionIndex].classList.remove('active');
        
        // 새 섹션 활성화
        sections[index].classList.add('active');
        
        // 스크롤 위치 조정 (헤더 높이만큼 오프셋)
        const targetSection = sections[index];
        const targetOffset = targetSection.offsetTop - headerHeight;
        
        // 부드러운 스크롤 애니메이션
        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });
        
        // 애니메이션 완료 후 상태 업데이트
        setTimeout(() => {
            isAnimating = false;
            currentSectionIndex = index;
            updateNavActiveState();
        }, 500);
    }

    // ID로 섹션 이동
    function goToSectionById(sectionId) {
        const index = sectionMap[sectionId];
        if (index !== undefined) {
            goToSection(index);
        }
    }

    // 내비게이션 active 상태 업데이트
    function updateNavActiveState() {
        navTabs.forEach((tab, idx) => {
            if (idx === currentSectionIndex) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // 마우스 휠 이벤트 리스너
    window.addEventListener('wheel', function(event) {
        if (isAnimating) {
            event.preventDefault();
            return;
        }

        event.preventDefault();

        if (event.deltaY > 0) {
            goToSection(currentSectionIndex + 1);
        } else {
            goToSection(currentSectionIndex - 1);
        }
    }, { passive: false });

    // 내비게이션 탭 클릭 이벤트 리스너
    navTabs.forEach((tab, index) => {
        tab.addEventListener('click', function(event) {
            event.preventDefault(); // 기본 링크 동작 방지
            goToSection(index);
        });
    });

    // 페이지 로드 시 초기 상태 설정
    sections[0].classList.add('active');
    updateNavActiveState();

    // 갤러리 Swiper (한 줄, 2개씩 크게, 무한 루프, 프로그레스바 페이지네이션)
    new Swiper('.gallery-main', {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'progressbar'
        }
    });

    // 텍스트 글자별로 분리하는 함수
    function wrapLetters() {
        const typingText = document.querySelector('.typing-text');
        const text = typingText.textContent.trim();
        const letters = text.split('');
        
        // HTML 태그를 보존하면서 각 글자를 span으로 감싸기
        let currentHTML = typingText.innerHTML;
        let inTag = false;
        let newHTML = '';
        
        for(let i = 0; i < currentHTML.length; i++) {
            if(currentHTML[i] === '<') {
                inTag = true;
                newHTML += currentHTML[i];
            } else if(currentHTML[i] === '>') {
                inTag = false;
                newHTML += currentHTML[i];
            } else if(!inTag && currentHTML[i] !== ' ' && currentHTML[i] !== '\n') {
                newHTML += `<span>${currentHTML[i]}</span>`;
            } else {
                newHTML += currentHTML[i];
            }
        }
        
        typingText.innerHTML = newHTML;
    }

    wrapLetters();

    // 불꽃놀이 효과
    const container = document.getElementById('cover');
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function pastelColor() {
        const pastel = [
            //'rgba(255, 183, 197, 0.7)', // 연분홍
            //'rgba(186, 225, 255, 0.7)', // 연파랑
            //'rgba(255, 236, 179, 0.7)', // 연노랑
            //'rgba(204, 153, 255, 0.7)', // 연보라
            //'rgba(178, 235, 242, 0.7)'  // 연청록
            'rgba(255, 80, 115, 0.7)',
            'rgba(176, 80, 255, 0.7)',
            'rgba(80, 83, 255, 0.7)',
            'rgba(80, 255, 89, 0.7)',
            'rgba(255, 214, 80, 0.7)',
        ];
        return pastel[Math.floor(Math.random() * pastel.length)];
    }

    function drawFirework(x, y) {
        for (let i = 0; i < 18; i++) {
            let angle = (i / 18) * 2 * Math.PI;
            let length = 40 + Math.random() * 20;
            let endX = x + Math.cos(angle) * length;
            let endY = y + Math.sin(angle) * length;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = pastelColor();
            ctx.lineWidth = 2 + Math.random();
            ctx.globalAlpha = 0.7;
            ctx.stroke();
        }
    }

    function fadeCanvas() {
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; // 숫자 높을 수록 흔적 빨리 사라짐
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        fadeCanvas();
        requestAnimationFrame(animate);
    }
    animate();

    // 클릭 시 감성 불꽃놀이
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        drawFirework(e.clientX - rect.left, e.clientY - rect.top);
    });
    // 메인 진입 시 한 번 실행 (중앙)
    setTimeout(() => {
        drawFirework(canvas.width/2, canvas.height/2);
    }, 800);

    // 4초에 한 번, 화면 전체에 4개 불꽃 터뜨리기
    setInterval(() => {
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            drawFirework(x, y);
        }
    }, 4000);
});
