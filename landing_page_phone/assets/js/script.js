//  ──────────────── canvas ────────────────
const circleCanvases = document.querySelectorAll(".circle-canvas");
const meteorCanvases = document.querySelectorAll(".meteor-canvas");
let angle = [6, 6];

// 브라우저 창의 해상도가 변경될 시 canvas의 내부 해상도와 스타일 크기를 재설정
resize();
window.addEventListener("resize", resize);

function resize() {
    circleCanvases.forEach((circleCanvas) => {
        let parentWidth = circleCanvas.closest("section").offsetWidth;
        let parentHeight = circleCanvas.closest("section").offsetHeight;

        // canvas의 내부 해상도를 설정
        circleCanvas.width = parentWidth;
        circleCanvas.height = parentHeight;

        // canvas의 스타일 크기를 설정
        circleCanvas.style.width = `${parentWidth}px`;
        circleCanvas.style.height = `${parentHeight}px`;
    });

    meteorCanvases.forEach((meteorCanvas) => {
        let parentWidth = meteorCanvas.closest("section").offsetWidth;
        let parentHeight = meteorCanvas.closest("section").offsetHeight;

        meteorCanvas.width = parentWidth;
        meteorCanvas.height = parentHeight;

        meteorCanvas.style.width = `${parentWidth}px`;
        meteorCanvas.style.height = `${parentHeight}px`;
    });

    // if (window.innerWidth >= 1024) {
    //     angle[0] = 3;
    //     angle[1] = 6;
    // } else if (window.innerWidth >= 768) {
    //     angle[0] = 4;
    //     angle[1] = 6;
    // } else if (window.innerWidth < 768) {
    //     angle[0] = 9;
    //     angle[1] = 9;
    // }
}

class Circle {
    constructor(xRatio, yRatio) {
        this.xRatio = xRatio;
        this.yRatio = yRatio;
        this.radius = (Math.random() * 2) + 2;
        this.alpha = Math.random();
        this.alphaDirection = this.alpha > 0.5 ? -1 : 1;
        this.speed = Math.random() * 0.005 + 0.005;
        this.color = "#FC8A46";

    }

    update() {
        this.alpha += this.alphaDirection * this.speed;

        // 1.3이라고 가정했을 때 투명도가 다음에서 1.2가 되었어 그런데 또 조건문에 걸려서 방향이 +가 되어 투명도가 계속 범위를 벗어날 수 있으니 alpha값을 아예 지정하여 범위를 설정

        if (this.alpha >= 1.0) {
            this.alphaDirection = -1;
            this.alpha = 1.0;

        }
        else if (this.alpha <= 0.0) {
            this.alphaDirection = 1;
            this.alpha = 0.0;
        }

    }

    draw(ctxArg, canvas) {
        ctxArg.beginPath();
        ctxArg.globalAlpha = this.alpha;
        ctxArg.shadowBlur = 10;
        ctxArg.shadowColor = this.color;
        ctxArg.arc(this.xRatio * canvas.width, this.yRatio * canvas.height, this.radius, 0, Math.PI * 2);
        // 리사이즈 후 캔버스 내부 상태가 초기화되면서 fillStyle 설정이 사라져서 리사이즈시 그려지는 원이 투명하거나 이상한 색상으로 보일 수 있음
        // 따라서 개별 도형에서 fillStyle을 지정할 것
        ctxArg.fillStyle = this.color;
        ctxArg.fill();
        ctxArg.globalAlpha = 1;
        ctxArg.shadowBlur = 0;
    }
}


circleCanvases.forEach((circleCanvas) => {
    const ctx = circleCanvas.getContext("2d");

    const rows = 4;
    const cols = 6;
    const gapX = circleCanvas.width / cols;
    const gapY = circleCanvas.height / rows;

    let circleArr = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let xRatio = (j + Math.random()) / cols;
            let yRatio = (i + Math.random()) / rows;

            circleArr.push(new Circle(xRatio, yRatio));
        }
    }

    animation(ctx, circleArr, circleCanvas);
});

function animation(ctxA, circleArrA, canvasA) {
    ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
    circleArrA.forEach((circle) => {
        circle.draw(ctxA, canvasA);
        circle.update();
    })
    requestAnimationFrame(() => { animation(ctxA, circleArrA, canvasA) });
}

class Meteor {
    constructor(xRatio, yRatio, ang) {
        this.xRatio = xRatio;
        this.yRatio = yRatio;

        // //캔버스의 y축 좌표계는 수학 좌표계와 반대 (값이 클수록 아래로 향함)
        // 별똥별 길이와 방향을 직접 제어하여 끝 점을 계산
        const angle = Math.PI / ang; // ang각도로 떨어짐
        const speed = 0.008;        // 비율 기준 속도
        this.vxRatio = -Math.cos(angle) * speed;
        this.vyRatio = Math.sin(angle) * speed;
        this.alpha = 1.0;
        this.color = "#FC8A46";
        // 별의 생명주기
        this.life = (Math.random() * 100) + 10;
        this.isDead = false;
    }

    update() {
        this.xRatio += this.vxRatio;
        this.yRatio += this.vyRatio;
        this.alpha -= 0.01;
        this.life += 1;

        if (this.life >= 150) {
            this.isDead = true;
        }
    }

    draw(ctx, canvas) {
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.moveTo(this.xRatio * canvas.width, this.yRatio * canvas.height);
        ctx.lineTo((this.xRatio + this.vxRatio) * canvas.width, (this.yRatio + this.vyRatio) * canvas.height);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}



// forEach 함수는 두 번째 매개변수로 현재 요소의 인덱스를 자동으로 넘겨줌
meteorCanvases.forEach((meteorCanvas, idx) => {
    const ctx = meteorCanvas.getContext("2d");
    const cols = 4;

    let meteorArr = [];
    let ang;
    for (let i = 0; i < cols; i++) {
        let x = (i + Math.random()) / cols;
        // 별똥별의 시작점이 화면 상단부터 시작하도록
        let y = Math.random() * 0.5;
        if (idx === 0) {
            ang = angle[0];
        } else {
            ang = angle[1];
        }
        meteorArr.push(new Meteor(x, y, ang));
    }

    meteorAnimation(meteorArr, ctx, meteorCanvas, ang);
});

function meteorAnimation(meteorArr, ctx, canvas, ang) {
    // 새로 그린 별은 뚜렷하게 보여야하므로 먼저 덮고 별을 그 위에 그려야함
    ctx.fillStyle = "rgba(18,18,18,0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    meteorArr.forEach((meteor) => {
        meteor.draw(ctx, canvas);
        meteor.update();

        if (meteor.isDead === true) {
            // 죽은 별을 삭제
            meteorArr.splice(meteorArr.indexOf(meteor), 1);

            // 새로운 별똥별 추가
            let x = Math.random();
            let y = Math.random() * 0.5;
            meteorArr.push(new Meteor(x, y, ang));
        }
    });

    requestAnimationFrame(() => { meteorAnimation(meteorArr, ctx, canvas, ang) });

}

//  ──────────────── recommend-sec ──────────────── 
const tabBtns = document.querySelectorAll(".tab-btn button");
const tabContents = document.querySelectorAll(".tab-content");
const colorLabels = document.querySelectorAll(".color label");
const storageLabels = document.querySelectorAll(".storage label");

let recommendSwiperObj = recommendSwiper(tabContents[0]);

// 선택된 요소들의 부모 요소에 ".selected"를 제거하는 함수
function clearParentSelected(selector) {
    selector.forEach(
        (s) => { s.parentElement.classList.remove("selected"); }
    );
}

// 선택된 요소들에 ".selected"를 제거하는 함수
function clearCurrentSelected(selector) {
    selector.forEach(
        (s) => { s.classList.remove("selected"); }
    );
}

// 선택된 요소에 ".selected"를 추가하는 함수
function addSelected(selector) {
    selector.classList.add("selected");
}

// recommend-sec에서 사용할 Swiper 인스턴스를 생성하는 함수
function recommendSwiper(args) {
    let swiper = new Swiper(args.querySelector(".recommendSwiper"), {

        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: args.querySelector(".swiper-button-next"),
            prevEl: args.querySelector(".swiper-button-prev"),
        },
        pagination: {
            el: args.querySelector(".swiper-pagination"),
            clickable: true,
        },

        breakpoints: {
            1440: {
                slidesPerView: 4,
                spaceBetween: 30
            },
            1200: {
                slidesPerView: 3.5,
                slidesPerGroup: 3,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2.5,
                slidesPerGroup: 2,
                spaceBetween: 20
            },
            640: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 1.5,
                spaceBetween: 20
            },
            360: {
                slidesPerView: 1,
                spaceBetween: 20
            }
        }
    });

    return swiper;
}

// 선택된 탭에 따라 보이는 추천 상품이 달라짐
tabBtns.forEach((tabBtn) => {
    tabBtn.addEventListener("click", function () {
        let idx = Array.from(tabBtns).indexOf(this);

        clearParentSelected(tabBtns);
        addSelected(this.parentElement);

        clearCurrentSelected(tabContents);
        addSelected(tabContents[idx]);

        if (recommendSwiperObj) {
            recommendSwiperObj.destroy(true, true);
        }

        recommendSwiperObj = recommendSwiper(tabContents[idx]);
    });
});

// 선택된 색상에 따라 보이는 휴대폰 이미지가 달라짐
colorLabels.forEach((colorLabel) => {
    colorLabel.addEventListener("click", function () {
        let currentCard = this.closest(".recommend-card");
        let colorLabelsOfCurrentCard = currentCard.querySelectorAll(".color label");
        let dataImg = this.dataset.img;
        let img = currentCard.querySelector("img");

        clearParentSelected(colorLabelsOfCurrentCard);
        addSelected(this.parentElement);

        img.setAttribute("src", `./assets/images/phone/${dataImg}.webp`);
    });
});

// 선택된 용량에 따라 보이는 휴대폰 가격이 달라짐
storageLabels.forEach((storageLabel) => {
    storageLabel.addEventListener("click", function () {
        let currentCard = this.closest(".recommend-card");
        let storageLabelsOfCurrentCard = currentCard.querySelectorAll(".storage label");
        let dataBeforeCost = this.dataset.beforeCost;
        let dataAfterCost = this.dataset.afterCost;
        let beforeCostOfCurrentCard = currentCard.querySelector(".before-cost");
        let afterCostOfCurrentCard = currentCard.querySelector(".after-cost");

        clearParentSelected(storageLabelsOfCurrentCard);
        addSelected(this.parentElement);

        beforeCostOfCurrentCard.textContent = dataBeforeCost;
        afterCostOfCurrentCard.textContent = dataAfterCost;
    });
});

// benefit-sec
// - 카드가 뷰포트에 진입할 시, 회전하며 등장
let benefitFrontCard = document.querySelector(".benefit-sec .front-card");
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
}, { threshold: 0.6 });

// benefitFrontCard를 IntersectionObserver의 관찰 대상으로 등록함
ObserverObj.observe(benefitFrontCard);



// - 화살표 버튼 클릭 시, 카드가 회전하며 등장함 - gsap 사용
const BenefitPrevBtn = document.querySelector(".benefit-prev-btn");
const BenefitNextBtn = document.querySelector(".benefit-next-btn");
let benefitIndex = document.querySelector(".benefit-index");

BenefitPrevBtn.disabled = true;

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
        let nextCard = benefitCopyArr[1];
        let otherCard = benefitCopyArr.slice(1);    // 1번 인덱스 요소부터 마지막 요소까지를 복사한 새로운 배열 생성

        const nextBtnTimeLine = gsap.timeline({
            onComplete: () => {
                if (benefitCopyArr.length !== 1) {
                    BenefitNextBtn.disabled = false;
                }
                benefitIndex.textContent = benefitCopyArr[0].dataset.num;
                BenefitPrevBtn.disabled = false;
                isAnimating = false;
            }
        });

        nextBtnTimeLine.to(
            frontCard, {
            rotation: "+= 15", opacity: 0, duration: 0.3, stagger: 0, ease: "power1.inOut", delay: 0.2,
            onStart: () => {
                nextCard.classList.add("front-card");
            },
            onComplete: () => {
                frontCard.classList.remove("front-card");
                benefitCopyArr.shift(); // 배열의 첫번째 요소를 삭제
            }
        }, 0);

        nextBtnTimeLine.to(
            otherCard, {
            rotation: "+=15", duration: 0.05, stagger: 0, ease: "power1.Out"
        }, 0
        );

    }
});

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

        const prevBtnTimeLine = gsap.timeline({
            onComplete: () => {
                if (benefitCopyArr.length !== 6) {
                    BenefitPrevBtn.disabled = false;
                }
                benefitIndex.textContent = benefitCopyArr[0].dataset.num;
                BenefitNextBtn.disabled = false;
                isAnimating = false;
            }
        });

        prevBtnTimeLine.to(benefitCopyArr[0], {
            opacity: 1, rotation: "-=15", duration: 0.03, stagger: 0, ease: "power2.out"
        }, 0);

        prevBtnTimeLine.to(otherCard, {
            rotation: "-=15", duration: 0.05, stagger: 0, ease: "power2.inOut"
        }, 0);
    }
});

//  ──────────────── review-sec ──────────────── 
// review-sec에서 사용할 Swiper 인스턴스 생성
let reviewSwiper = new Swiper(".reviewSwiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    loop: true,
});

// 해상도 변화 시 맨 앞 슬라이드가 잘려 보이는 것을 방지
window.addEventListener("resize", () => {
    reviewSwiper.update();
    reviewSwiper.slideToLoop(0);
});

// contact-sec
// - 개인정보 수집 및 이용 동의 팝업 등장 및 퇴장  
const Body = document.querySelector("body");
const PopUpOverlay = document.querySelector(".popup-overlay");
const PrivacyCheckDesc = document.querySelector(".privacy-check-desc");
const PrivacyPopUp = document.querySelector(".privacy-popup");
const PrivacyPopUpCloseBtn = document.querySelector(".privacy-popup-close-btn");

const footerPrivacyPolicy = document.querySelector(".footer-privacy-policy");
const footerUsePolicy = document.querySelector(".footer-use-policy");
const usePopUp = document.querySelector(".use-popup");
const usePopUpCloseBtn = document.querySelector(".use-popup-close-btn");

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

// 푸터 개인정보처리방침 버튼 클릭 시 팝업창 등장
footerPrivacyPolicy.addEventListener("click", () => {
    console.log("클");
    PopUpOverlay.style.display = "block";
    PrivacyPopUp.style.display = "block";
    Body.style.overflow = "hidden";
});

// 푸터 이용약관 버튼 클릭 시 팝업창 등장
footerUsePolicy.addEventListener("click", () => {
    PopUpOverlay.style.display = "block";
    usePopUp.style.display = "block";
    Body.style.overflow = "hidden";
});

// X 버튼 클릭 시 팝업창 퇴장
usePopUpCloseBtn.addEventListener("click", () => {
    PopUpOverlay.style.display = "none";
    usePopUp.style.display = "none";
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

const SlideMenuArea = document.querySelector(".slide-menu-area");
const HamburgerBtn = document.querySelector(".hamburger-btn");

// - 햄버거 버튼 클릭 시, 슬라이드 메뉴가 등장
HamburgerBtn.addEventListener("click", () => {
    SlideMenuArea.style.zIndex = "300";

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


