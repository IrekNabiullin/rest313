package ru.javamentor.rest313.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.javamentor.rest313.model.User;
import ru.javamentor.rest313.service.UserService;

import java.util.List;


@Controller
@RequestMapping("/")
public class AppController {

    @Autowired
    private UserService userService;

    @Value("${page.users}")
    private String usersPage;
    @Value("${page.hello}")
    private String helloPage;

//    @GetMapping({"", "/", "/home"})
    @GetMapping({"/users"})
    public String users(Model model, Authentication authentication) {
 //       public String index(Model model, Authentication authentication) {
        model.addAttribute("pageName", usersPage);
        model.addAttribute("users", userService.listUsers());
        User user = userService.getUserByName(authentication.getName());
        model.addAttribute("user", user);
        return "users";
    }

    @GetMapping("/users2")
    public String users2(Model model, Authentication authentication) {
        model.addAttribute("pageName", usersPage);
        model.addAttribute("users", userService.listUsers());
        User user = userService.getUserByName(authentication.getName());
        model.addAttribute("user", user);
        return "users2";
    }

    @GetMapping("/users3")
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
//    public String users3(Model model, Authentication authentication) {
//        model.addAttribute("pageName", usersPage);
//        model.addAttribute("users", userService.listUsers());
//        User user = userService.getUserByName(authentication.getName());
//        model.addAttribute("user", user);
//        return "users3";
//    }

    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("pageName", helloPage);
        return "hello";
    }

}
