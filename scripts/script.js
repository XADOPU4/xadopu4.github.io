
const tireArray = new Array(
    {
        id: 0,
        name: "Michelin Pilot Sport 4S",
        season: "summer",
        diameter: "R18",
        width: "225"
    },
    {
        id: 1,
        name: "Yokohama BluEarth",
        season: "summer",
        diameter: "R15",
        width: "205"
    },
    {
        id: 2,
        name: "Toyo Proxes R888R",
        season: "summer",
        diameter: "R18",
        width: "245"
    },
    {
        id: 3,
        name: "Goodyear UltraGrip",
        season: "winter",
        diameter: "R14",
        width: "185"
    },
    {
        id: 4,
        name: "Goodyear UltraTop",
        season: "winter",
        diameter: "R14",
        width: "205"
    },
    {
        id: 5,
        name: "Nokian Hakka Black SUV",
        season: "summer",
        diameter: "R18",
        width: "245"
    },
    {
        id: 6,
        name: "Goodyear UltraGrip Arctic 2",
        season: "winter",
        diameter: "R18",
        width: "225"
    },
    {
        id: 7,
        name: "Goodyear Eagle F1",
        season: "summer",
        diameter: "R16",
        width: "225"
    },
    {
        id: 8,
        name: "Nokian Hakkapelita 8",
        season: "winter",
        diameter: "R18",
        width: "245"
    }
);


const propertyNames = ['season', 'diameter', 'width'];

const properties = {
    'season': ['summer', 'winter'],
    'diameter': ['R14', 'R15', 'R16', 'R17', 'R18'],
    'width': ['175', '185', '195', '205', '225', '245']
};


//Этот скрипт вызовется, когда документ полностью загружен
$("document").ready(function () {

    //Находим наш див, в котором будут карточки лежать, он заранее сверстан
    var container = document.getElementById("card-container");
    //Вызываем скрипт, когда документ полностью загрузится
    addTires(tireArray, propertyNames, container);


    var cardArray = document.getElementsByClassName("card");
    var checkBoxArray = $('input[type="checkbox"]');

    $('div[class="clear-filter"]').click(function () {
        disableUselessCheckBoxes(cardArray, checkBoxArray, propertyNames);
        applyFilters(checkBoxArray, cardArray);

    });

    disableUselessCheckBoxes(cardArray, checkBoxArray, propertyNames);

    applyFilters(checkBoxArray, cardArray);

    for (let checkBox of checkBoxArray) {
        $(checkBox).change(function (event) {
            applyFilters(checkBoxArray, cardArray);

        });
    }



});



function applyFilters(checkBoxArray, cardArray) {

    let checkedCheckBoxes = new Map();

    //Добавляем все параметры в мапу, то есть сезон, ширину, диаметр
    for (const property of propertyNames) {
        checkedCheckBoxes.set(property, []);
    }

    //Добавляем по каждому параметру актуальные выбранные значения
    for (const checkBox of checkBoxArray) {
        if (checkBox.checked) {
            checkedCheckBoxes.get(checkBox.name).push(checkBox.value);
        }
    }

    // console.log("After update : ");

    // for (const [key, elem] of checkedCheckBoxes.entries()) {
    //     console.log(key, elem);
    // }

    let showThis = giveMeArray(checkedCheckBoxes, cardArray);
    console.log("Show this: ", showThis);



    showCards(showThis, cardArray);



    for (const checkBox of checkBoxArray) {
        if (true) {
            var newIds = checkthisParameter(checkBox, propertyNames, checkBoxArray, cardArray);

            console.log(newIds);

            if (newIds.length == 0) {
                console.log(checkBox.value + "   nothing to show");
                $(checkBox).prop('disabled', true);
            }
            else if (compare(showThis, newIds)) {
                console.log(checkBox.value + "   nothing changes");


                //Странное поведение, не баг, а фича


                // $(checkBox).prop('checked', false);
                $(checkBox).prop('disabled', true);
            }
            else {
                console.log(checkBox.value + "   something changes");
                $(checkBox).prop('disabled', false);

            }

        }



    }

}


function showCards(cardIdArray, cardArray) {



    for (const card of cardArray) {

        $(card).addClass('hide');

        let id = $(card).data('id');

        if (cardIdArray.includes(id)) {
            $(card).removeClass('hide');
        }

    }


}

function checkthisParameter(checkBoxToCheck, properties, checkBoxArray, cardArray) {

    let newCardArray = [];

    let checkedCheckBoxes = new Map();

    //Добавляем все параметры в мапу, то есть сезон, ширину, диаметр
    for (const property of properties) {
        checkedCheckBoxes.set(property, []);
    }

    //Добавляем по каждому параметру актуальные выбранные значения
    for (const checkBox of checkBoxArray) {
        if (checkBox.checked) {
            checkedCheckBoxes.get(checkBox.name).push(checkBox.value);
        }
    }

    console.log("Checked parameters : ");
    for (const [key, elem] of checkedCheckBoxes.entries()) {
        console.log(key, elem);
    }

    //Добавляем или удаляем, в зависимости от состояния чекбокса (был выбран или нет)
    if (checkBoxToCheck.checked) {
        let index = checkedCheckBoxes.get(checkBoxToCheck.name).indexOf(checkBoxToCheck.value);
        if (index > -1) {
            checkedCheckBoxes.get(checkBoxToCheck.name).splice(index, 1);
        }
    }
    else {
        checkedCheckBoxes.get(checkBoxToCheck.name).push(checkBoxToCheck.value);
    }


    console.log("After second update : ");
    for (const [key, elem] of checkedCheckBoxes.entries()) {
        console.log(key, elem);
    }



    return giveMeArray(checkedCheckBoxes, cardArray);
}


//Выдает массив идентификаторов тех карточек, которые подходят под набор чекбоксов
function giveMeArray(mapWithCheckedCheckBoxes, cardArray) {

    for (const card of cardArray) {
        $(card).data('match', true);

    }


    let newCardArray = [];

    let mapWithCards = new Map();

    for (const [parameter, values] of mapWithCheckedCheckBoxes) {
        for (const card of cardArray) {
            //Если наша карточка подходит под выбранные характеристики
            if (values.includes("" + $(card).data(parameter))) {

                if (mapWithCards.has(card)) {
                    mapWithCards.get(card).push($(card).data(parameter));
                }
                else {
                    mapWithCards.set(card, new Array($(card).data(parameter)));
                }

            }
            else {
                if (mapWithCards.has(card)) {
                    $(card).data('match', false);
                }
            }

        }
    }

    //Тут странно
    for (const [key, value] of mapWithCards.entries()) {
        // if ($(key).data('match') == true) {
        //     newCardArray.push($(key).data('id'));
        // }


        if (value.length == 3) {
            newCardArray.push($(key).data('id'));
        }
    }

    newCardArray.sort(function (a, b) { return a - b });

    return newCardArray;
}

function compare(a1, a2) {
    return a1.length == a2.length && a1.every((v, i) => v === a2[i])
}

function disableUselessCheckBoxes(cardArray, checkBoxArray, properties) {


    for (var checkBox of checkBoxArray) {
        $(checkBox).prop('checked', false);
        $(checkBox).prop('disabled', true);
    }

    for (const card of cardArray) {
        for (const property of properties) {

            let name = property;
            let value = $(card).data(property);

            $(`input[type="checkbox"][name="${name}"][value="${value}"]`).prop('disabled', false);
            $(`input[type="checkbox"][name="${name}"][value="${value}"]`).prop('checked', true);

        }
    }
}

function uncheckWrongCheckBoxes(cardIdArray, cardArray, checkBoxArray, properties) {

    for (const card of cardArray) {

        let id = $(card).data('id');

        if (!cardIdArray.includes(id)) {

            for (const property of properties) {

                let name = property;
                let value = $(card).data(property);

                
                console.log("disable this: ", name, value);
                var checkBox = $(`input[type="checkbox"][name="${name}"][value="${value}"]`);

                
                $(checkBox).prop('checked', false);
            }

        }
        


    }
}




//контейнер - тот див, куда вставляются карточки
function addTires(array, properties, container) {

    //Массив с данными
    for (const key in array) {
        var tire = array[key];
        //создание элемента 
        var newCard = document.createElement("div");


        //Добавление класса со стилями, который описывает внешний вид карточки
        newCard.className = "card";

        //здесь создаются и устанавливаются data-аттрибуты, заполняются данными из массива с карточками
        newCard.dataset.id = tire.id;
        newCard.dataset.name = tire.name;

        for (const property of properties) {
            $(newCard).attr('data-' + property, tire[property]);
        }
        newCard.dataset.match = true;


        //html, который будет соответствовать этой карточке
        //Обрати внимание на кавычки у строки, они находятся на букве Ё 
        let a =
            `<h1 class="tire-name">${tire.id}</h1>
        <p class="tire-season">${tire.season}</p>
        <p class="tire-diameter">${tire.diameter}</p>
        <p class="tire-width">${tire.width}</p>`;

        //Это обязательно, иначе он не понимает такую строку
        //Мы вставляем заготовленный html в карточку
        newCard.innerHTML = "" + a;

        //говорим контейнеру добавить карточку в конец
        container.append(newCard);
    }
}









