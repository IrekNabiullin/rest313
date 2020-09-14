// $('#update-user').on('click', function () {
//     let updateObject = {};
//     updateObject["id"] = $("#id-input").val();
//     updateObject["username"] = $("#username-edit").val();
//     updateObject["lastName"] = $("#lastname-edit").val();
//     updateObject["email"] = $("#useremail-edit").val();
//     updateObject["login"] = $("#userlogin-edit").val();
//     updateObject["password"] = $("#password-edit").val();
//
//     let rol = $("#role-edit").val();
//     if (rol.includes("ADMIN")) {
//         updateObject["roles"] = [{"id": 1}]
//     } else {
//         updateObject["roles"] = [{"id": 2}]
//     }
//
//     let jsonData = JSON.stringify(updateObject);
//     fetch('http://localhost:8080/api/users/edit', {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         method: 'post',
//         body: jsonData
//     })
//         .then(newData =>
//
//             $(`#${newData.id}`).replaceWith(`
//                     <tr id="${newData.id}">
//                         <td id="userId-${newData.id}">${newData.id}</td>
//                         <td id="userUsername-${newData.id}">${newData.username}</td>
//                         <td id="userLastName-${newData.id}">${newData.lastName}</td>
//                         <td id="userEmail-${newData.id}">${newData.email}</td>
//                         <td id="userLogin-${newData.id}">${newData.login}</td>
//                         <td id="userPassword-${newData.id}">${newData.password}</td>
//                         <td> <button type="button" class="btn btn-info edit-user" data-toggle="modal" data-target="#modal-edit" id="editButton-${newData.id}">Edit</button></td>
//                         <td><button type="button" class="btn btn-danger delete-row" data-toggle="modal" data-target="#modal-delete" id="deleteButton-${newData.id}">Delete</button></td>
//             </tr>\`;
//                 `)
//         )
//         .then(() => {
//             $('#modal-edit #close-update-user').click();
//             $('#usersTable').empty();
//             createTable();
//         })
// });
