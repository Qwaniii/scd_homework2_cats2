// добавляем динамические данные с сервера

const main = document.querySelector("main");

const updCards = function (data) {
    main.innerHTML = "";
    data.forEach(function (cat) {
        if (cat.id) {
            let card = `<div class="${cat.favourite ? "card like" : "card"}" id="${cat.id}" style="background-image: url(${cat.img_link || "img/cat.jpg"})">
                            <span class="nameCat">${cat.name}</span>
                        </div>`;
            main.innerHTML += card;
        }
    });
    const cards = document.getElementsByClassName("card");
    for (let i = 0, cnt = cards.length; i < cnt; i++) {
        const width = cards[i].offsetWidth;
        cards[i].style.height = width * 0.6 + "px";
        cards[i].classList.add(i) /* добавляем класс в карточку, чтобы можно было достать из БД */
    }
}


// работает с popup окном добавление котика

const addBtn = document.querySelector("#add"),
      popupForm = document.querySelector("#popup-form"),
      closePopupForm = document.querySelector(".popup-close"),
      popupWrapper = document.querySelector(".popup-wrapper");

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (cookieExist()) {
        if (!popupForm.classList.contains("active")) {
            popupForm.classList.add("active");
            popupForm.parentElement.classList.add("active");
        }
    } else {
        alert("Зарегестрируйтесь!") //после проверкина куки
        clickBtnLogin();
    }
});

closePopupForm.addEventListener("click", () => {
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
    form.reset();
    form.firstElementChild.style.backgroundImage = `url(img/cat.jpg)`;
});

//закрытие окна попап по кнопке Эксейп

document.addEventListener("keydown", (e) => {
    if(e.code == "Escape") {
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
    form.reset();
    form.firstElementChild.style.backgroundImage = `url(img/cat.jpg)`;
    }
});


//закрытие окна попап по клику вне окна попап

popupWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup-wrapper")) {
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
    form.reset();
    form.firstElementChild.style.backgroundImage = `url(img/cat.jpg)`;
    }
});

// создаем экземпляр класса, для формы и добавление котика

const api = new Api("qwaniii");

// чтобы часто не обращатьсья к серверу, создаем sessionStorage

let catsData = sessionStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];

const getCats = function (api, store) {
    if (!store.length) {
        api.getCats()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message === "ok") {
                    sessionStorage.setItem("cats", JSON.stringify(data.data));
                    catsData = [...data.data];
                    updCards(data.data);                    
                }
            })
    } else {
        updCards(store);
    }
}

getCats(api, catsData);


let form = document.forms[0];

form.img_link.addEventListener("change", (e) => {
    if (e.target.value.length < 5) {
        form.firstElementChild.style.backgroundImage = `url(img/cat.jpg)`
    } else {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value || "img/cat.jpg"})`
    }
});

form.img_link.addEventListener("input", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let body = {};
    for (let i = 0; i < form.elements.length; i++) {
        let inp = form.elements[i];
        if (inp.name === "img_link" && inp.value.length < 5) {
            inp.value = `https://ruamo.ru/photos/user/28939/58b2acabd32ca54380f4424278ea1bdc.jpg` 
        }
        if (inp.type === "checkbox") {
            body[inp.name] = inp.checked;
        } else if (inp.name && inp.value) {
            if (inp.type === "number") {
                body[inp.name] = +inp.value
            } else {
                body[inp.name] = inp.value
            }
        }
    }
    console.log(body);
    api.addCat(body)
        .then(res => res.json())
        .then(data => {
            if (data.message === "ok") {
                form.reset();
                closePopupForm.click();
                api.getCat(body.id)
                    .then(res => res.json())
                    .then(cat => {
                        if (cat.message === "ok") {
                            catsData.push(cat.data);
                            sessionStorage.setItem("cats", JSON.stringify(catsData));
                            getCats(api, catsData);
                            form.firstElementChild.style.backgroundImage = `url(img/cat.jpg)`;
                        } else {
                            console.log(cat);
                        }
                    })
            } else {
                alert("Упс... что-то пошло не так...")
                console.log(data);
                api.getIds().then(r => r.json()).then(d => console.log(d));
            }
        })
});
