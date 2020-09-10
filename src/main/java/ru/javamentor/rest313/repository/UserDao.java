package ru.javamentor.rest313.repository;

import ru.javamentor.rest313.model.User;

import java.util.List;

public interface UserDao {
    void addUser(User user);

    List<User> listUsers();

    User getUserById(Long id);

    User getUserByName(String username);

    void updateUser(User user);

    void deleteUser(Long id);

    void deleteAllUsersFromTable();
}
