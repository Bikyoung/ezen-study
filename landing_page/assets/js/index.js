let colorCircleArr = document.querySelectorAll(".color-circle");
let radioBtnArr = document.querySelectorAll(".radio-btn");

/* 색상 버튼 원 선택 시, 카드 내 휴대폰 이미지 변경 
   colorCircle에 적용할 eventListener를 반복문을 통해 한번에 생성 및 등록 */
colorCircleArr.forEach((colorCircle) => {
    colorCircle.addEventListener("click", function () {

        // 내 요소에 data-src 속성 값을 가져옴
        let dataSrc = this.dataset.src;

        /* 클릭된 버튼의 카드를 선택하기 위해 closest()를 사용
           closest() : 조건에 부합하는 가장 가까운 상위 요소를 찾음 */
        let cardElement = this.closest(".recommend-card");

        // querySelector나 querySelectorAll() : 하위 요소를 선택
        let phoneImageArea = cardElement.querySelector(".phone-image-area");

        // setAttribute()로 속성 값을 변경
        phoneImageArea.setAttribute("src", dataSrc);

        /* 클릭된 버튼의 테두리 색상 변경
           모든 버튼에서 selected 클래스명을 삭제고, 해당 요소에 selected 클래스명을 추가 */

        // 현재 카드의 모든 색상 원을 선택
        let cardElementColorCircleArr = cardElement.querySelectorAll(".color-circle");

        // classList : 해당 요소가 갖는 클래스 목록을 반환하는 객체
        cardElementColorCircleArr.forEach((colorCircle) => {
            colorCircle.classList.remove("selected"); // 모든 버튼에서 selected 클래스명 삭제
        });

        this.classList.add("selected");

    });
});

// 용량 버튼 클릭 시, 카드 내 가격 정보 변경
radioBtnArr.forEach((radioBtn) => {
    radioBtn.addEventListener("click", function () {
        let cardElement = this.closest(".recommend-card");  // 현재 카드 선택 
        let beforeCost = cardElement.querySelector(".before-cost-del");  // 카드 내 출고가 영역 선택
        let afterCost = cardElement.querySelector(".after-cost");  // 카드 내 현재가 영역 선택

        // 값 변경
        beforeCost.textContent = this.dataset.beforeCost;
        afterCost.textContent = this.dataset.afterCost;
    });
});




// recommend-sec에 슬라이드 구현
// new Swiper(슬라이드가 적용될 요소, 옵션 객체)
const recommendSecSwiper = new Swiper(".recommend-sec .swiper", {
    /* 한번에 보여줄 슬라이드 갯수를 지정
       단, 이로 인해 슬라이드의 너비가 swiper에 의해 자동 조절될 수 있음
       자동 조절이 싫으면 속성 값을 "auto"로 정하고, 슬라이드의 너비를 직접 지정 
    */
    slidesPerView: "auto",

    // 마지막 슬라이드에서 다시 첫 슬라이드로 넘어가게 안함 (1-2-3-1 X)
    loop: false,
    // navigation으로 좌우 화살표 버튼 영역을 지정하면 자동으로 화살표 버튼이 생성됨
    navigation: {
        nextEl: ".swiper-next-btn",
        prevEl: ".swiper-pre-btn"
    },
    // pagination 속성으로 인디케이터 영역 지정 및 클릭 가능 여부를 설정
    pagination: {
        el: ".swiper-indicator",
        clickable: true
    },

    // Swiper의 breakpoint
    breakpoints: {
        // 화면 너비가 1025px 이상일 때
        1025: {
            // 슬라이드 간의 간격 (단위는 별도로 지정하지 않지만 픽셀임)
            spaceBetween: 26,
        },
        769: {
            spaceBetween: 43

        },
        320: {
            spaceBetween: 40
        }
    }
});

// benefit-sec
// 카드가 뷰포트에 진입할 시, 회전하며 등장
let benefitFrontCard = document.querySelector(".front-card");
let benefitCardArr = document.querySelectorAll(".benefit-card");

/* IntersectionObserver(callback, options)
   : 특정 요소가 뷰포트 또는 다른 요소와 교차하는지 여부를 비동기적으로 관찰해주는 JS API
     만일, 뷰포트가 아닌 다른 요소를 기준 요소로 지정하고 싶다면, options 객체의 root 속성으로 지정할 것 (기본값은 뷰포트임)
     entries : 관찰 중인 여러 요소들의 교차 상태 정보를 담은 객체 배열
               만일 한 요소만 관찰하더라도 배열 상태를 유지하고, 원소의 갯수는 1개 뿐임
     entry : entries의 원소 
     isIntersecting : 해당 요소가 임계값으로 설정한만큼 겹치면 true를 반환하는 속성
     threshold : 해당 요소가 얼마나 겹쳐야 콜백을 실행할지를 설정 (0.0 ~ 1.0)*/
const observerObj = new IntersectionObserver((entries) => {
    entries.forEach(
        (entry) => {
            if (entry.isIntersecting) {
                for (let i = 1; i < benefitCardArr.length; i++) {
                    let degree = -15 * i;
                    /* css 속성 값으로 JS 변수를 사용하려면 ${변수명}으로 입력해야 하며, 
                       JS에서 문자열 안에 변수값을 넣고 싶다면 백틱으로 문자열을 조합해야 함 */
                    // css에서 지정한 translate가 무효화되므로 다시 지정
                    benefitCardArr[i].style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;
                }
            }
        }
    );
}, { threshold: 1.0 });

// benefitFrontCard를 IntersectionObserver의 관찰 대상으로 등록함
observerObj.observe(benefitFrontCard);

// gsap 사용
// 이전 버튼 및 다음 버튼 클릭 시, 카드들이 기존 회전 값에 += 15deg 되어 회전됨

const nextBtn = document.querySelector(".benefit-next-btn");
let currentBenefitArr = Array.from(benefitCardArr);

if (currentBenefitArr.length === 1) {
    console.log("현재 카드 갯수 " + currentBenefitArr.length);
    nextBtn.disabled = true;
}

nextBtn.addEventListener("click", () => {
    /* 이전에 준 transition 속성으로 첫번째 카드와 나머지 카드의 회전 속도가 다르므로 transition 속성을 해제
    단, 배열에는 style 속성이 없기 때문에 하나씩 해제 
    */

    // nextBtn.disabled = true;
    benefitCardArr.forEach(benefitCard => {
        benefitCard.style.transition = "none";
    })

    gsap.to(currentBenefitArr, {
        duration: 1, rotation: "+=15", ease: "power1.inOut", stagger: 0

    });

    currentBenefitArr[0].style.opacity = "0";
    currentBenefitArr[0].style.transition = "opacity 0.5s ease-in-out";

    // benefitCardArr은 nodelist이지 배열이 아니므로 첫번째 원소를 삭제하기 위해 배열로 변환

    currentBenefitArr.shift();
    currentBenefitArr[0].style.cssText += "background-color: #FFF3E0; box-shadow: 8px 12px 24px rgba(0, 0, 0, 0.5); delay: 1s";
    console.log("리스너 내부 " + currentBenefitArr.length);

});

if (currentBenefitArr.length === 1) {
    nextBtn.disabled = true;
}



