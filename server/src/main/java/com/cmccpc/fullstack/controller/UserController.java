package com.cmccpc.fullstack.controller;

import com.cmccpc.fullstack.common.api.PageResult;
import com.cmccpc.fullstack.common.api.Result;
import com.cmccpc.fullstack.dto.ResetPasswordRequest;
import com.cmccpc.fullstack.dto.UpdateStatusRequest;
import com.cmccpc.fullstack.dto.UserCreateRequest;
import com.cmccpc.fullstack.dto.UserResponse;
import com.cmccpc.fullstack.dto.UserUpdateRequest;
import com.cmccpc.fullstack.entity.User;
import com.cmccpc.fullstack.service.UserService;
import com.cmccpc.fullstack.util.RedisUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;

/**
 * 用户管理接口（示例）
 */
@Tag(name = "用户管理", description = "用户 CRUD 示例接口")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private static final String USER_PAGE_CACHE_KEY = "cache:users:page:0:10";

    private final UserService userService;
    private final ObjectProvider<RedisUtil> redisUtilProvider;

    @Operation(summary = "创建用户")
    @PostMapping
    public Result<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return Result.success(UserResponse.from(userService.createUser(request)));
    }

    @Operation(summary = "分页查询用户")
    @GetMapping
    public Result<PageResult<UserResponse>> page(
            @Parameter(description = "页码，从 0 开始") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size) {
        Page<User> result = userService.pageUsers(PageRequest.of(page, size));
        List<UserResponse> records = result.getContent().stream().map(UserResponse::from).toList();
        return Result.success(PageResult.of(result.getTotalElements(), page, size, records));
    }

    @Operation(summary = "按 ID 查询用户")
    @GetMapping("/{id}")
    public Result<UserResponse> getById(@PathVariable Long id) {
        return Result.success(UserResponse.from(userService.getUserById(id)));
    }

    @Operation(summary = "删除用户（需 ADMIN）")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    @Operation(summary = "编辑用户（昵称/邮箱/手机号）")
    @PutMapping("/{id}")
    public Result<UserResponse> update(@PathVariable Long id,
                                       @Valid @RequestBody UserUpdateRequest request) {
        return Result.success(UserResponse.from(userService.updateUser(id, request)));
    }

    @Operation(summary = "禁用 / 启用用户")
    @PutMapping("/{id}/status")
    public Result<UserResponse> updateStatus(@PathVariable Long id,
                                             @Valid @RequestBody UpdateStatusRequest request) {
        return Result.success(UserResponse.from(userService.updateUserStatus(id, request.getStatus())));
    }

    @Operation(summary = "重置密码")
    @PutMapping("/{id}/password")
    public Result<Void> resetPassword(@PathVariable Long id,
                                      @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request.getPassword());
        return Result.success();
    }

    @Operation(summary = "演示 Redis 缓存（无 Redis 时直接查库）")
    @GetMapping("/demo/cache")
    public Result<List<UserResponse>> demoCache() {
        RedisUtil redisUtil = redisUtilProvider.getIfAvailable();
        if (redisUtil != null) {
            @SuppressWarnings("unchecked")
            List<UserResponse> cached = (List<UserResponse>) redisUtil.get(USER_PAGE_CACHE_KEY);
            if (cached != null) {
                return Result.success(cached);
            }
        }
        List<UserResponse> users = userService.pageUsers(PageRequest.of(0, 10))
                .getContent().stream().map(UserResponse::from).toList();
        if (redisUtil != null) {
            redisUtil.set(USER_PAGE_CACHE_KEY, users, Duration.ofMinutes(2));
        }
        return Result.success(users);
    }

}
