// GSAP ScrollToPlugin 등록
gsap.registerPlugin(ScrollToPlugin);

const images = [
  'images/이미지 예시1.jpg',
  'images/이미지 예시2.jpg',
  'images/이미지 예시3.jpg',
  'images/이미지 예시4.JPG',
  'images/이미지 예시5.jpg'
];

const controller = new ScrollMagic.Controller();
const tabs = document.querySelectorAll('.hex-tab');
const triggers = [...Array(images.length).keys()].map(i => document.getElementById(`trigger-${i}`));

// 스크롤에 따른 이미지/텍스트/헤더 active 변경
images.forEach((img, idx) => {
  new ScrollMagic.Scene({
    triggerElement: `#trigger-${idx}`,
    duration: window.innerHeight,
    triggerHook: 0.5
  })
  .on("enter", () => {
    // 이미지 변경
    gsap.to(".thumbnail", {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        document.querySelector(".thumbnail").src = images[idx];
        gsap.to(".thumbnail", {opacity: 1, duration: 0.3});
      }
    });

    // 설명 텍스트 변경
    document.querySelectorAll('.desc').forEach((el, i) => {
      el.style.display = (i === idx) ? 'block' : 'none';
    });

    // 헤더 탭 active 변경
    tabs.forEach(tab => tab.classList.remove('active'));
    const currentTab = document.querySelector(`.hex-tab[data-index="${idx}"]`);
    if (currentTab) currentTab.classList.add('active');
  })
  .addTo(controller);
});

// 탭 클릭 시 해당 섹션으로 부드럽게 스크롤 이동
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = Number(tab.getAttribute('data-index'));
    if (idx >= 0 && idx < triggers.length) {
      const target = triggers[idx];
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target.offsetTop },
        ease: "circ.out"
      });
    }
  });
});

// 폼 제출 이벤트 (수정)
const form = document.getElementById('message-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('메시지가 전송되었습니다. 감사합니다!');
    form.reset();
  });
} else {
  console.warn('message-form 폼 요소를 찾을 수 없습니다.');
}
