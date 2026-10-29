package com.demo.controller;

import com.demo.common.result.Result;
import com.demo.dto.LoginDTO;
import com.demo.dto.RegisterDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "认证模块", description = "登录 / 注册相关接口（学习占位）")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "登录", description = "占位接口，后续再接 AuthService")
    public Result<String> login(@Valid @RequestBody LoginDTO dto) {
        return Result.ok("login ok: " + dto.getUsername());
    }

    @PostMapping("/register")
    @Operation(summary = "注册", description = "占位接口，后续再接 AuthService")
    public Result<String> register(@Valid @RequestBody RegisterDTO dto) {
        return Result.ok("register ok: " + dto.getUsername());
    }
}
