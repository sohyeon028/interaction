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
});
