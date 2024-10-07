//Создание таблицы
function renderTr(users) {
  const tbody = document.getElementById("tbody");
  users.forEach((user) => {
    let row = document.createElement("tr");
    row.setAttribute("id", user.id);
    let propValue = `<td>${user.id}</td>
                     <td class="name">${user.name}</td>
                     <td class="email">${user.email}</td>
                     <td><button id="edit">Изменить</button></td>
                     <td><button id="delete">Удалить</button></td>`;
    row.innerHTML = propValue;
    tbody.appendChild(row);
  });
}

//Функция запроса данных
function requestBD() {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((data) => {
      renderTr(data);
    });
}

//Обработка формы (добавление пользователя)
const form = document.getElementById("user-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let inputNameValue = document.getElementById("inputName").value;
  let inputEmailValue = document.getElementById("inputEmail").value;
  const newUser = {
    name: inputNameValue,
    email: inputEmailValue,
  };
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((data) => {
      let userArr = [];
      userArr.push(data);
      renderTr(userArr);
      form.setAttribute("style", "display:none");
      console.log("OK", data);
    })
    .catch((error) => console.error("Ошибка", error));
});

//DEL and PATCH
const tbody = document.getElementById("tbody");
tbody.addEventListener("click", (event) => {
  event.preventDefault();
  let delBtnPress = event.target.id == "delete";
  let editBtnPress = event.target.id == "edit";
  let parentRow = event.target.parentElement.parentElement;

  //Удаляем
  if (delBtnPress) {
    fetch(`http://localhost:3000/users/${parentRow.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => location.reload());
  }
  //Изменяем
  if (editBtnPress) {
    const tdName = parentRow.querySelector(".name");
    const tdEmail = parentRow.querySelector(".email");
    const inputName = document.getElementById("inputName");
    const inputEmail = document.getElementById("inputEmail");
    const form = document.getElementById("user-form");
    form.setAttribute("style", "display:bloc");
    inputName.value = tdName.textContent;
    inputEmail.value = tdEmail.textContent; 
  }
  const writeBtn = document.getElementById("writeBtn");
  writeBtn.addEventListener('click', (event) =>{
    event.preventDefault();
    fetch(`http://localhost:3000/users/${parentRow.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: inputName.value,
        email: inputEmail.value,  
      })
    })
    .then(response => response.json())
    .then(() => location.reload())
  })
});

//Показать форму добавления пользователя
const addBtn = document.getElementById("addUser");
addBtn.addEventListener("click", () => {
  form.setAttribute("style", "display:bloc");
  console.log(form);
});

//=================================================

requestBD();