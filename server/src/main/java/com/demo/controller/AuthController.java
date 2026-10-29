package com.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "认证模块", description = "登录相关接口（学习占位）")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "登录", description = "占位接口，后续再接真实逻辑")
    public String login() {
        return "login";
    }
}
