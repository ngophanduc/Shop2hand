package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Welcome to my world";
    }
}