let modal = $('#defaultModal');
let modalTitle = $('.modal-title');
let modalBody = $('.modal-body');
let modalFooter = $('.modal-footer');

let clearFormButton = $('<button type="reset" class="btn btn-secondary">Clear</button>');
let primaryButton = $('<button type="button" class="btn btn-primary">Btn1</button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal">Btn2</button>');
let dangerButton = $('<button type="button" class="btn btn-danger">Btn3</button>');

$(document).ready(function(){
    viewAllUsers();
    defaultModal();
    console.log("Captain’s Log");
});

function defaultModal() {
    modal.modal({
        keyboard: true,
        backdrop: "static",
        show: false,
    }).on("show.bs.modal", function(event){
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let action = button.data('action');
        switch(action) {
            case 'viewUser':
                viewUser($(this), id);
                break;

            case 'addUser':
                addUser($(this));
                break;

            case 'editUser':
                editUser($(this), id);
                break;

            case 'deleteUser':
                deleteUser($(this), id);
                break;

            case 'viewCategory':
                viewCategory($(this), id);
                break;

            case 'addCategory':
                addCategory($(this));
                break;

            case 'editCategory':
                editCategory($(this), id);
                break;
        }
    }).on('hidden.bs.modal', function(event){
        $(this).find('.modal-title').html('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });
}

async function viewAllUsers() {
    $('#userTable tbody').empty();
    const usersResponse = await userService.findAll();
    const usersJson = usersResponse.json();
    usersJson.then(users => {
        users.forEach(user => {
            let userRow = `$(<tr>
                        <th scope="row">${user.id}</th>
                        <td>${user.title}</td>
                        <td>${user.edition}</td>
                        <td>${user.author}</td>
                        <td>${user.category.name}</td>
                        <td class="text-center">
                            <div class="btn-group" role="group" aria-label="Action Buttons">
                                <button class="btn btn-info btn-sm" data-id="${user.id}" data-action="viewUser" data-toggle="modal" data-target="#defaultModal"><i class="far fa-eye"></i></button>
                                <button class="btn btn-success btn-sm" data-id="${user.id}" data-action="editUser" data-toggle="modal" data-target="#defaultModal"><i class="far fa-edit"></i></button>
                                <button class="btn btn-danger btn-sm" data-id="${user.id}" data-action="deleteUser" data-toggle="modal" data-target="#defaultModal"><i class="far fa-trash-alt"></i></button>
                            </div>
                        </td>
                    </tr>)`;
            $('#userTable tbody').append(userRow);
        });
    });
}

async function viewUser(modal, id) {
    const userResponse = await userService.findById(id);
    const userJson = userResponse.json();

    modal.find(modalTitle).html('View User');
    let viewUserTableHidden = $('.viewUserTable:hidden')[0];
    modal.find(modalBody).html($(viewUserTableHidden).clone());
    let viewUserTable = modal.find('.viewUserTable');
    modal.find(viewUserTable).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);

    userJson.then(user => {
        modal.find('#id').html(user.id);
        modal.find('#title').html(user.title);
        modal.find('#edition').html(user.edition);
        modal.find('#author').html(user.author);
        modal.find('#userDescription').html(user.description);
        modal.find('#category').html(user.category.name);
    });
}

async function addUser(modal) {
    const categoriesResponse = await categoryService.findAll();
    const categoriesJson = categoriesResponse.json();

    modal.find(modalTitle).html('Add User');
    let userFormHidden = $('.userForm:hidden')[0];
    modal.find(modalBody).html($(userFormHidden).clone());
    let userForm = modal.find('.userForm');
    userForm.prop('id', 'addUserForm');
    modal.find(userForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'saveUserButton');
    primaryButton.html('Save');
    modal.find(modalFooter).append(primaryButton);
    categoriesJson.then(categories => {
        categories.forEach(category => {
            modal.find('#category').append(new Option(category.name, category.id));
        });
    });

    $('#saveUserButton').click(async function(e){
        let title = userForm.find('#title').val().trim();
        let edition = userForm.find('#edition').val().trim();
        let author = userForm.find('#author').val().trim();
        let userDescription = userForm.find('#userDescription').val().trim();
        let categoryId = userForm.find('#category option:selected').val().trim();
        let data = {
            title: title,
            edition: edition,
            author: author,
            description: userDescription,
            category: {
                id: categoryId
            }
        };

        const userResponse = await userService.add(data);

        if (userResponse.status == 201) {
            viewAllUsers();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('User added!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (userResponse.status == 400) {
            userResponse.json().then(response => {
                response.validationErrors.forEach(function(error){
                    modal.find('#' + error.field).addClass('is-invalid');
                    modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
                });
            });
        } else {
            userResponse.json().then(response => {
                let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                        ${response.error}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                modal.find('.modal-body').prepend(alert);
            });
        }
    });
}

async function editUser(modal, id) {
    const userResponse = await userService.findById(id);
    const userJson = userResponse.json();
    const categoriesResponse = await categoryService.findAll();
    const categoriesJson = categoriesResponse.json();

    let idInput = `<div class="form-group">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" disabled>
            <div class="invalid-feedback"></div>
        </div>`;

    modal.find(modalTitle).html('Edit User');
    let userFormHidden = $('.userForm:hidden')[0];
    modal.find(modalBody).html($(userFormHidden).clone());
    let userForm = modal.find('.userForm');
    userForm.prop('id', 'updateUserForm');
    modal.find(userForm).prepend(idInput);
    modal.find(userForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'updateUserButton');
    primaryButton.html('Update');
    modal.find(modalFooter).append(primaryButton);

    userJson.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#title').val(user.title);
        modal.find('#edition').val(user.edition);
        modal.find('#author').val(user.author);
        modal.find('#userDescription').val(user.description);
        categoriesJson.then(categories => {
            categories.forEach(category => {
                if (user.category.id == category.id)
                    modal.find('#category').append(new Option(category.name, category.id, false, true));
                else
                    modal.find('#category').append(new Option(category.name, category.id));
            });
        });
    });


    $('#updateUserButton').click(async function(e){
        let id = userForm.find('#id').val().trim();
        let title = userForm.find('#title').val().trim();
        let edition = userForm.find('#edition').val().trim();
        let author = userForm.find('#author').val().trim();
        let userDescription = userForm.find('#userDescription').val().trim();
        let categoryId = userForm.find('#category option:selected').val().trim();
        let data = {
            id: id,
            title: title,
            edition: edition,
            author: author,
            description: userDescription,
            category: {
                id: categoryId
            }
        };

        const userResponse = await userService.update(id, data);

        if (userResponse.status == 200) {
            viewAllUsers();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('User updated!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (userResponse.status == 400) {
            userResponse.json().then(response => {
                response.validationErrors.forEach(function(error){
                    modal.find('#' + error.field).addClass('is-invalid');
                    modal.find('#' + error.field).next('.invalid-feedback').text(error.message);
                });
            });
        } else {
            userResponse.json().then(response => {
                let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                        ${response.error}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                modal.find('.modal-body').prepend(alert);
            });
        }
    });
}

async function deleteUser(modal, id) {
    const userResponse = await userService.findById(id);
    const userJson = userResponse.json();

    modal.find(modalTitle).html('Delete User');
    let message = '<strong>Are you sure to delete the following user?</strong>';
    modal.find(modalBody).html(message);
    let viewUserTableHidden = $('.viewUserTable:hidden')[0];
    modal.find(modalBody).append($(viewUserTableHidden).clone());
    let viewUserTable = modal.find('.viewUserTable');
    modal.find(viewUserTable).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);
    dangerButton.prop('id', 'deleteUserButton');
    dangerButton.html('Delete');
    modal.find(modalFooter).append(dangerButton);

    userJson.then(user => {
        modal.find('#id').html(user.id);
        modal.find('#title').html(user.title);
        modal.find('#edition').html(user.edition);
        modal.find('#author').html(user.author);
        modal.find('#userDescription').html(user.description);
        modal.find('#category').html(user.category.name);
    });

    $('#deleteUserButton').click(async function(e){
        const userResponse = await userService.delete(id);

        if (userResponse.status == 204) {
            viewAllUsers();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('User deleted!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else {
            userResponse.json().then(response => {
                let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                            ${response.error}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
                modal.find('.modal-body').prepend(alert);
            });
        }
    });
}


const http = {
    fetch: async function(url, options = {}) {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
        });

        return response;
    }
};

const userService = {
    findAll: async () => {
        return await http.fetch('/api/users');
    },
    add: async (data) => {
        return await http.fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    findById: async (id) => {
        return await http.fetch('/api/users/' + id);
    },
    update: async (id, data) => {
        return await http.fetch('/api/users/' + id, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return await http.fetch('/api/users/' + id, {
            method: 'DELETE'
        });
    },
};
