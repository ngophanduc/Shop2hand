package com.example.demo.controller;

import com.example.demo.service.BroadcasterService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sse")
public class SseController {

    private final BroadcasterService broadcasterService;

    public SseController(BroadcasterService broadcasterService) {
        this.broadcasterService = broadcasterService;
    }

    @GetMapping("/products")
    public SseEmitter subscribeToProducts() {
        return broadcasterService.addEmitter();
    }
}
