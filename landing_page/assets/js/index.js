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
let benefitCardNodeList = document.querySelectorAll(".benefit-card");

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
                for (let i = 1; i < benefitCardNodeList.length; i++) {
                    let degree = -15 * i;
                    /* css 속성 값으로 JS 변수를 사용하려면 ${변수명}으로 입력해야 하며, 
                       JS에서 문자열 안에 변수값을 넣고 싶다면 백틱으로 문자열을 조합해야 함 */
                    // css에서 지정한 translate가 무효화되므로 다시 지정
                    benefitCardNodeList[i].style.transform = `translate(-50%, -50%) rotate(${degree}deg)`;

                    /* 페이지 첫 로딩시에만 실행될 수 있도록, 동작 종료 후에 관찰 대상을 해제함 */
                    observerObj.unobserve(entry.target);
                }
            }
        }
    );
}, { threshold: 1.0 });

// benefitFrontCard를 IntersectionObserver의 관찰 대상으로 등록함
observerObj.observe(benefitFrontCard);


// 화살표 버튼 클릭 시, 카드가 회전하며 등장함 - gsap 사용
const BenefitPrevBtn = document.querySelector(".benefit-prev-btn");
const BenefitNextBtn = document.querySelector(".benefit-next-btn");
let benefitIndex = document.querySelector(".benefit-index");

BenefitPrevBtn.disabled = true;

/*  NodeList 
    : document.querySelectorAll() 등이 반환하는 객체로, DOM 요소들을 담고 있는 브라우저가 제공하는 API
      유사 배열일 뿐 배열은 아니라서 반복문 및 인덱스는 사용이 가능하지만 그 외의 배열 전용 메서드는 사용이 불가함
      따라서 Array.from(노드 리스트);를 통해 노드 리스트의 복사본을 배열로 변환함 
      노드 리스트가 정적인지 동적인지 여부와 관계없이 DOM 요소에 영향을 줌
     
    정적 노드 리스트
    : querySelectorAll()이 반환하는 노드 리스트로, DOM 요소가 변경되어도 정적 노드 리스트는 변경되지 않음
    
    동적 노드 리스트
    : getElementsBy*()가 반환하는 DOM과 실시간 연결된 노드 리스트로, DOM 요소가 변경되면 동적 노드 리스트는 자동 업데이트됨  */
/* 노드 리스트로 만든 배열은 생성이 된 순간, 노드 리스트와는 독립적이므로 
   동적 노드 리스트로 생성된 배열은 DOM이 변경되더라도 업데이트되지 않음 */
let benefitOriginArr = Array.from(benefitCardNodeList);
// 배열 자체를 할당하면 동일한 배열 주소를 참조하여, 하나를 수정하더라도 다른 한쪽 또한 수정되므로 slice()를 사용함
let benefitCopyArr = benefitOriginArr.slice(0);

// 버튼의 빠른 연속 클릭으로 인해 애니메이션에 비동기 타이밍 꼬임 문제가 발생할 수 있으므로 이를 방지하기 위해 애니메이션의 현재 진행 여부를 저장함
let isAnimating = false;

// 다음 화살표 누를 시 동작할 이벤트 등록
BenefitNextBtn.addEventListener("click", () => {
    if (isAnimating) {
        return; // 함수 실행을 즉시 종료
    } else {
        isAnimating = true;

        BenefitNextBtn.disabled = true;
        BenefitPrevBtn.disabled = true;

        let frontCard = benefitCopyArr[0];
        let otherCard = benefitCopyArr.slice(1);    // 1번 인덱스 요소부터 마지막 요소까지를 복사한 새로운 배열 생성

        /* gsap.to()
           : 첫번째 인수로 명시된 요소의 현재 상태를 시작점으로 잡고, 두번째 인수의 명시된 속성 값을 끝점으로 잡아 애니메이션을 실행하는 함수
             즉, 특정 요소에 현 상태에 누적하여 어떤 속성 값으로 변화시키기에 편리함 
             GSAP은 비동기 애니메이션 프레임을 사용하므로, 여러 gsap.to()는 병행 실행됨
           stagger : 여러 요소가 일정한 시간 간격으로 애니메이션을 순차적 실행하기 위한 속성
                     0으로 설정하면, 여러 요소의 애니메이션이 동시에 실행됨
           ease : 가속 / 감속 효과로 선형보다 더 부드럽고 자연스럽게 애니메이션을 실행하기 위한 속성
                  power1.in : 느리다가 빨라짐
                  power1.out: 빠르다가 느려짐
                  power1.inOut : 시작과 끝은 느리고 중간이 빠름
                  power1, power2처럼 뒤의 숫자가 클수록 가속 / 감속의 정도가 큼 */
        const FrontGsap = gsap.to(frontCard, {
            // frontCard의 gsap이 otherCard의 gsap보다 더 빨리 실행 완료되어 이질감이 느껴지므로, frontCard의 gsap에 delay 속성 값을 지정함
            opacity: 0, rotation: "+=15", duration: 0.3, stagger: 0, ease: "power1.inOut", delay: 0.25, onComplete: () => {
                frontCard.classList.remove("front-card");
                benefitCopyArr.shift(); // 배열의 첫번째 요소를 삭제
                benefitCopyArr[0].classList.add("front-card");
            }
        });

        const OtherGsap = gsap.to(otherCard, {
            rotation: "+=15", duration: 0.4, stagger: 0, ease: "power1.inOut"
        });

        // Promise : 비동기 작업의 완료를 감지하는 객체 
        // Promise.all() : 명시한 여러 비동기 작업이 종료될 때까지 기다린 후 완료 시 .then()을 수행하고, 실패 시 .catch()를 수행함
        Promise.all([FrontGsap, OtherGsap]).then(() => {
            if (benefitCopyArr.length !== 1) {
                BenefitNextBtn.disabled = false;
            }
            benefitIndex.textContent = benefitCopyArr[0].dataset.num;
            BenefitPrevBtn.disabled = false;
            isAnimating = false;
        });

    }
});

// 이전 화살표 누를 시 동작할 이벤트 등록
BenefitPrevBtn.addEventListener("click", () => {
    if (isAnimating) {
        return;
    } else {
        isAnimating = true;

        BenefitNextBtn.disabled = true;
        BenefitPrevBtn.disabled = true;

        let prevIndex = benefitOriginArr.length - benefitCopyArr.length - 1;

        benefitCopyArr[0].classList.remove("front-card");
        benefitCopyArr.unshift(benefitOriginArr[prevIndex]); // 배열에 첫번째 요소를 추가
        benefitCopyArr[0].classList.add("front-card");
        let otherCard = benefitCopyArr.slice(1);

        const FrontGsap = gsap.to(benefitCopyArr[0], {
            opacity: 1, rotation: "-=15", duration: 0.25, stagger: 0, ease: "power1.out", delay: 0.2
        });

        const OtherGsap = gsap.to(otherCard, {
            rotation: "-=15", duration: 0.25, stagger: 0, ease: "power1.inOut"
        });

        Promise.all([FrontGsap, OtherGsap]).then(() => {
            if (benefitCopyArr.length !== 6) {
                BenefitPrevBtn.disabled = false;
            }
            benefitIndex.textContent = benefitCopyArr[0].dataset.num;
            BenefitNextBtn.disabled = false;
            isAnimating = false;
        });
    }
});








