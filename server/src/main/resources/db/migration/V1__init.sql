-- 初始化：登录用户表 + 默认管理员
-- 执行方式（任选其一）：
--   1) 在 MySQL 客户端手动执行本文件（当前项目尚未接入 Flyway 自动迁移）
--   2) mysql -h127.0.0.1 -P3307 -uroot -p123456 demo < src/main/resources/db/migration/V1__init.sql
--
-- 默认账号：admin / admin123（密码为 BCrypt 存储）

CREATE TABLE IF NOT EXISTS sys_user (
    id            BIGINT       NOT NULL COMMENT '主键',
    username      VARCHAR(64)  NOT NULL COMMENT '登录名',
    password      VARCHAR(100) NOT NULL COMMENT '密码（BCrypt）',
    nickname      VARCHAR(64)           DEFAULT NULL COMMENT '昵称',
    email         VARCHAR(128)          DEFAULT NULL COMMENT '邮箱',
    phone         VARCHAR(32)           DEFAULT NULL COMMENT '手机号',
    status        TINYINT      NOT NULL DEFAULT 1 COMMENT '0-禁用 1-启用',
    role          VARCHAR(32)  NOT NULL DEFAULT 'USER' COMMENT '角色占位：ADMIN / USER',
    deleted       TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除：0-否 1-是',
    create_time   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_sys_user_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户';

-- BCrypt(admin123)
INSERT INTO sys_user (id, username, password, nickname, email, phone, status, role, deleted)
VALUES (
    1,
    'admin',
    '$2a$10$itSaFAT5/kYBZTfwMDd1k.OteSPP1RzbIQ4dHYatsuIKLAVTq2fEa',
    '系统管理员',
    'admin@cmccpc.local',
    '13800000001',
    1,
    'ADMIN',
    0
) ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    nickname = VALUES(nickname),
    status   = VALUES(status),
    role     = VALUES(role),
    deleted  = 0;
