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

for (let i = 0; i < catsData.length; i++) {
        cards[i].addEventListener("click", (e) => {
            e.preventDefault();
            if (!popupInfoForm.classList.contains("active")) {
                popupInfoForm.classList.add("active");
                popupInfoForm.parentElement.classList.add("active");
            }            
            infoImg.style.backgroundImage = `url(${catsData[i].img_link})`;
            infoId.innerHTML = `ID - ${catsData[i].id}`
            infoAge.innerHTML = `AGE - ${catsData[i].age} years`
            infoName.innerHTML = `NAME - ${catsData[i].name}`
            infoRate.innerHTML = "*".repeat(`${catsData[i].rate}`);
            infoDescr.innerHTML = `ABOUT - ${catsData[i].description}`
            if (catsData[i].favourite) {
                infoFav.innerHTML = "Любимый кот";
            } else {
                infoFav.innerHTML = "Обычный кот"
            }
        })
    };


closeInfoForm.addEventListener("click", () => {
    popupInfoForm.classList.remove("active");
    popupInfoForm.parentElement.classList.remove("active");
});

let t = async () => {
    let res = await api.getCats();
    let data = await res.json();
    console.log(data.data)
}

