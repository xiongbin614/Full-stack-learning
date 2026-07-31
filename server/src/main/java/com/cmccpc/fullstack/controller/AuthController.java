package com.cmccpc.fullstack.controller;

import com.cmccpc.fullstack.common.api.Result;
import com.cmccpc.fullstack.dto.LoginRequest;
import com.cmccpc.fullstack.dto.LoginResponse;
import com.cmccpc.fullstack.entity.User;
import com.cmccpc.fullstack.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证接口
 * <p>
 * 登录成功后建立 Session 认证（JSESSIONID），后续请求携带 Cookie 即可访问受保护接口。
 * 扩展 JWT 认证时，此接口应改为签发并返回 token。
 *
 * @author cmccpc
 */
@Tag(name = "认证", description = "登录认证相关接口")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Operation(summary = "登录（建立 Session）")
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                       HttpServletRequest servletRequest) {
        // 1. 手动认证：用户名密码校验委托给 DaoAuthenticationProvider
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        // 2. 建立安全上下文与 Session
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
        HttpSession session = servletRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

        // 3. 返回用户信息
        User user = userService.getUserByUsername(request.getUsername());
        LoginResponse response = LoginResponse.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .role(user.getRole())
                .message("登录成功（Session 认证，扩展 JWT 后此处返回 token）")
                .build();
        return Result.success(response);
    }

}
