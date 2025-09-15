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
