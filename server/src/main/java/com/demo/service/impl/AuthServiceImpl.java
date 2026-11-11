package com.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.demo.dto.LoginDTO;
import com.demo.entity.User;
import com.demo.mapper.UserMapper;
import com.demo.service.AuthService;
import com.demo.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int STATUS_ENABLED = 1;

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginVO login(LoginDTO dto) {
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, dto.getUsername())
                .last("LIMIT 1"));

        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            log.warn("登录失败 username={}", dto.getUsername());
            throw new IllegalArgumentException("用户名或密码错误");
        }
        if (user.getStatus() == null || user.getStatus() != STATUS_ENABLED) {
            log.warn("账号已禁用 username={}", dto.getUsername());
            throw new IllegalArgumentException("账号已被禁用，请联系管理员");
        }

        log.info("登录成功 username={} userId={}", user.getUsername(), user.getId());
        return LoginVO.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .role(user.getRole())
                .message("登录成功")
                .build();
    }
}
