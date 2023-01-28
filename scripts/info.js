let cards = document.querySelectorAll(".card"),
    popupInfoForm = document.querySelector("#info-form"),
    closeInfoForm = document.querySelector(".info-close"),
    infoImg = document.querySelector(".info-img"),
    infoId = document.querySelector(".info-id"),
    infoAge = document.querySelector(".info-age"),
    infoName = document.querySelector(".info-name"),
    infoRate = document.querySelector(".info-rate"),
    infoDescr = document.querySelector(".info-description"),
    infoFav = document.querySelector(".favourite"),
    span = document.querySelectorAll("span"),
    delCatBtn = document.querySelector(".info-delete"),
    editCatBtn = document.querySelector(".info-edit"),
    classForEdit = document.querySelectorAll(".forEdit"),
    saveCatBtn = document.querySelector(".info-save"),
    infoWrapper = document.querySelector(".info-wrapper");


/*------ Добавляем слушателя события на тег main---------*/

main.addEventListener("click", (e) => {

    /*--------применяем событие открытия InfoForm \
    только по клику на картинку с классом .card --------*/

    if (e.target.classList.contains("card")) {
        if (!popupInfoForm.classList.contains("active") && cookieExist()) {  
            popupInfoForm.classList.add("active");
            popupInfoForm.parentElement.classList.add("active");

            /*---------собираем ID и порядковый комер карточки (для сопоставления с БД catsData)
    для заполнения InfoForm и удаления кота---------*/

    let target = e.target;
    let ind = (target.classList[(target.classList).length - 1])
    let catId = target.id

    /* заполняем карточки */
    infoImg.style.backgroundImage = `url(${catsData[ind].img_link || "img/cat.jpg"})`;
    infoId.innerHTML = `Идентификационный номер ${catsData[ind].id}`;
    if (!catsData[ind].age) {
        infoAge.innerHTML = "Кот без возраста<span></span>"
    } else if (catsData[ind].age < 5 && catsData[ind].age > 1) {
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
        let rate = "&#9733"
        let withOutRate = "&#9734"
        infoRate.innerHTML = `Рейтинг котика <span id="rate">${rate.repeat(catsData[ind].rate)}${withOutRate.repeat(10 - catsData[ind].rate)}</span>`;
    }
    if (!catsData[ind].description) {
        infoDescr.innerHTML = `Нет информации о котике...<span>&nbsp;</span>`
    } else {
        infoDescr.innerHTML = `Немного информации: <span>${(catsData[ind].description).toLowerCase()}</span>`}
    if (catsData[ind].favourite) {
        infoFav.innerHTML = `${(catsData[ind].name).toUpperCase()} наш любимый кот <i class="fa-solid fa-heart"></i>`;
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

            /*---------- Кнопка редактирования -----------*/

    editCatBtn.addEventListener("click", makeEdit)

    function makeEdit(e) {
        e.preventDefault();
        classForEdit.forEach(forEdit => {
            let spanEdit = forEdit.firstElementChild
            if (!spanEdit.classList.contains("edit")) {
                spanEdit.classList.add("edit")
                spanEdit.setAttribute("contentEditable", true) //делаем нужные поля - редактируемыми
            }
        })
        editCatBtn.style.display = "none" 
        saveCatBtn.style.display = "flex" // при нажатии на кнопка редактирования, появляется кнопка сохранения

    }

    /*------------ кнопка сохранения -------------*/

    saveCatBtn.addEventListener("click", makeSave);

    function makeSave(e) {
        e.preventDefault();
        let bodyEdit = {};
        let arr = ["name", "age", "description"];

        /* -------- собираем новые данные, после редактирования, в объект --------*/

        for (let i = 0; i < classForEdit.length; i++) {
            let spanEdit = classForEdit[i].firstElementChild
            if (isFinite(spanEdit.innerHTML)) {
            bodyEdit[arr[i]] = +spanEdit.innerHTML
            } else {
                bodyEdit[arr[i]] = spanEdit.innerHTML
            }
            
        }
        console.log(bodyEdit)
        /* ---- запускаем функцию обновления на сервер и на страницу -------*/

        api.updCat(catId, bodyEdit)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message === "ok") {
                    closeInfoForm.click();
                    alert("Изменения сохраненны")
                    api.getCats()
                    .then(res => res.json())
                    .then(cat => {
                        if (cat.message === "ok") {
                            sessionStorage.setItem("cats", JSON.stringify(cat.data));
                            catsData = [...cat.data];
                            updCards(cat.data);
                            console.log("Изменения сохранены на сервере и в sessionStorage...")
                            console.log(cat.data);
                        } else {
                            console.log(cat);
                        }
                    })
                } else {
                    console.log(data);
                    api.getIds().then(r => r.json()).then(d => console.log(d));
                }
        })
    }


        } else {
            alert("Зарегестрируйтесь!")
            clickBtnLogin();
        }


} 
    /*--------------------------- вешаем событие закрытия на кнопку закрытия,  escape, и пустое место
    и удаляем событие с кнопки "удалить" и "редактировать"------------------*/

    closeInfoForm.addEventListener("click", () => {
        popupInfoForm.classList.remove("active");
        popupInfoForm.parentElement.classList.remove("active");
        delCatBtn.removeEventListener("click", delThisCat);
        saveCatBtn.style.display = "none";
        editCatBtn.style.display = "flex";
        editCatBtn.removeEventListener("click", makeEdit)
        saveCatBtn.removeEventListener("click", makeSave)
    });

    document.addEventListener("keydown", (e) => {
        if(e.code == "Escape") {
            popupInfoForm.classList.remove("active");
            popupInfoForm.parentElement.classList.remove("active");
            delCatBtn.removeEventListener("click", delThisCat);
            saveCatBtn.style.display = "none";
            editCatBtn.style.display = "flex";
            editCatBtn.removeEventListener("click", makeEdit)
            saveCatBtn.removeEventListener("click", makeSave)
        }
    });

    infoWrapper.addEventListener("click", (e) => {
        if (e.target.classList.contains("info-wrapper")) {
            popupInfoForm.classList.remove("active");
            popupInfoForm.parentElement.classList.remove("active");
            delCatBtn.removeEventListener("click", delThisCat);
            saveCatBtn.style.display = "none";
            editCatBtn.style.display = "flex";
            editCatBtn.removeEventListener("click", makeEdit)
            saveCatBtn.removeEventListener("click", makeSave)
        }
    });
    
});
