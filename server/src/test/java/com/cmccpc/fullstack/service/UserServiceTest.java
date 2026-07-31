package com.cmccpc.fullstack.service;

import com.cmccpc.fullstack.common.api.ResultCode;
import com.cmccpc.fullstack.common.exception.BusinessException;
import com.cmccpc.fullstack.dto.UserCreateRequest;
import com.cmccpc.fullstack.entity.User;
import com.cmccpc.fullstack.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 用户服务集成测试
 */
@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void createUser_shouldEncodePasswordAndPersist() {
        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("test_" + System.currentTimeMillis());
        request.setPassword("passw0rd");
        request.setNickname("测试用户");

        User user = userService.createUser(request);

        assertNotNull(user.getId());
        // 密码必须加密存储，不能是明文
        assertTrue(user.getPassword().startsWith("$2"));
        assertTrue(userRepository.existsByUsername(request.getUsername()));
    }

    @Test
    void createUser_withDuplicateUsername_shouldThrow() {
        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("duplicate_" + System.currentTimeMillis());
        request.setPassword("passw0rd");
        userService.createUser(request);

        UserCreateRequest duplicate = new UserCreateRequest();
        duplicate.setUsername(request.getUsername());
        duplicate.setPassword("passw0rd");

        BusinessException ex = assertThrows(BusinessException.class,
                () -> userService.createUser(duplicate));
        assertEquals(ResultCode.USERNAME_EXISTS.getCode(), ex.getCode());
    }

    @Test
    void getUserById_withUnknownId_shouldThrow() {
        assertThrows(BusinessException.class, () -> userService.getUserById(999999L));
    }

}
