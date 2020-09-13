jQuery(function ($) {
    createTable();

    $('#registrationButton').click(function (e) { //e - это объект события, которое сработало. В нашем случае - нажатие на кнопку в форме регистрации

        e.preventDefault(); // Убираем у события действие по-умолчанию - отправку данных на сервер.

        $('#RegistrationNewUser').html('<h4>Registering new user...</h4>').fadeIn(1, function () {
            let createObject = {};
            createObject["id"] = 1;
            createObject["username"] = $("#usernameInput").val();
            createObject["lastName"] = $("#lastNameInput").val();
            createObject["email"] = $("#emailInput").val();
            createObject["login"] = $("#loginInput").val();
            createObject["password"] = $("#passwordInput").val();
            var select = document.getElementById("rolesInput");
            var value = select.value;
            if (value.includes("ADMIN")) {
                createObject["roles"] = [{"id": 1}]
            } else {
                createObject["roles"] = [{"id": 2}]
            }
            // createObject["roles"] = value;

            let jsonData = JSON.stringify(createObject);
            fetch('http://localhost:8080/rest/users/add', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: jsonData
            })
                .then(() => {

                    $("#registrationForm").trigger("reset");
                    $('#home').focus();


                    $('#usersTable').empty();
                    createTable();
                })
        })
    });


    $('#usersTable').on('click', '.edit-user', function () {

        let id = this.id.slice(this.id.lastIndexOf('-') + 1);
        $('#id-input').attr('value', id);
        document.getElementById("username-edit").value = $('#userUsername-' + id).text();
        document.getElementById("lastname-edit").value = $('#userLastName-' + id).text();
        document.getElementById("useremail-edit").value = $('#userEmail-' + id).text();
        document.getElementById("userlogin-edit").value = $('#userLogin-' + id).text();
        document.getElementById("password-edit").value = "";
        let userRow = $("[id=" + id + "]");
        let rolesList = ["ADMIN", "USER"];
        let userRoles = userRow.find('#userRoles-' + id).text();
        $('#role-edit').empty();
        rolesList.forEach(function (value) {
            if (userRoles.includes(value)) {
                $('#role-edit').append('<option id="option"' + value + ' value="' + value + '" selected>' + value + '</option>')
            } else {
                $('#role-edit').append('<option id="option"' + value + ' value="' + value + '">' + value + '</option>')
            }
        });
    });

    $('#usersTable').on('click', '.delete-row', function () {

        let id = this.id.slice(this.id.lastIndexOf('-') + 1);
        $('#id-input-delete').attr('value', id);
        $('#id-input-hidden-delete').attr('value', id);
        document.getElementById("pretendent").innerText = ("Delete: " + $('#userUsername-' + id).text() + " ?")
        // $('#pretendent').attr("Delete: " + $('#userUsername-' + id).text() + " ?")
    })

    $('#delete-user').on('click', function () {
        let id = $('#id-input-hidden-delete').val();
        fetch('http://localhost:8080/rest/users/delete/' + id, {
            method: 'post',
            dataType: 'json'
        })
            .then(() => {
                $('#modal-delete #close-delete-btn').click();
                $('#usersTable').empty();
                createTable();
            })
    })

    $('#update-user').on('click', function () {
        let updateObject = {};
        updateObject["id"] = $("#id-input").val();
        updateObject["username"] = $("#username-edit").val();
        updateObject["lastName"] = $("#lastname-edit").val();
        updateObject["email"] = $("#useremail-edit").val();
        updateObject["login"] = $("#userlogin-edit").val();
        updateObject["password"] = $("#password-edit").val();

        let rol = $("#role-edit").val();
        if (rol.includes("ADMIN")) {
            updateObject["roles"] = [{"id": 1}]
        } else {
            updateObject["roles"] = [{"id": 2}]
        }

        let jsonData = JSON.stringify(updateObject);
        fetch('http://localhost:8080/api/users/edit', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: jsonData
        })
            .then(newData =>

                $(`#${newData.id}`).replaceWith(`
                    <tr id="${newData.id}">        
                        <td id="userId-${newData.id}">${newData.id}</td>
                        <td id="userUsername-${newData.id}">${newData.username}</td>
                        <td id="userLastName-${newData.id}">${newData.lastName}</td>
                        <td id="userEmail-${newData.id}">${newData.email}</td>
                        <td id="userLogin-${newData.id}">${newData.login}</td>
                        <td id="userPassword-${newData.id}">${newData.password}</td>
                        <td> <button type="button" class="btn btn-info edit-user" data-toggle="modal" data-target="#modal-edit" id="editButton-${newData.id}">Edit</button></td>
                        <td><button type="button" class="btn btn-danger delete-row" data-toggle="modal" data-target="#modal-delete" id="deleteButton-${newData.id}">Delete</button></td>
            </tr>\`;
                `)
            )
            .then(() => {
                $('#modal-edit #close-update-user').click();
                $('#usersTable').empty();
                createTable();
            })
    });


})
;


function createTable() {
    fetch("http://localhost:8080/api/users")
        .then(response => {
            response.json().then(data => {
                if (data.length > 0) {
                    let temp = "";
                    data.forEach(function (user) {
                        addTableRow(user);
                    })
                }
            })
        });
}

function addTableRow(user) {
    let end = `<tr id="${user.id}">
                        <td id="userId-${user.id}">${user.id}</td>
                        <td id="userUsername-${user.id}">${user.username}</td>
                        <td id="userLastName-${user.id}">${user.lastName}</td>
                        <td id="userEmail-${user.id}">${user.email}</td>
                        <td id="userLogin-${user.id}">${user.login}</td>
                        <td id="userPassword-${user.id}">${user.password
    }</td>
                        <td> <button type="button" class="btn btn-info edit-user" data-toggle="modal" data-target="#modal-edit" id="editButton-${user.id}">Edit</button></td>
                        <td><button type="button" class="btn btn-danger delete-row" data-toggle="modal" data-target="#modal-delete" id="deleteButton-${user.id}">Delete</button></td>
            </tr>`;
    $('#usersTable').append(end);
}