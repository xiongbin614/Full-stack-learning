package com.cmccpc.fullstack.service.impl;

import com.cmccpc.fullstack.common.api.ResultCode;
import com.cmccpc.fullstack.common.exception.BusinessException;
import com.cmccpc.fullstack.dto.UserCreateRequest;
import com.cmccpc.fullstack.dto.UserUpdateRequest;
import com.cmccpc.fullstack.entity.User;
import com.cmccpc.fullstack.repository.UserRepository;
import com.cmccpc.fullstack.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现
 *
 * @author cmccpc
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ResultCode.USERNAME_EXISTS);
        }
        User user = User.builder()
                .username(request.getUsername())
                // 密码必须 BCrypt 加密存储
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role("USER")
                .status(1)
                .build();
        User saved = userRepository.save(user);
        log.info("创建用户成功: id={}, username={}", saved.getId(), saved.getUsername());
        return saved;
    }

    @Override
    public Page<User> pageUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.USER_NOT_FOUND));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(ResultCode.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
        log.info("删除用户成功: id={}", id);
    }

    @Override
    @Transactional
    public User updateUser(Long id, UserUpdateRequest request) {
        User user = getUserById(id);
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        User saved = userRepository.save(user);
        log.info("编辑用户成功: id={}", id);
        return saved;
    }

    @Override
    @Transactional
    public User updateUserStatus(Long id, Integer status) {
        User user = getUserById(id);
        user.setStatus(status);
        User saved = userRepository.save(user);
        log.info("更新用户状态成功: id={}, status={}", id, status);
        return saved;
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("重置用户密码成功: id={}", id);
    }

}
