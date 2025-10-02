const Body = document.querySelector("body");
const SlideMenuArea = document.querySelector(".slide-menu-area");
const HamburgerBtn = document.querySelector(".hamburger-btn");

// - 햄버거 버튼 클릭 시, 슬라이드 메뉴가 등장
HamburgerBtn.addEventListener("click", () => {
    SlideMenuArea.style.zIndex = "100";

    // 웹 페이지의 스크롤을 방지
    Body.style.overflow = "hidden";

    // 요소의 X축 위치를 원래 위치로 되돌림 
    SlideMenuArea.style.transform = "translateX(0)";
});

// 슬라이드 메뉴 퇴장
function closeSlideMenuArea() {
    SlideMenuArea.style.transform = "translateX(100%)";

    // 슬라이드 메뉴가 닫힐 때 main이 보이면서 중첩되는 현상을 해결
    SlideMenuArea.style.zIndex = "-1";
    Body.style.overflow = "auto";

}

SlideMenuArea.addEventListener("click", (event) => {
    let target = event.target;

    /* closest(selector) 
       : 현재 요소를 포함하여 가장 가까운 상위 요소에서 selector를 찾는 함수 */
    /* SlideMenuArea 내부 어디를 눌러도 무조건 닫히는 게 아니라, 
       버튼 또는 링크 클릭 시에만 닫히도록 closet()을 사용 */
    if (target.closest(".logo")
        || target.closest(".slide-menu-close-btn")
        || target.closest(".menu")) {
        closeSlideMenuArea();
    }
});


let colorCircleArr = document.querySelectorAll(".color-circle");
let radioBtnArr = document.querySelectorAll(".radio-btn");

/* - 색상 버튼 원 선택 시, 카드 내 휴대폰 이미지 변경 
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

// - 용량 버튼 클릭 시, 카드 내 가격 정보 변경
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


// - recommend-sec에 슬라이드 구현
// new Swiper(슬라이드가 적용될 요소, 옵션 객체)
function initSwiper(arg) { // JS에서는 함수의 반환형을 명시 X
    let swiperObj = new Swiper(`.recommend-sec ${arg} .swiper`, {

        observer: true,
        observeParents: true,

        /* 한번에 보여줄 슬라이드 갯수를 지정
           단, 이로 인해 슬라이드의 너비가 swiper에 의해 자동 조절될 수 있음
           자동 조절이 싫으면 속성 값을 "auto"로 정하고, 슬라이드의 너비를 직접 지정 
        */
        slidesPerView: "auto",

        // 마지막 슬라이드에서 다시 첫 슬라이드로 넘어가게 안함 (1-2-3-1 X)
        loop: false,
        // navigation으로 좌우 화살표 버튼 영역을 지정하면 자동으로 화살표 버튼이 생성됨
        navigation: {
            nextEl: `.recommend-sec ${arg} .swiper-next-btn`,
            prevEl: `.recommend-sec ${arg} .swiper-pre-btn`
        },
        // pagination 속성으로 인디케이터 영역 지정 및 클릭 가능 여부를 설정
        pagination: {
            el: `.recommend-sec ${arg} .swiper-indicator`,
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
                spaceBetween: 43,

            },
            320: {
                spaceBetween: 40
            }
        }
    });

    return swiperObj;
}

const recommendSecSwiperArr = [initSwiper(".swiper-wrap-01"), initSwiper(".swiper-wrap-02")];

// - 선택된 탭에 따라 보여지는 추천 상품이 달라짐
const TabNodeList = document.querySelectorAll(".tab-container .tab");
const TabArr = Array.from(TabNodeList);
const SwiperWrapNodeList = document.querySelectorAll(".swiper-wrap");

TabArr.forEach((tab) => {
    tab.addEventListener("click", function () {
        let index = TabArr.indexOf(this);

        // swiper가 숨겨졌다가 다시 보이게 되거나, 슬라이드 갯수가 동적으로 바뀐 경우 크기 및 개수를 재계산을 하고, 갱신하게 하기 위함
        recommendSecSwiperArr[index].update();

        TabArr.forEach((t) => { t.classList.remove("selected") });
        // this가 tab을 가리키기 위해선, 콜백 함수 선언 시 function을 사용해야 함
        this.classList.add("selected");


        SwiperWrapNodeList.forEach((swiperWrap) => {
            console.log("remove전");
            swiperWrap.classList.remove("selected");
            console.log("remove 후");
        });

        console.log("select 전");
        SwiperWrapNodeList[index].classList.add("selected");
        console.log("select 후");
    });
});


// benefit-sec
// - 카드가 뷰포트에 진입할 시, 회전하며 등장
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
const ObserverObj = new IntersectionObserver((entries) => {
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
                    ObserverObj.unobserve(entry.target);
                }
            }
        }
    );
}, { threshold: 1.0 });

// benefitFrontCard를 IntersectionObserver의 관찰 대상으로 등록함
ObserverObj.observe(benefitFrontCard);


// - 화살표 버튼 클릭 시, 카드가 회전하며 등장함 - gsap 사용
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
            opacity: 0, rotation: "+=15", duration: 0.2, stagger: 0, ease: "power1.inOut", delay: 0.2, onComplete: () => {
                frontCard.classList.remove("front-card");
                benefitCopyArr.shift(); // 배열의 첫번째 요소를 삭제
                benefitCopyArr[0].classList.add("front-card");
            }
        });

        const OtherGsap = gsap.to(otherCard, {
            rotation: "+=15", duration: 0.2, stagger: 0, ease: "power1.inOut"
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
            opacity: 1, rotation: "-=15", duration: 0.15, stagger: 0, ease: "power1.out", delay: 0.2
        });

        const OtherGsap = gsap.to(otherCard, {
            rotation: "-=15", duration: 0.15, stagger: 0, ease: "power1.inOut"
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


// review-sec
const ReviewSecSwiper = new Swiper(".review-sec .swiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false
    },
    loop: true
});


// contact-sec
// - 개인정보 수집 및 이용 동의 팝업 등장 및 퇴장  
const PopUpOverlay = document.querySelector(".popup-overlay");
const PrivacyCheckDesc = document.querySelector(".privacy-check-desc");
const PrivacyPopUp = document.querySelector(".privacy-popup");
const PrivacyPopUpCloseBtn = document.querySelector(".privacy-popup-close-btn");

// 자세히 보기 버튼 클릭 시 팝업창 등장
PrivacyCheckDesc.addEventListener("click", () => {
    PopUpOverlay.style.display = "block";
    PrivacyPopUp.style.display = "block";
    Body.style.overflow = "hidden";
});

// X 버튼 클릭 시 팝업창 퇴장
PrivacyPopUpCloseBtn.addEventListener("click", () => {
    PrivacyPopUp.style.display = "none";
    PopUpOverlay.style.display = "none";
    Body.style.overflow = "auto";
});

// - 유효성 메시지 팝업 등장 및 퇴장
const Form = document.querySelector(".contact-form");
const InputUserName = document.querySelector("#user-name");
const InputPhoneNumber = document.querySelector("#phone-number");
const InputContent = document.querySelector("#content-input");
const InputPrivacyCheck = document.querySelector("#privacy-check");
const ErrorMessageElement = document.querySelector(".error-message");
const InputInvalidPopup = document.querySelector(".input-invalid-popup");

/* addEventListener() 
   : 항상 콜백 함수에 event 객체를 전달함
     하지만 해당 콜백 함수가 event 객체(발생한 event에 관한 정보를 담고 있는 객체 ex) 이벤트 발생 시점, 종류 등)를 
     사용할 필요가 없다면 event 객체를 담을 매개변수가 없어도 됨
     JS는 함수의 매개변수 개수와 인수의 개수가 달라도 문제 X */

// 유효성 메시지 팝업 등장
Form.addEventListener("submit", (event) => {
    Body.style.overflow = "hidden";
    /* preventDefault() 
       : 해당 이벤트의 기본 동작을 막는 함수
         submit의 기본 동작은 1.유효성 검사 2.유효성 에러 메시지 3. 제출(페이지 새로고침)인데,
         form 태그에 명시된 novalidate로 인해 1,2이 생략되어 바로 form 제출을 하게 됨
         하지만 JS에서 유효성 검사를 하려면 바로 제출되는 것을 방지해야 하므로 preventDefault()를 호출함 */
    event.preventDefault();

    if (!InputUserName.validity.valid) {
        showPopUp("이름은 필수 항목입니다.");
    } else if (!InputPhoneNumber.validity.valid) {
        // 연락처를 입력하지 않은 경우
        if (InputPhoneNumber.validity.valueMissing) {
            showPopUp("연락처는 필수 항목입니다.");
        }
        // 입력 형식이 맞지 않은 경우
        else if (InputPhoneNumber.validity.patternMismatch) {
            showPopUp("연락처는 '-' 없이 숫자 11자리만 입력해야 합니다.\n(예: 01012345678)");
        }
    } else if (!InputContent.validity.valid) {
        showPopUp("문의 내용은 필수 항목입니다.");
    } else if (!InputPrivacyCheck.validity.valid) {
        showPopUp("본 동의는 서비스 이용을 위해 필수입니다.");
    } else {
        showPopUp("문의가 접수되었습니다.\n담당자가 확인 후 순차적으로 답변드릴 예정입니다.");
    }
});

function showPopUp(str) {
    ErrorMessageElement.textContent = str;
    PopUpOverlay.style.display = "block";
    InputInvalidPopup.style.display = "block";
}

// 확인 버튼 클릭 시 팝업창 퇴장
const InvalidPopupCloseBtn = document.querySelector(".invalid-popup-close-btn");

InvalidPopupCloseBtn.addEventListener("click", () => {
    InputInvalidPopup.style.display = "none";
    PopUpOverlay.style.display = "none";
    Body.style.overflow = "auto";
});


// - 캔버스를 활용하여 섹션 배경에 반짝임 기능 구현
const canvasNodeList = document.querySelectorAll(".canvas");
canvasNodeList.forEach((canvas) => {

    /* canvas 객체의 getContext()
       : 매개변수에 전달된 문자열에 따라 그에 맞는 렌더링 컨텍스트(그림 도구 모음) 객체를 반환하는 함수
       
       즉, 2D 도형을 그릴 수 있는 도구들을 ctx에 할당 */
    const ctx = canvas.getContext("2d");
    const canvasParent = canvas.parentElement;

    /* clientWidth와 clientHeight는 스크롤 바 및 border를 포함하지 않는 크기
    
        width와 height는 캔버스의 내부 해상도를 설정하는 JS 속성이며, style.width와 style.height는 캔버스의 크기를 설정하는 CSS 속성임
        이 둘이 다를 경우, 그림이 흐릿하거나 왜곡될 수 있어 전부 다 지정하는 것을 권장하며, JS 속성을 먼저 그 뒤에 CSS 속성을 지정해야 함
        style 속성 값은 단위를 포함한 문자열이어야 하는데 clientWidth나 clientHeight의 속성 값은 숫자이므로 "px"를 덧붙임 */
    canvas.width = canvasParent.clientWidth;
    canvas.height = canvasParent.clientHeight;
    canvas.style.width = canvasParent.clientWidth + "px";
    canvas.style.height = canvasParent.clientHeight + "px";

    // 원 객체를 생성하는 클래스
    class Circle {

        // JS에서는 클래스 필드를 미리 선언하지 않아도, 생성자 및 메서드 내에서 this 키워드를 통해 명시하면 필드가 동적으로 추가됨
        constructor(xRatio, yRatio) {
            // 원의 중심 좌표 (캔버스 내부 좌표를 기준으로 함)

            this.xRatio = xRatio;
            this.yRatio = yRatio;
            this.radius = 2;
            this.color = "#FC8A46";
            // Math.random() : 0 이상 1 미만의 부동 소수점 난수를 랜덤으로 반환하는 함수
            this.alpha = Math.random(); // 원의 초기 투명도 설정
            this.alphaDirection = Math.random() < 0.5 ? 1 : -1; // 투명도의 변화 방향을 설정 : 1이면 투명도 증가, -1이면 투명도 감소
            this.speed = Math.random() * 0.01 + 0.005;  // 투명도의 변화량을 설정 : 0.0001은 변화가 거의 없고, 0.01은 변화가 너무 크기 때문에 중간 범위로 설정


        }

        get x() {
            return this.xRatio * canvas.width;
        }

        get y() {
            return this.yRatio * canvas.height;
        }



        // 원의 투명도를 재계산하는 함수
        update() {
            // 투명도의 누적 = 투명도의 변화 방향 * 변화량
            this.alpha += this.alphaDirection * this.speed;

            // 투명도의 범위는 0 ~ 1 이므로, 이에 맞춰 투명도 및 변화 방향을 재설정
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.alphaDirection = -1;
            } else if (this.alpha <= 0) {
                this.alpha = 0;
                this.alphaDirection = 1;
            }
        }

        // 원을 그리는 함수
        draw() {
            /* ctx객체.beginPath() : 이전에 ctx가 그리던 도형과 새로운 도형이 이어지는 것을 방지하기 위해, 이전에 그리던 도형 경로와 분리하여 새 도형 경로를 시작함 */
            ctx.beginPath();

            /* ctx는 globalAlpha라는 전역 투명도 필드를 갖기 때문에 이전 도형의 투명도를 지우고, 현재 원 객체의 투명도로 재할당 */
            ctx.globalAlpha = this.alpha;


            ctx.shadowBlur = 10;
            ctx.shadowColor = "#FC8A46";

            /* ctx객체.arc(x 좌표, y좌표, 반지름, 시작 각도, 끝 각도) 
               : 해당 ctx로 그릴 원 또는 호의 경로를 정의하는 함수로, 경로만 정의할 뿐 실제로 그리지는 않음 */
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);  // 2 파이 = 360도

            ctx.fillStyle = this.color;
            ctx.fill(); // 설정값들을 이용하여 도형을 실제로 그림

            /* globalAlpha는 전역 변수이므로 이후에 다른 ctx 객체로 원 객체가 아닌 다른 도형을 그릴 때, 해당 도형 투명도에 영향을 주지 않기 위해 1로 설정 */
            ctx.globalAlpha = 1;
        }
    }

    const offset = 75;  // 오차 범위
    const rows = 4;
    const cols = 4;
    const gapX = canvas.width / cols;
    const gapY = canvas.height / rows;


    let circleArr = []; // 원 객체 배열

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // let x = (j * gapX) + (gapX / 2) + ((Math.random() - 0.5) * offset);
            // let y = (i * gapY) + (gapY / 2) + ((Math.random() - 0.5) * offset);
            // let xRatio = x / canvas.width;
            // let yRatio = y / canvas.height;

            let x = (j + Math.random()) * gapX;
            let y = (i + Math.random()) * gapY;
            let xRatio = x / canvas.width;
            let yRatio = y / canvas.height;
            circleArr.push(new Circle(xRatio, yRatio));

        }
    }

    function canvasCircleAnimate() {

        /* ctx 객체.clearRect(시작 x좌표, 시작 y좌표, 가로 길이, 세로 길이) 
        : 캔버스의 특정 영역을 지우는 함수로, 캔버스는 한 번 그림을 그리면 그게 고정되어 도형이 계속 그 위로 쌓임. 
          하지만 이 캔버스에서는 그려진 원의 투명도가 계속 바뀌어야 하므로, 그려진 원의 정보를 가지고 계속해서 새로운 투명도의 원을 다시 그려야 함
          따라서 원의 투명도가 바뀔 때마다 캔버스 전체 영역을 계속 지우는 작업이 필요함 */
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        circleArr.forEach((circle) => {
            circle.update();
            circle.draw();
        });

        /* requestAnimationFrame() 
           : 우리도 모르게 컴퓨터는 계속해서 새로고침을 자동으로 실행함
             이 때 새로고침 하는 순간과 애니메이션이 그려지는 시점이 다르면 문제가 발생하므로, 
             이를 막기 위해 새로고침 전에 실행할 애니메이션 콜백을 등록하는 함수 
             사실 새로 고침 전에 update()만 실행해도 되지만, 캔버스는 update()와 draw()를 독립적으로 실행하기 어려워서 모두 다 새로고침 전에 실행함 */
        // 콜백을 등록할 때는 함수를 실행하는 게 아니라 함수 참조만 하는 거니까 함수 호출문을 작성하는 게 아니라 함수명 또는 함수 정의문을 명시해야 함
        requestAnimationFrame(canvasCircleAnimate);
    }

    canvasCircleAnimate();

    // 반응형 대비
    window.addEventListener("resize", () => {
        canvas.width = canvasParent.clientWidth;
        canvas.height = canvasParent.clientHeight;
        canvas.style.width = canvasParent.clientWidth + "px";
        canvas.style.height = canvasParent.clientHeight + "px";
    });
});













