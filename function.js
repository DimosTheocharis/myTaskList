// Query Selectors
let todoInput = document.querySelector(".todo-input");
let todoSubmit = document.querySelector(".todo-submit")
let todoList = document.querySelector('.todo-list');
let todoCheckButton = document.querySelector("todo-check");
let todoTrashButton = document.querySelector("todo-trash");
let todoFilter = document.querySelector("select");
let saveButton = document.getElementsByClassName("saveDay")[0];
let clearButton = document.getElementsByClassName("clearAll")[0];
let completedTodos = document.getElementsByClassName("completedTodos")[0];
let uncompletedTodos = document.getElementsByClassName("uncompletedTodos")[0];
let completedPercentage = document.getElementsByClassName('completedPercentage')[0];
let uncompletedPercentage = document.getElementsByClassName('uncompletedPercentage')[0];
let lastTimeCompletedTodo = document.getElementsByClassName('recentCompletedTodoTime')[0];
let lastTimeDeletedTodo = document.getElementsByClassName("recentDeletedTodoTime")[0];
let saveMessageContainer = document.getElementsByClassName("hiddenContainer")[0];
let saveMessageInput = document.getElementsByClassName('hiddenInput')[0];
let saveDayButton = document.getElementsByClassName('hiddenButton')[0];
let saveRoutineButton = document.getElementsByClassName('hiddenButton2')[0];
let saveDayLoader = document.querySelector("loader");
let saveDayDeletor = document.querySelector("deletor");
let savedDaysList = document.getElementsByClassName('savedDaysUl')[0];
let saveProgressButton = document.getElementsByClassName('saveProgress')[0];
let instructionsButton = document.getElementsByClassName("instructionsButton")[0];
////////////////////////////////////////////////////////////////// Variables //////////////////////////////////////////////////////////////
let currentFilterValue = todoFilter.value;
let Todos;

///////////////////////////////////////////////////////////  Event Listeners //////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', loadTodosFromLocalStorage,);
document.addEventListener('DOMContentLoaded', statistics);
todoSubmit.addEventListener("click", addTodo);
todoList.addEventListener("click", trashCheck);
todoFilter.addEventListener("click", filterTodos);
saveDayButton.addEventListener("click", saveDay);
saveRoutineButton.addEventListener("click", saveRoutine);
clearButton.addEventListener("click", clearAll);
savedDaysList.addEventListener("click", loadDeleteSavedDay);
saveProgressButton.addEventListener("click", saveProgress);
saveButton.addEventListener("click", (event)=> {
    event.preventDefault();
    todoList.style.display = "none";
    saveMessageContainer.style.display = "block";
})
instructionsButton.addEventListener('click', instructions);

//////////////////////////////////////////////////////////////////  Functions ////////////////////////////////////////////////////////////
function addTodo(event){
    //Prevent from submitting
    event.preventDefault();
    if (todoInput.value !== "") {
        // Creating Div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.classList.add('uncompleted');
        // Creating Li
        const todoLi = document.createElement("li");
        todoLi.innerText = todoInput.value;
        todoDiv.appendChild(todoLi);
        // Creating check button
        const checkButton = document.createElement('button');
        checkButton.classList.add('todo-check');
        checkButton.innerHTML = "<i class='fas fa-check'></i>";
        todoDiv.appendChild(checkButton);
        // Creating Trash button
        const trashButton = document.createElement('button');
        trashButton.classList.add("todo-trash");
        trashButton.innerHTML = "<i class='fas fa-trash'></i>";
        todoDiv.appendChild(trashButton);
        // Appending whole Div at the todo ul before the first element with class = completed
        //// o deikths tou protou child poy exei class completed kai dn einai to kainorio TODO
        let indexOfFirstCompletedElement = 0;
        let found = false;
        todoList.childNodes.forEach(child=> {
            // briskw se poia thesi prepei na mpei to TODO poy egine completed.
            if (!found){
                if (child.classList[1] === 'completed' && child !== parent){
                    found = true;
                } else {
                    indexOfFirstCompletedElement += 1;
                }
            }
        })
        todoList.insertBefore(todoDiv, todoList.childNodes[indexOfFirstCompletedElement]);
        todoInput.value = "";
        addTodoToLocalStorage(todoLi.innerText,todoDiv.classList[1],indexOfFirstCompletedElement);
        statistics();
        if (todoList.clientHeight > 0.4*screen.height){
            todoList.style.overflowY = "scroll";
        } else {
            todoList.style.overflowY = "visible";
        } 
    }
}

function trashCheck(event){
    let item = event.target;
    if (item.classList[0] === "todo-trash"){
        item.parentNode.classList.add('deleted');
        item.addEventListener('transitionend', function(){
            item.parentNode.remove();
            deleteTodoFromLocalStorage(item.parentNode);
            statistics();
            // tsekare an prepei na emfaniseis to scroll bar h oxi
            if (todoList.clientHeight > 0.4*screen.height){
                todoList.style.overflowY = "scroll";
            } else {
                todoList.style.overflowY = "visible";
            } 
        })
    } else if (item.classList[0] === "todo-check"){
        let parent = item.parentNode;
        item.remove();
        parent.classList.add('completed');
        parent.classList.remove('uncompleted');
        moveCompletedNodes(parent);
        statistics();
    }
}

function moveCompletedNodes(parent) {
    // bres thn thesh tou todo
    let counter = 0;
    let length = todoList.childNodes.length;
    while (todoList.childNodes[counter] !== parent){
        counter += 1;
    }
    let todos_values = JSON.parse(localStorage.getItem('TodosValues'));
    let todos_classes = JSON.parse(localStorage.getItem('TodosClasses'));
    // bgale to todovalue kai to todoclass apo to localstorage
    todos_values.splice(counter, 1);
    todos_classes.splice(counter, 1);
    // bale to todovalue kai to todoclass sto telos tou localstorage
    todos_values.push(parent.childNodes[0].innerText);
    todos_classes.push(parent.classList[1]);
    // apothikeuse ta sto localStorage
    localStorage.setItem('TodosValues', JSON.stringify(todos_values));
    localStorage.setItem('TodosClasses', JSON.stringify(todos_classes));
    // bale to todo sto telos tou TODOlist
    todoList.insertBefore(parent, null);
}

function deleteTodoFromLocalStorage(todo){
    let counter = 0;
    let todos_classes = JSON.parse(localStorage.getItem('TodosClasses'));
    let todos_values = JSON.parse(localStorage.getItem('TodosValues'));
    while (todos_values[counter] !== todo.childNodes[0].innerText && counter <= todos_values.length){
        counter += 1;
    } 
    console.log(counter);
    todos_values.splice(counter, 1);
    todos_classes.splice(counter, 1);
    localStorage.setItem('TodosClasses', JSON.stringify(todos_classes));
    localStorage.setItem('TodosValues', JSON.stringify(todos_values));
}

function filterTodos(){
    let option = todoFilter.value;
    if (option !== currentFilterValue){
        todoList.childNodes.forEach(todo=>{
            todo.style.display = 'flex';
        }) 
        if (option === "completed"){
            todoList.childNodes.forEach(function(todo){
                if (todo.classList[1]!== "completed"){
                    todo.style.display = "none";
                }
            })
        } else if (option === "uncompleted"){
            todoList.childNodes.forEach(todo=>{
                if (todo.classList.contains('completed')){
                    todo.style.display = 'none';
                } 
            })
        }
        currentFilterValue = option;
    }
}

function addTodoToLocalStorage(todo_value, todo_class, todo_index){
    let todos_values, todos_classes;
    if (localStorage.getItem('TodosValues') === null){
        todos_values = [];
        todos_classes = [];
    } else {
        todos_values = JSON.parse(localStorage.getItem('TodosValues'));
        todos_classes = JSON.parse(localStorage.getItem('TodosClasses'));
    }
    todos_values.splice(todo_index, 0, todo_value);
    todos_classes.splice(todo_index, 0, todo_class);
    localStorage.setItem('TodosValues', JSON.stringify(todos_values));
    localStorage.setItem('TodosClasses', JSON.stringify(todos_classes));

}

function loadTodosFromLocalStorage(){
    if (localStorage.getItem('TodosValues') !== null){
        let todos_values = JSON.parse(localStorage.getItem('TodosValues'));
        let todos_classes = JSON.parse(localStorage.getItem('TodosClasses'));
        for (let x=0;x<todos_values.length;x++){
            // Creating Div
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");
            todoDiv.classList.add(todos_classes[x]);
            // Creating Li
            const todoLi = document.createElement("li");
            todoLi.innerText = todos_values[x];
            todoDiv.appendChild(todoLi);
            if (todos_classes[x]!== "completed"){
                // Creating check button
                const checkButton = document.createElement('button');
                checkButton.classList.add('todo-check');
                checkButton.innerHTML = "<i class='fas fa-check'></i>";
                todoDiv.appendChild(checkButton);
            }
            // Creating Trash button
            const trashButton = document.createElement('button');
            trashButton.classList.add("todo-trash");
            trashButton.innerHTML = "<i class='fas fa-trash'></i>";
            todoDiv.appendChild(trashButton);
            // Appending whole Div at the todo ul
            todoList.appendChild(todoDiv);
        }
    }
    if (localStorage.getItem('SavedDays') === null){
        localStorage.setItem('SavedDays', "{}");
    } else {
        let savedDays = JSON.parse(localStorage.getItem('SavedDays'));
        let days = Object.keys(savedDays);
        days.forEach(day => {
            let nameDay = day;
            // Creating New Saved Day
            let savedDay = document.createElement('div');
            savedDay.classList.add('savedDay');
            // Creating li
            let savedDayLi = document.createElement("li");
            savedDayLi.innerText = nameDay;
            savedDayLi.classList.add("savedDayLi");
            // Creating badge div
            let badge = document.createElement("div");
            badge.classList.add(savedDays[day][2]);
            if (savedDays[day][2] === "badgeDay"){
                badge.innerText = "D";
            } else if (savedDays[day][2] === "badgeRoutine"){
                badge.innerText = "R";
            }
            // Creating load button
            let loaderButton = document.createElement('button');
            loaderButton.classList.add('loader');
            loaderButton.innerText = "Load";
            // Creating delete button
            let deletorButton = document.createElement('button');
            deletorButton.classList.add('deletor');
            deletorButton.innerHTML = '<i class="fas fa-trash"></i>';
            // Appending li, buttons to div
            savedDay.appendChild(savedDayLi);
            savedDay.appendChild(badge);
            savedDay.appendChild(loaderButton);
            savedDay.appendChild(deletorButton);
            // Appending div to UL
            savedDaysList.appendChild(savedDay); 
        })
    }
    loadSelectedSavedDay();
    enableDisableSaveProgressButton();
}

function clearAll(event){
    event.preventDefault();
    localStorage.setItem('selectedSavedDay', "");
    loadSelectedSavedDay();
    let totalTodos = todoList.childNodes.length;
    for (let i=0;i<totalTodos;i++){
        todoList.childNodes[0].remove();
    }
    localStorage.setItem("TodosValues", "[]");
    localStorage.setItem('TodosClasses', "[]");
    localStorage.setItem('selectedSavedDay', "");
    statistics();
    enableDisableSaveProgressButton();
}

function statistics(){
    let completed = 0;
    let uncompleted = 0;
    let completedRate;
    let uncompletedRate;
    todoList.childNodes.forEach(child=> {
        if (child.classList[1] === 'completed'){
            completed += 1;
        } else if (child.classList[1] === 'uncompleted'){
            uncompleted += 1;
        }
    })
    if (completed + uncompleted !== 0){
        completedRate = completed /(completed + uncompleted) * 100;
        uncompletedRate = uncompleted / (completed + uncompleted) * 100;
    } else {
        completedRate = 0;
        uncompletedRate = 0;
    }
    completedTodos.innerText = `Completed Tasks: ${completed}`;
    uncompletedTodos.innerText = `Uncompleted Tasks: ${uncompleted}`;
    completedPercentage.innerText = `Percentage of Completed Tasks: ${completedRate.toFixed(1)}%`;
    uncompletedPercentage.innerText = `Percentage of Uncompleted Tasks: ${uncompletedRate.toFixed(1)}%`;
    const time = new Date();
    //lastTimeCompletedTodo.innerText += `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}-${time.getHours()}:${time.getMinutes()}`;
}

function loadSelectedSavedDay(){
    if (savedDaysList.childNodes.length > 0){
        savedDaysList.childNodes.forEach(child => {
            if (child.childNodes[0].innerText === localStorage.getItem('selectedSavedDay')){
                child.style.backgroundColor = 'rgb(50,50,50)';
                //child.style.backgroundColor = 'black';
            } else {
                child.style.backgroundColor = 'black';
                //child.style.backgroundColor = 'rgb(50,50,50)';
            }
        })
    }
}

function saveDay(event){
    event.preventDefault();
    let nameDay = saveMessageInput.value;
    if (nameDay.length >= saveMessageInput.minLength){
        saveMessageContainer.style.display = "none";
        todoList.style.display = "block";
        let newDayValues = JSON.parse(localStorage.getItem('TodosValues'));
        let newDayClasses = JSON.parse(localStorage.getItem('TodosClasses'));
        let savedDays = JSON.parse(localStorage.getItem('SavedDays'));
        // apothikeuse thn kainouria mesa sto local storage
        savedDays[nameDay] = [newDayValues, newDayClasses, "badgeDay"];
        localStorage.setItem('SavedDays', JSON.stringify(savedDays));
        // Creating New Saved Day
        let savedDay = document.createElement('div');
        savedDay.classList.add('savedDay');
        // Creating li
        let savedDayLi = document.createElement("li");
        savedDayLi.innerText = nameDay;
        savedDayLi.classList.add("savedDayLi");
        // Creating badge div
        let badge = document.createElement("div");
        badge.innerText = "D";
        badge.classList.add("badgeDay");
        // Creating load button
        let loaderButton = document.createElement('button');
        loaderButton.classList.add('loader');
        loaderButton.innerText = "Load";
        // Creating delete button
        let deletorButton = document.createElement('button');
        deletorButton.classList.add('deletor');
        deletorButton.innerHTML = '<i class="fas fa-trash"></i>';
        // Appending li, buttons to div
        savedDay.appendChild(savedDayLi);
        savedDay.appendChild(badge);
        savedDay.appendChild(loaderButton);
        savedDay.appendChild(deletorButton);
        // Appending div to UL
        savedDaysList.appendChild(savedDay);
        clearAll(event);
    }
}

function saveRoutine(event){
    event.preventDefault();
    let nameDay = saveMessageInput.value;
    if (nameDay.length >= saveMessageInput.minLength){
        saveMessageContainer.style.display = "none";
        todoList.style.display = "block";
        let newDayValues = JSON.parse(localStorage.getItem('TodosValues'));
        let newDayClasses = JSON.parse(localStorage.getItem('TodosClasses'));
        // metatrepw ola ta todo pou exoun completed class se completed
        const classesLength = newDayClasses.length;
        for (let i=0;i<classesLength;i++){
            newDayClasses[i] = "uncompleted";
        }
        let savedDays = JSON.parse(localStorage.getItem('SavedDays'));
        // apothikeuse thn kainouria mera sto local storage
        savedDays[nameDay] = [newDayValues, newDayClasses, "badgeRoutine"];
        localStorage.setItem('SavedDays', JSON.stringify(savedDays));
        // Creating New Saved Day
        let savedDay = document.createElement('div');
        savedDay.classList.add('savedDay');
        // Creating li
        let savedDayLi = document.createElement("li");
        savedDayLi.innerText = nameDay;
        savedDayLi.classList.add("savedDayLi");
        // Creating badge div
        let badge = document.createElement("div");
        badge.innerText = "R";
        badge.classList.add("badgeRoutine");
        // Creating load button
        let loaderButton = document.createElement('button');
        loaderButton.classList.add('loader');
        loaderButton.innerText = "Load";
        // Creating delete button
        let deletorButton = document.createElement('button');
        deletorButton.classList.add('deletor');
        deletorButton.innerHTML = '<i class="fas fa-trash"></i>';
        // Appending li, buttons to div
        savedDay.appendChild(savedDayLi);
        savedDay.appendChild(badge);
        savedDay.appendChild(loaderButton);
        savedDay.appendChild(deletorButton);
        // Appending div to UL
        savedDaysList.appendChild(savedDay);
        clearAll(event);
    }
}

function loadDeleteSavedDay(event){
    event.preventDefault();
    let item = event.target;
    if (item.classList[0] === 'loader'){
        let currentLength = todoList.childNodes.length;
        for (let x=0; x<currentLength; x++){
            todoList.childNodes[0].remove();
        }
        let nameDay = item.parentNode.childNodes[0].innerText;
        let savedDays = JSON.parse(localStorage.getItem('SavedDays'));
        let todos_values = savedDays[nameDay][0];
        let todos_classes = savedDays[nameDay][1];
        localStorage.setItem('TodosValues', JSON.stringify(todos_values));
        localStorage.setItem('TodosClasses', JSON.stringify(todos_classes));
        localStorage.setItem('selectedSavedDay', nameDay);
        for (let x=0; x<todos_values.length; x++){
            // Creating Div
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");
            todoDiv.classList.add(todos_classes[x]);
            // Creating Li
            const todoLi = document.createElement("li");
            todoLi.innerText = todos_values[x];
            todoDiv.appendChild(todoLi);
            if (todos_classes[x]!== "completed"){
                // Creating check button
                const checkButton = document.createElement('button');
                checkButton.classList.add('todo-check');
                checkButton.innerHTML = "<i class='fas fa-check'></i>";
                todoDiv.appendChild(checkButton);
            }
            // Creating Trash button
            const trashButton = document.createElement('button');
            trashButton.classList.add("todo-trash");
            trashButton.innerHTML = "<i class='fas fa-trash'></i>";
            todoDiv.appendChild(trashButton);
            // Appending whole Div at the todo ul
            todoList.appendChild(todoDiv);
        
        }
        statistics()
        loadSelectedSavedDay();
        enableDisableSaveProgressButton();
    } else if (item.classList[0] === "deletor"){
        let nameDay = item.parentNode.childNodes[0].innerText;
        let savedDays = JSON.parse(localStorage.getItem('SavedDays'));
        console.log(savedDays);
        delete savedDays[nameDay];
        console.log(savedDays)
        localStorage.setItem('SavedDays', JSON.stringify(savedDays));
        item.parentNode.remove();
        statistics();
    }
}

function saveProgress(event){
    event.preventDefault();
    if (localStorage.getItem('selectedSavedDay') !== "" && JSON.parse(localStorage.getItem('SavedDays'))[localStorage.getItem('selectedSavedDay')][2] !== "badgeRoutine"){
        let selectedSavedDay = localStorage.getItem('selectedSavedDay');
        let savedDays = JSON.parse(localStorage.getItem('SavedDays'));
        savedDays[selectedSavedDay][0] = JSON.parse(localStorage.getItem('TodosValues'));
        savedDays[selectedSavedDay][1] = JSON.parse(localStorage.getItem('TodosClasses'));
        localStorage.setItem('SavedDays', JSON.stringify(savedDays));
        clearAll(event);

    }
}

function enableDisableSaveProgressButton(){
    if (localStorage.getItem('selectedSavedDay' === "" || localStorage.getItem('selectedSavedDay') === null)){
        saveProgressButton.classList.add('saveProgressDisabled');
        saveProgressButton.classList.remove('saveProgressEnabled');
    } else {
        if (JSON.parse(localStorage.getItem('SavedDays'))[localStorage.getItem('selectedSavedDay')][2] === "badgeRoutine") {
            saveProgressButton.classList.add('saveProgressDisabled');
            saveProgressButton.classList.remove('saveProgressEnabled');
        } else {
            saveProgressButton.classList.add('saveProgressEnabled');
            saveProgressButton.classList.remove('saveProgressDisabled');
        }
    }
}

function instructions(){
    window.location = "https://dimostheocharis.github.io/myTaskList/instructions.html";
}

/*let savedDays = {
    monday : ["hello", "eksi"],
    tuesday : ["noo", "efta"],
}


let keys = Object.keys(savedDays);
let values = Object.values(savedDays);
keys.forEach(key => {
    console.log(`${key}: ${savedDays[key]}`)
}) 
<div class="savedDay">
                    <li class="savedDayLi">Hello</li>
                    <button class="loader">Load</button>
                    <button class="deletor"><i class="fas fa-trash"></i></button>
                </div>
*/
