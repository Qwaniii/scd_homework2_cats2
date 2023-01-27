// работа с popup окном Enter Login

let addBtnEnter = document.querySelector("#login");
let popupFormLogin = document.querySelector("#login-form");
let closePopupFormLogin = document.querySelector(".login-close");
let loginWrapper = document.querySelector(".login-wrapper")
let outBtn = document.querySelector(".out");

// Функция проверки существования Куки

let cookieExist = function() {
    return document.cookie.split(';').filter(function(item) {
        return item.trim().indexOf(`Login=`) == 0
    }).length
}

// Забираем значение из Куки Login 

let cookieLoginValue = document.cookie.replace(/(?:(?:^|.*;\s*)Login\s*\=\s*([^;]*).*$)|^.*$/, "$1");

// Функция открытия модального окна регистрации

let clickBtnLogin = function(e) {
        // e.preventDefault();
        if (!popupFormLogin.classList.contains("active")) {
            popupFormLogin.classList.add("active");
            popupFormLogin.parentElement.classList.add("active");
        }
};

// Изменение "приветствия" в зависимости от Кук

let loginValue = function(name) {
    if (cookieExist()) {
        addBtnEnter.innerHTML = `Привет ${name}`;
        addBtnEnter.classList.add("done");
        addBtnEnter.classList.remove("enter");
        outBtn.classList.add("visible")
    } else {
        addBtnEnter.innerHTML = "Войти"
        addBtnEnter.addEventListener("click", clickBtnLogin);
    }
};

loginValue(cookieLoginValue);

//закрытие формы входа, по кнопке, клавише эскейп и пустому месту.


closePopupFormLogin.addEventListener("click", () => {
    popupFormLogin.classList.remove("active");
    popupFormLogin.parentElement.classList.remove("active");
});

document.addEventListener("keydown", (e) => {
    if(e.code == "Escape") {
        popupFormLogin.classList.remove("active");
        popupFormLogin.parentElement.classList.remove("active");
    }
});

loginWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("login-wrapper")) {
        popupFormLogin.classList.remove("active");
        popupFormLogin.parentElement.classList.remove("active");
    }
});


// Форма авторизации

let formLogin = document.forms[1];

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let inpLogin = document.querySelector(".inpLogin").value;
    let inpPass = document.querySelector(".inpPass").value;
    document.cookie = `Login=${inpLogin};`;
    document.cookie = `Password=${inpPass};`;
    formLogin.reset();
    closePopupFormLogin.click();
    loginValue(inpLogin);
    addBtnEnter.removeEventListener("click", clickBtnLogin);
})

//кнопка выхода с удалением кук

outBtn.addEventListener("click", deleteCookie)

function deleteCookie() {
    document.cookie = `Login=;max-age=-1`;
    document.cookie = `Password=;max-age=-1`;
    location.reload();
}