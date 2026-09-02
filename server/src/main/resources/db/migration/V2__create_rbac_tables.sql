-- RBAC：一套用户，管理端 / 门户端靠角色与权限码区分
-- 主键 BIGINT，配合 MyBatis-Plus id-type: assign_id（雪花）；初始化数据使用固定 ID 便于引用

CREATE TABLE sys_user (
    id              BIGINT       NOT NULL COMMENT '主键',
    username        VARCHAR(64)  NOT NULL COMMENT '登录名',
    password        VARCHAR(128) NOT NULL COMMENT '密码（BCrypt）',
    nickname        VARCHAR(64)  DEFAULT NULL COMMENT '昵称',
    real_name       VARCHAR(64)  DEFAULT NULL COMMENT '真实姓名',
    email           VARCHAR(128) DEFAULT NULL COMMENT '邮箱',
    phone           VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
    avatar          VARCHAR(512) DEFAULT NULL COMMENT '头像 URL',
    gender          TINYINT      NOT NULL DEFAULT 0 COMMENT '性别：0未知 1男 2女',
    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
    remark          VARCHAR(255) DEFAULT NULL COMMENT '备注',
    last_login_at   DATETIME     DEFAULT NULL COMMENT '最后登录时间',
    last_login_ip   VARCHAR(64)  DEFAULT NULL COMMENT '最后登录 IP',
    deleted         TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除：0否 1是',
    create_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_sys_user_username (username),
    KEY idx_sys_user_phone (phone),
    KEY idx_sys_user_email (email),
    KEY idx_sys_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统用户';

CREATE TABLE sys_role (
    id              BIGINT       NOT NULL COMMENT '主键',
    code            VARCHAR(64)  NOT NULL COMMENT '角色编码，如 SUPER_ADMIN',
    name            VARCHAR(64)  NOT NULL COMMENT '角色名称',
    description     VARCHAR(255) DEFAULT NULL COMMENT '说明',
    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
    sort            INT          NOT NULL DEFAULT 0 COMMENT '排序，越小越靠前',
    deleted         TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除：0否 1是',
    create_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_sys_role_code (code),
    KEY idx_sys_role_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色';

CREATE TABLE sys_permission (
    id              BIGINT       NOT NULL COMMENT '主键',
    parent_id       BIGINT       NOT NULL DEFAULT 0 COMMENT '父级 ID，0 为根',
    name            VARCHAR(64)  NOT NULL COMMENT '名称',
    code            VARCHAR(128) NOT NULL COMMENT '权限码，如 admin:user:list',
    type            VARCHAR(16)  NOT NULL COMMENT '类型：menu菜单 button按钮 api接口',
    client          VARCHAR(16)  NOT NULL DEFAULT 'admin' COMMENT '所属端：admin管理端 portal门户端',
    path            VARCHAR(255) DEFAULT NULL COMMENT '前端路由路径',
    icon            VARCHAR(64)  DEFAULT NULL COMMENT '菜单图标',
    sort            INT          NOT NULL DEFAULT 0 COMMENT '排序，越小越靠前',
    status          TINYINT      NOT NULL DEFAULT 1 COMMENT '状态：0禁用 1启用',
    deleted         TINYINT      NOT NULL DEFAULT 0 COMMENT '逻辑删除：0否 1是',
    create_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_sys_permission_code (code),
    KEY idx_sys_permission_parent (parent_id),
    KEY idx_sys_permission_client (client)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限（菜单/按钮/接口）';

CREATE TABLE sys_user_role (
    id              BIGINT   NOT NULL COMMENT '主键',
    user_id         BIGINT   NOT NULL COMMENT '用户 ID',
    role_id         BIGINT   NOT NULL COMMENT '角色 ID',
    create_time     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_sys_user_role (user_id, role_id),
    KEY idx_sys_user_role_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户-角色';

CREATE TABLE sys_role_permission (
    id              BIGINT   NOT NULL COMMENT '主键',
    role_id         BIGINT   NOT NULL COMMENT '角色 ID',
    permission_id   BIGINT   NOT NULL COMMENT '权限 ID',
    create_time     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_sys_role_permission (role_id, permission_id),
    KEY idx_sys_role_permission_perm (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色-权限';

-- ---------- 初始化角色 ----------
INSERT INTO sys_role (id, code, name, description, status, sort) VALUES
(1, 'SUPER_ADMIN', '超级管理员', '管理端全部权限', 1, 1),
(2, 'OPS',         '运营人员',   '管理端用户与业务运营', 1, 2),
(3, 'AUDITOR',     '审计人员',   '管理端日志只读', 1, 3),
(4, 'PORTAL_USER', '门户用户',   '门户普通用户', 1, 10),
(5, 'DEPT_LEADER', '部门主管',   '门户审批权限', 1, 11);

-- ---------- 初始化权限（管理端 + 门户端） ----------
INSERT INTO sys_permission (id, parent_id, name, code, type, client, path, icon, sort) VALUES
-- 管理端
(100, 0,   '系统管理',     'admin:system',              'menu',   'admin',  '/system',              'SettingOutlined', 1),
(101, 100, '用户管理',     'admin:user',                'menu',   'admin',  '/system/user',         'UserOutlined',    1),
(102, 101, '用户查询',     'admin:user:list',           'button', 'admin',  NULL,                   NULL,              1),
(103, 101, '用户新增',     'admin:user:create',         'button', 'admin',  NULL,                   NULL,              2),
(104, 101, '用户编辑',     'admin:user:update',         'button', 'admin',  NULL,                   NULL,              3),
(105, 101, '用户删除',     'admin:user:delete',         'button', 'admin',  NULL,                   NULL,              4),
(106, 101, '重置密码',     'admin:user:reset-password', 'button', 'admin',  NULL,                   NULL,              5),
(110, 100, '角色管理',     'admin:role',                'menu',   'admin',  '/system/role',         'TeamOutlined',    2),
(111, 110, '角色查询',     'admin:role:list',           'button', 'admin',  NULL,                   NULL,              1),
(112, 110, '角色编辑',     'admin:role:update',         'button', 'admin',  NULL,                   NULL,              2),
(120, 100, '权限管理',     'admin:permission',          'menu',   'admin',  '/system/permission',   'KeyOutlined',     3),
(121, 120, '权限查询',     'admin:permission:list',     'button', 'admin',  NULL,                   NULL,              1),
(130, 0,   '日志管理',     'admin:log',                 'menu',   'admin',  '/log',                 'FileTextOutlined', 2),
(131, 130, '日志查询',     'admin:log:list',            'button', 'admin',  NULL,                   NULL,              1),
-- 门户端
(200, 0,   '工作台',       'portal:dashboard',          'menu',   'portal', '/dashboard',           'DashboardOutlined', 1),
(210, 0,   '我的审批',     'portal:approval',           'menu',   'portal', '/approval',            'AuditOutlined',     2),
(211, 210, '审批查看',     'portal:approval:view',      'button', 'portal', NULL,                   NULL,                1),
(212, 210, '发起申请',     'portal:approval:submit',    'button', 'portal', NULL,                   NULL,                2),
(213, 210, '审批处理',     'portal:approval:approve',   'button', 'portal', NULL,                   NULL,                3);

-- SUPER_ADMIN：全部管理端权限
INSERT INTO sys_role_permission (id, role_id, permission_id)
SELECT 1000 + p.id, 1, p.id FROM sys_permission p WHERE p.client = 'admin';

-- OPS：用户相关 + 日志查询
INSERT INTO sys_role_permission (id, role_id, permission_id) VALUES
(2001, 2, 100), (2002, 2, 101), (2003, 2, 102), (2004, 2, 103), (2005, 2, 104),
(2006, 2, 106), (2007, 2, 130), (2008, 2, 131);

-- AUDITOR：日志
INSERT INTO sys_role_permission (id, role_id, permission_id) VALUES
(3001, 3, 130), (3002, 3, 131);

-- PORTAL_USER：工作台 + 发起/查看审批
INSERT INTO sys_role_permission (id, role_id, permission_id) VALUES
(4001, 4, 200), (4002, 4, 210), (4003, 4, 211), (4004, 4, 212);

-- DEPT_LEADER：门户用户权限 + 审批处理
INSERT INTO sys_role_permission (id, role_id, permission_id) VALUES
(5001, 5, 200), (5002, 5, 210), (5003, 5, 211), (5004, 5, 212), (5005, 5, 213);

-- 默认管理员（明文密码：ChangeMe@123，请登录后立即修改）
INSERT INTO sys_user (id, username, password, nickname, real_name, email, phone, gender, status, remark) VALUES
(1, 'admin', '$2b$10$IU5heBJ5w1xqsGe5/xhYYuE8Zhgg3BoVjBoEaNna5sPTDZ2xgimtK', '系统管理员', '管理员', 'admin@example.com', '13800000000', 0, 1, '初始超管，请尽快改密');

INSERT INTO sys_user_role (id, user_id, role_id) VALUES
(1, 1, 1);
