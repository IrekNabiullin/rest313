package ru.javamentor.rest313.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class AppController {

    @Value("${page.home}")
    private String homePage;
    @Value("${page.users}")
    private String usersPage;
    @Value("${page.hello}")
    private String helloPage;

//    @GetMapping({"", "/", "/home"})
    @GetMapping({"", "/home"})
    public String index(Model model) {
        model.addAttribute("pageName", homePage);
        return "home";
    }

//    @GetMapping("/users2")
//    public String users(Model model) {
//        model.addAttribute("pageName", usersPage);
//        return "users2";
//    }

    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("pageName", helloPage);
        return "hello";
    }

}
