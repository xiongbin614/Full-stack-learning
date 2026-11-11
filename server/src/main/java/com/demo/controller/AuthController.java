package com.demo.controller;

import com.demo.common.result.Result;
import com.demo.dto.LoginDTO;
import com.demo.dto.RegisterDTO;
import com.demo.service.AuthService;
import com.demo.vo.LoginVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "认证模块", description = "登录 / 注册相关接口")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "登录", description = "按用户名查库并校验 BCrypt 密码")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO dto) {
        log.info("登录请求 username={}", dto.getUsername());
        LoginVO vo = authService.login(dto);
        return Result.ok(vo, "登录成功");
    }

    @PostMapping("/register")
    @Operation(summary = "注册", description = "占位接口，后续再接 AuthService")
    public Result<String> register(@Valid @RequestBody RegisterDTO dto) {
        log.info("注册请求 username={}", dto.getUsername());
        return Result.ok("register ok: " + dto.getUsername());
    }

    @PostMapping("/logout")
    @Operation(summary = "退出登录")
    public Result<Void> logout() {
        log.info("退出登录");
        return Result.ok(null, "已退出登录");
    }

    @GetMapping("/permissions")
    @Operation(summary = "当前用户权限码", description = "占位：管理员返回 *")
    public Result<List<String>> permissions() {
        return Result.ok(List.of("*"));
    }
}
