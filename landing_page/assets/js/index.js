let colorCircleArr = document.querySelectorAll(".color-circle");

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

    });
});