let cards = document.querySelectorAll(".card")
let popupInfoForm = document.querySelector("#info-form");
let closeInfoForm = document.querySelector(".info-close");
let infoImg = document.querySelector(".info-img");
let infoId = document.querySelector(".info-id");
let infoAge = document.querySelector(".info-age");
let infoName = document.querySelector(".info-name");
let infoRate = document.querySelector(".info-rate");
let infoDescr = document.querySelector(".info-description");
let infoFav = document.querySelector(".favourite");
let span = document.querySelectorAll("span")
let delCatBtn = document.querySelector(".info-delete");
let editCatBtn = document.querySelector(".info-edit");
let classForEdit = document.querySelectorAll(".forEdit")
let saveCatBtn = document.querySelector(".info-save")


/*------ Добавляем слушателя события на тег main---------*/

main.addEventListener("click", (e) => {

    /*--------применяем событие открытия InfoForm \
    только по клику на картинку с классом .card --------*/

    if (e.target.classList.contains("card")) {
        if (!popupInfoForm.classList.contains("active")) {
        popupInfoForm.classList.add("active");
        popupInfoForm.parentElement.classList.add("active");
        }

    /*---------собираем ID и порядковый комер карточки (для сопоставления с БД catsData)
    для заполнения InfoForm и удаления кота---------*/

    let ind = (e.target.classList[(e.target.classList).length - 1])
    let catId = e.target.id

    /* заполняем карточки */
    infoImg.style.backgroundImage = `url(${catsData[ind].img_link || "img/cat.jpg"})`;
    infoId.innerHTML = `Порядковый номер (id) ${catsData[ind].id}`;
    if (!catsData[ind].age) {
        infoAge.innerHTML = "<span>Кот без возраста</span>"
    } else if (catsData[ind].age < 5) {
            infoAge.innerHTML = `Возраст <span>${catsData[ind].age}</span> года`
            } else if (catsData[ind].age >= 5) {
            infoAge.innerHTML = `Возраст <span>${catsData[ind].age}</span> лет`
                } else {
                    infoAge.innerHTML = `Возраст <span>${catsData[ind].age}</span> год`
                }
    infoName.innerHTML = `Котика зовут <span>${catsData[ind].name}</span>`
    if (!catsData[ind].rate) {
        infoRate.innerHTML = "<span>Кот без рейтинга</span>"
    } else {
        infoRate.innerHTML = "Рейтинг котика " + "*".repeat(`${catsData[ind].rate}`)};
    if (!catsData[ind].description) {
        infoDescr.innerHTML = "<span>Нет информации о котике...</span>"
    } else {
        infoDescr.innerHTML = `Немного информации о котике: <span>${catsData[ind].description}</span>`}
    if (catsData[ind].favourite) {
        infoFav.innerHTML = `${(catsData[ind].name).toUpperCase()} наш любимый кот`;
    } else {
        infoFav.innerHTML = `${(catsData[ind].name).toUpperCase()} обычный кот`
    };

    
    /*--------------- На открытой карточке, 
    добавляем событие на кнопку "удалить"-------------*/

    delCatBtn.addEventListener("click", delThisCat)
    function delThisCat(e) {
        e.preventDefault()
        api.delCat(catId) /* Id из cards id*/
            .then(res => res.json())
            .then(data => {
                if (data.message === "ok") {
                    closeInfoForm.click();
                    api.getCats()   /*обновляем котов после удаления */
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                if (data.message === "ok") {
                                sessionStorage.setItem("cats", JSON.stringify(data.data));
                                catsData = [...data.data];
                                updCards(data.data);                        
                                };
                            });
                        };
                    });
            };


    editCatBtn.addEventListener("click", makeEdit)

    function makeEdit(e) {
        e.preventDefault();
        classForEdit.forEach(forEdit => {
            let spanEdit = forEdit.firstElementChild
            if (!spanEdit.classList.contains("edit")) {
                spanEdit.classList.add("edit")
                spanEdit.setAttribute("contentEditable", true)
                console.log(spanEdit)
            }
        })
    }
    };


    /*--------------------------- вешаем событие на кнопку закрытия 
    и удаляем событие с кнопки "удалить"------------------*/

    closeInfoForm.addEventListener("click", () => {
        popupInfoForm.classList.remove("active");
        popupInfoForm.parentElement.classList.remove("active");
        delCatBtn.removeEventListener("click", delThisCat);
    });
});







