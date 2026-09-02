package com.demo.controller;

import com.demo.common.constant.AuthConstant;
import com.demo.common.result.Result;
import com.demo.dto.LoginDTO;
import com.demo.dto.RegisterDTO;
import com.demo.service.AuthService;
import com.demo.vo.LoginVO;
import com.demo.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "认证模块", description = "登录 / 登出 / 注册")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "登录")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO dto, HttpServletRequest request) {
        return Result.ok(authService.login(dto, resolveClientIp(request)));
    }

    @PostMapping("/logout")
    @Operation(summary = "登出")
    public Result<Void> logout(HttpServletRequest request) {
        authService.logout(resolveToken(request));
        return Result.ok();
    }

    @PostMapping("/register")
    @Operation(summary = "注册")
    public Result<UserVO> register(@Valid @RequestBody RegisterDTO dto) {
        return Result.ok(authService.register(dto));
    }

    private String resolveToken(HttpServletRequest request) {
        String authorization = request.getHeader(AuthConstant.HEADER_AUTHORIZATION);
        if (StringUtils.hasText(authorization) && authorization.startsWith(AuthConstant.BEARER_PREFIX)) {
            return authorization.substring(AuthConstant.BEARER_PREFIX.length()).trim();
        }
        return null;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(realIp)) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}
