package com.demo.controller;

import com.demo.common.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 登录后菜单 / 角色占位数据，形状对齐 web-admin mock，后续再换成真实 RBAC。
 */
@RestController
@Tag(name = "RBAC 占位", description = "权限 / 角色列表（学习占位）")
public class RbacStubController {

    @GetMapping("/permissions")
    @Operation(summary = "权限点列表")
    public Result<List<Map<String, Object>>> permissions() {
        return Result.ok(List.of(
                perm(9, 0, "首页", "dashboard", "menu", "/dashboard", "DashboardOutlined", 0),
                perm(1, 0, "系统管理", "system", "menu", "/system", "SettingOutlined", 1),
                perm(2, 1, "用户管理", "system:user", "menu", "/system/user", "UserOutlined", 1),
                perm(3, 2, "创建用户", "system:user:create", "perm", null, null, 1),
                perm(4, 2, "删除用户", "system:user:delete", "perm", null, null, 2),
                perm(5, 2, "重置密码", "system:user:reset-password", "perm", null, null, 3),
                perm(6, 1, "角色管理", "system:role", "menu", "/system/role", "TeamOutlined", 2),
                perm(7, 1, "权限管理", "system:permission", "menu", "/system/permission", "KeyOutlined", 3),
                perm(8, 0, "日志管理", "log", "menu", "/log", "FileTextOutlined", 2)
        ));
    }

    @GetMapping("/roles")
    @Operation(summary = "角色列表")
    public Result<List<Map<String, Object>>> roles() {
        Map<String, Object> admin = new LinkedHashMap<>();
        admin.put("id", 1);
        admin.put("name", "超级管理员");
        admin.put("code", "ADMIN");
        admin.put("description", "拥有全部权限（占位）");
        admin.put("permissionIds", List.of(9, 1, 2, 3, 4, 5, 6, 7, 8));
        admin.put("status", 1);
        admin.put("createTime", "2026-01-01T09:00:00");
        return Result.ok(List.of(admin));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "工作台统计")
    public Result<Map<String, Object>> dashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("userTotal", 1);
        stats.put("roleCount", 1);
        stats.put("permissionCount", 9);
        stats.put("todayLogs", 0);
        return Result.ok(stats);
    }

    private static Map<String, Object> perm(int id, int parentId, String name, String code,
                                            String type, String path, String icon, int sort) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("parentId", parentId);
        m.put("name", name);
        m.put("code", code);
        m.put("type", type);
        if (path != null) {
            m.put("path", path);
        }
        if (icon != null) {
            m.put("icon", icon);
        }
        m.put("sort", sort);
        return m;
    }
}
