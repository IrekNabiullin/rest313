let modal = $('#defaultModal');
let modalTitle = $('.modal-title');
let modalBody = $('.modal-body');
let modalFooter = $('.modal-footer');

let clearFormButton = $('<button type="reset" class="btn btn-secondary">Clear</button>');
let primaryButton = $('<button type="button" class="btn btn-primary"></button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');
let dangerButton = $('<button type="button" class="btn btn-danger"></button>');

$(document).ready(function () {
    createTable();
    defaultModal();
    console.log("Captain’s Log");
});


function defaultModal() {
    modal.modal({
        keyboard: true,
        backdrop: "static",
        show: false,
    }).on("show.bs.modal", function (event) {
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let action = button.data('action');
        switch (action) {
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
        }
    }).on('hidden.bs.modal', function (event) {
        $(this).find('.modal-title').html('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });
}

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
    let end = `<tr data-id="${user.id}">
                        <td id="userId-${user.id}">${user.id}</td>
                        <td id="userUsername-${user.id}">${user.username}</td>
                        <td id="userLastName-${user.id}">${user.lastName}</td>
                        <td id="userEmail-${user.id}">${user.email}</td>
                        <td id="userLogin-${user.id}">${user.login}</td>
                        <td id="userPassword-${user.id}">${user.password}</td>
                        <td id="userRoles-${user.id}">${user.roles.map(roles => roles.role)}</td>
                        <td> <button class="btn btn-info btn-sm" data-id="${user.id}" data-action="editUser" data-toggle="modal" data-target="#defaultModal">Edit</button></td>
                        <td> <button class="btn btn-danger btn-sm" data-id="${user.id}" data-action="deleteUser" data-toggle="modal" data-target="#defaultModal">Delete</button></td>
                    </tr>`;
    $('#usersTable').append(end);
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
        modal.find('#user_id').html(user.id);
        modal.find('#username').html(user.username);
        modal.find('#last_name').html(user.lastName);
        modal.find('#email').html(user.email);
        modal.find('#login').html(user.login);
        modal.find('#password').html(user.password);
        modal.find('#roles').html(user.roles.map(roles => roles.role));
    });
}

async function addUser(modal) {
    const rolesResponse = await userService.findAll();
    const rolesJson = rolesResponse.json();

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
    rolesJson.then(roles => {
        roles.forEach(role => {
            modal.find('#role').append(new Option(role.name, role.id));
        });
    });

    $('#saveUserButton').click(async function (e) {
        let name = userForm.find('#username').val().trim();
        let last_name = userForm.find('#last_name').val().trim();
        let email = userForm.find('#email').val().trim();
        let login = userForm.find('#logn').val().trim();
        let password = userForm.find('#password').val().trim();
        let roleId = userForm.find('#role option:selected').val().trim();
        let data = {
            name: name,
            last_name: last_name,
            email: email,
            login: login,
            password: password,
            role: {
                id: roleId
            }
        };

        const userResponse = await userService.add(data);

        if (userResponse.status === 200) {
            createTable();
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('User added!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#defaultModal').modal('show');
        } else if (userResponse.status === 400) {
            userResponse.json().then(response => {
                response.validationErrors.forEach(function (error) {
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
    const rolesResponse = await rolesService.findAll();
    const rolesJson = rolesResponse.json();

    modal.find(modalTitle).html('Edit User');
    let userFormHidden = $('.userForm:hidden')[0];
    modal.find(modalBody).html($(userFormHidden).clone());
    let userForm = modal.find('.userForm');
    userForm.prop('id', 'updateUserForm');
    modal.find(userForm).show();
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'updateUserButton');
    primaryButton.html('Update');
    modal.find(modalFooter).append(primaryButton);

    userJson.then(user => {
        modal.find('#user_id').val(user.id);
        modal.find('#username').val(user.username);
        modal.find('#last_name').val(user.lastName);
        modal.find('#email').val(user.email);
        modal.find('#login').val(user.login);
        modal.find('#password').val(user.password);
        // rolesJson.then(roles => {
        //     roles.forEach(role => {
        //         if (user.role.id == role.id)
        //             modal.find('#role').append(new Option(role.name, role.id, false, true));
        //         else
        //             modal.find('#role').append(new Option(role.name, role.id));
        //     });
        // });
    });



    $('#updateUserButton').click(async function (e) {
        let id = userForm.find('#user_id');
        let username = userForm.find('#username').val();
        let last_name = userForm.find('#last_name').val();
        let email = userForm.find('#email').val();
        let login = userForm.find('#login').val();
        let password = userForm.find('#password').val();
        let roleId = userForm.find('#roleId').val();
        let roleName = userForm.find('#roleName').val();
        let data = {
            id: id,
            name: username,
            last_name: last_name,
            email: email,
            login: login,
            password: password,
            roles: {
                roleId: roleId,
                roleName: roleName
            }
        };

        const userResponse = await userService.update(id, data);

        if (userResponse.status === 200) {
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('User updated!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#usersTable').find('tr[data-id="' + id + '"]').refresh();
        } else if (userResponse.status === 400) {
            userResponse.json().then(response => {
                response.validationErrors.forEach(function (error) {
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
        modal.find('#user_id').html(user.id);
        modal.find('#username').html(user.username);
        modal.find('#last_name').html(user.lastName);
        modal.find('#email').html(user.email);
        modal.find('#login').html(user.login);
        modal.find('#password').html(user.password);
        modal.find('#roles').html(user.roles.map(roles => roles.role));

    });


    $('#deleteUserButton').click(async function (e) {
        const userResponse = await userService.delete(id);
        if (userResponse.status === 200) {
            modal.find('.modal-title').html('Success');
            modal.find('.modal-body').html('User deleted!');
            dismissButton.html('Close');
            modal.find(modalFooter).html(dismissButton);
            $('#usersTable').find('tr[data-id="' + id + '"]').remove();
//                    $('#defaultModal').modal('show');
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
    fetch: async function (url, options = {}) {
        return await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
        });
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

