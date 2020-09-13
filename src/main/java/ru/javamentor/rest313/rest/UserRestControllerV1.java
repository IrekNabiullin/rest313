package ru.javamentor.rest313.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import ru.javamentor.rest313.model.User;
import ru.javamentor.rest313.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@RestController
@RequestMapping("/api/users")
public class UserRestControllerV1 {
    private final UserService userService;

    @Autowired
    public UserRestControllerV1(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> read(Authentication authentication, ModelMap modelMap) {
        final List<User> users = userService.listUsers();
        System.out.println("REST controller. Reading users.");
        User user = userService.getUserByName(authentication.getName());
        modelMap.addAttribute("user", user);
        modelMap.addAttribute("users", users);
        return users != null && !users.isEmpty()
                ? new ResponseEntity<>(users, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody User user) {
        System.out.println("REST controller. Adding user.");
        userService.addUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<User> read(@PathVariable(name = "id") int id) {
        System.out.println("REST controller. Reading user with id = " + id);
        final User user = userService.getUserById((long) id);

        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") int id, @RequestBody User user) {
        System.out.println("REST controller. Updating user with id = " + id);
        final User userToUpdate = userService.getUserById((long) id);
        boolean updated = false;
        if (userToUpdate != null) {
            userService.updateUser(userToUpdate);
            updated = true;
        } else {
            updated = false;
        }
//        final boolean updated = userService.update(user, id);
        return updated
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") int id) {
        System.out.println("REST controller. Deleting user with id = " + id);
        final User user = userService.getUserById((long) id);
        boolean deleted = false;
        if (user != null) {
            userService.deleteUser((long) id);
            deleted = true;
        } else {
            deleted = false;
        }
//        final boolean deleted = userService.delete(id);

        return deleted
                ? new ResponseEntity<>(HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
    }

//**************** заготовка для следующей задачи ********************
//    private List<User> USERS = Stream.of(
//            new User(1L, "Ivan", "Ivanov"),
//            new User(2L, "Sergey", "Sergeev"),
//            new User(3L, "Petr", "Petrov")
//    ).collect(Collectors.toList());
//
//    @GetMapping
//    public List<User> getAll() {
//        return USERS;
//    }
//
//    @GetMapping("/{Id}")
//    @PreAuthorize("hasAuthority('users:read')")
//    public User getById(@PathVariable long id) {
//        return USERS.stream().filter(user -> user.getId().equals(id))
//        .findFirst()
//                .orElse(null);
//    }
//
//    @PostMapping
//    @PreAuthorize("hasAuthority('users:write')")
//    public User create(@RequestBody User user) {
//        this.USERS.add(user);
//        return user;
//    }
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAuthority('users:write')")
//    public void deleteById(@PathVariable Long id) {
//        this.USERS.removeIf(user -> user.getId().equals(id));
//    }
}
