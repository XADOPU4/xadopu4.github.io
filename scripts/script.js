

const bookArray = new Array(
    {
        id: 0,
        name: "Карта Анны",
        binding: "solid",
        publisher: "Kid",
        limit: "0+"
    },
    {
        id: 1,
        name: "Библия",
        binding: "solid",
        publisher: "EKSMO",
        limit: "18+"
    },
    {
        id: 2,
        name: "Декабристы. 86 портретов",
        binding: "soft",
        publisher: "EKSMO",
        limit: "0+"
    },
    {
        id: 3,
        name: "Елизавета Федоровна",
        binding: "soft",
        publisher: "EKSMO",
        limit: "3+"
    },
    {
        id: 4,
        name: "Моя мама сошла с ума",
        binding: "solid",
        publisher: "EKSMO",
        limit: "16+"
    },
    {
        id: 5,
        name: "Твоими глазами",
        binding: "solid",
        publisher: "EKSMO",
        limit: "16+"
    },
    {
        id: 6,
        name: "Твоими глазами1",
        binding: "soft",
        publisher: "EKSMO",
        limit: "18+"
    },
    {
        id: 7,
        name: "Гарри Поттер",
        binding: "soft",
        publisher: "Woodpecker",
        limit: "18+"
    },
    // {
    //     id: 8,
    //     name: "Гарри Поттер",
    //     binding: "soft",
    //     publisher: "ROSMAN",
    //     limit: "18+"
    // }
);


const properties = {
    'publisher': ['EKSMO', 'Woodpecker', 'ROSMAN', 'Kid'],
    'binding': ['soft', 'solid'],
    'limit': ['18+', '16+', '3+', '0+']
};


//Этот скрипт вызовется, когда документ полностью загружен
$("document").ready(function () {

    //Находим наш див, в котором будут карточки лежать, он заранее сверстан
    var container = document.getElementById("card-container");
    var filter = $('.filter');
    //Вызываем скрипт, когда документ полностью загрузится
    addBooks(bookArray, Object.keys(properties), container);
    addCheckboxes(properties, filter);


    var cardArray = document.getElementsByClassName("card");
    var checkBoxArray = $('input[type="checkbox"]');

    for (var checkBox of checkBoxArray) {
        $(checkBox).prop('checked', false);
        $(checkBox).prop('disabled', false);
    }

    $('div[class="clear-filter"]').click(function () {
        disableUselessCheckBoxes(cardArray, checkBoxArray, Object.keys(properties));

        for (var checkBox of checkBoxArray) {
            $(checkBox).prop('checked', false);
            $(checkBox).prop('disabled', false);
        }

        applyFilters(checkBoxArray, cardArray);

    });

    disableUselessCheckBoxes(cardArray, checkBoxArray, Object.keys(properties));

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
    // for (const property of Object.keys(properies)) {
    //     checkedCheckBoxes.set(property, []);
    // }

    //Добавляем по каждому параметру актуальные выбранные значения
    for (const checkBox of checkBoxArray) {
        if (checkBox.checked) {
            if (!checkedCheckBoxes.has(checkBox.name)) {
                checkedCheckBoxes.set(checkBox.name, [checkBox.value]);
            }
            else {
                checkedCheckBoxes.get(checkBox.name).push(checkBox.value);
            }
        }
    }

    console.log("Different parameters: ", checkedCheckBoxes.size);

    // console.log("After update : ");

    // for (const [key, elem] of checkedCheckBoxes.entries()) {
    //     console.log(key, elem);
    // }

    let showThis = [];

    if (checkedCheckBoxes.size > 0) {
        showThis = giveMeArray(checkedCheckBoxes, cardArray);
        console.log("Show this: ", showThis);

        for (const checkBox of checkBoxArray) {
            //возможность проверки отдельного чекбокса в условии if(checkBox.value=='ваше значение')
            if (true) {
                var newIds = checkthisParameter(checkBox, Object.keys(properties), checkBoxArray, cardArray);
                console.log(`Cards to show with {${checkBox.name}, ${checkBox.value}} : `, newIds);

                if (newIds.length == 0) {
                    console.log("Nothing to show");
                    $(checkBox).prop('disabled', true);
                }
                else if (compare(showThis, newIds)) {
                    console.log("Nothing changes");
                    $(checkBox).prop('disabled', true);
                }
                else {
                    console.log("Something changes");
                    $(checkBox).prop('disabled', false);

                }
            }
        }
    }
    else {

        disableUselessCheckBoxes(cardArray, checkBoxArray, Object.keys(properties));

        for (const card of cardArray) {
            showThis.push($(card).data('id'));
        }
    }

    showCards(showThis, cardArray);
}


// Принимаем массив идентификаторов карточек и массив карточек
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

    let infoTocheck = `{${checkBoxToCheck.name}, ${checkBoxToCheck.value}, ${checkBoxToCheck.checked}}`;

    console.log("Checking " + infoTocheck);

    for (const checkBox of checkBoxArray) {
        if (checkBox.checked) {
            if (!checkedCheckBoxes.has(checkBox.name)) {
                checkedCheckBoxes.set(checkBox.name, [checkBox.value]);
            }
            else {
                checkedCheckBoxes.get(checkBox.name).push(checkBox.value);
            }
        }
    }

    // console.log("Checked parameters : ");
    // for (const [key, elem] of checkedCheckBoxes.entries()) {
    //     console.log(key, elem);
    // }

    //Добавляем или удаляем, в зависимости от состояния чекбокса (был выбран или нет)


    if (checkBoxToCheck.checked) {

        let index = checkedCheckBoxes.get(checkBoxToCheck.name).indexOf(checkBoxToCheck.value);
        if (index > -1) {
            checkedCheckBoxes.get(checkBoxToCheck.name).splice(index, 1);
            console.log("Deleting " + infoTocheck);
        }
    }
    else {

        if (checkedCheckBoxes.has(checkBoxToCheck.name)) {
            checkedCheckBoxes.get(checkBoxToCheck.name).push(checkBoxToCheck.value);
        }
        else {
            checkedCheckBoxes.set(checkBoxToCheck.name, [checkBoxToCheck.value]);
        }

        console.log("Adding " + infoTocheck);
    }

    for (const [key, value] of checkedCheckBoxes) {
        if (checkedCheckBoxes.get(key).length == 0) {
            checkedCheckBoxes.delete(key);
        }
    }

    if (checkedCheckBoxes.size == 0) {

        let allCardIds = [];

        for (const card of cardArray) {
            allCardIds.push(card.dataset.id);
        }

        console.log("Map is empty, show this : ", allCardIds);

        return allCardIds;
    }

    return giveMeArray(checkedCheckBoxes, cardArray);
}


//Выдает массив идентификаторов тех карточек, которые подходят под набор чекбоксов
function giveMeArray(mapWithCheckedCheckBoxes, cardArray) {

    // console.log(mapWithCheckedCheckBoxes);

    let newCardArray = [];
    let mapWithCards = new Map();

    for (const [parameter, values] of mapWithCheckedCheckBoxes.entries()) {
        for (const card of cardArray) {
            //Если наша карточка подходит под выбранные характеристики
            if (values.includes("" + $(card).data(parameter))) {

                if (mapWithCards.has(card)) {
                    mapWithCards.get(card).push($(card).data(parameter));
                }
                else {
                    mapWithCards.set(card, [$(card).data(parameter)]);
                }
            }
        }
    }

    for (const [key, value] of mapWithCards.entries()) {
        if (value.length == mapWithCheckedCheckBoxes.size) {
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
        // $(checkBox).prop('checked', false);
        $(checkBox).prop('disabled', true);
    }

    for (const card of cardArray) {
        for (const property of properties) {

            let name = property;
            let value = $(card).data(property);

            $(`input[type="checkbox"][name="${name}"][value="${value}"]`).prop('disabled', false);
            // $(`input[type="checkbox"][name="${name}"][value="${value}"]`).prop('checked', true);

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
function addBooks(array, properties, container) {

    //Массив с данными
    for (const key in array) {
        var book = array[key];
        //создание элемента 
        var newCard = document.createElement("div");

        //html, который будет соответствовать этой карточке
        //Обрати внимание на кавычки у строки, они находятся на букве Ё 
        let cardHtml =
            `<h1 class="book-name">${book.name}</h1>`;

        //Добавление класса со стилями, который описывает внешний вид карточки
        newCard.className = "card";

        //здесь создаются и устанавливаются data-аттрибуты, заполняются данными из массива с карточками
        newCard.dataset.id = book.id;
        newCard.dataset.name = book.name;

        for (const property of properties) {
            $(newCard).attr('data-' + property, book[property]);
            cardHtml += `<p>${book[property]}</p>`;
        }
        
        //Мы вставляем заготовленный html в карточку
        newCard.innerHTML = cardHtml;

        //говорим контейнеру добавить карточку в конец
        container.append(newCard);
    }
}

function addCheckboxes(properties, container) {

    for (const property in properties) {
        var subsection = document.createElement('div');

        $(subsection).addClass('subsection');

        //Установка правильных стилей для 
        // if (property == Object.keys(properties)[Object.keys(properties).length - 1]) {
        //     $(subsection).addClass('bottom-subsection');
        // }
        // else if (property == Object.keys(properties)[0]) {
        //     $(subsection).addClass('top-subsection');
        // }
        // else {
        //     $(subsection).addClass('middle-subsection');
        // }


        $(subsection).addClass('width');

        subsection.innerText = property.charAt(0).toUpperCase() + property.slice(1);

        //Создание лейбла и чекбокса в нем
        for (const value of properties[property]) {

            var newLabel = document.createElement('label');

            $(newLabel).addClass('checkbox-element');
            newLabel.innerText = value.charAt(0).toUpperCase() + value.slice(1);

            var newCheckBox = document.createElement('input');

            $(newCheckBox).attr({
                type: 'checkbox',
                name: property,
                value: value
            });


            // Вставка чекбокса перед текстом лейбла
            newLabel.prepend(newCheckBox);

            // Вставка лейбла 
            subsection.append(newLabel);

        }


        container.append(subsection);

    }
}









