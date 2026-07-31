package com.cmccpc.fullstack.service;

import com.cmccpc.fullstack.dto.UserCreateRequest;
import com.cmccpc.fullstack.dto.UserUpdateRequest;
import com.cmccpc.fullstack.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 用户服务接口
 *
 * @author cmccpc
 */
public interface UserService {

    /**
     * 创建用户
     */
    User createUser(UserCreateRequest request);

    /**
     * 分页查询用户
     */
    Page<User> pageUsers(Pageable pageable);

    /**
     * 按 ID 查询用户
     */
    User getUserById(Long id);

    /**
     * 按用户名查询用户
     */
    User getUserByUsername(String username);

    /**
     * 删除用户
     */
    void deleteUser(Long id);

    /**
     * 编辑用户（昵称/邮箱/手机号）
     */
    User updateUser(Long id, UserUpdateRequest request);

    /**
     * 更新用户状态（禁用/启用）
     */
    User updateUserStatus(Long id, Integer status);

    /**
     * 重置密码
     */
    void resetPassword(Long id, String newPassword);

}
