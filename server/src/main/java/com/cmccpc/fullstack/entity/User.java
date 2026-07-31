package com.cmccpc.fullstack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体（示例）
 * <p>
 * 展示 JPA 实体定义方式：主键策略、唯一约束、索引、审计字段。
 *
 * @author cmccpc
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sys_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 用户名 */
    @Column(nullable = false, length = 64, unique = true)
    private String username;

    /** 密码（BCrypt 加密存储，禁止明文；序列化时忽略） */
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(nullable = false, length = 128)
    private String password;

    /** 昵称 */
    @Column(length = 64)
    private String nickname;

    /** 邮箱 */
    @Column(length = 128)
    private String email;

    /** 手机号 */
    @Column(length = 20)
    private String phone;

    /**
     * 角色（演示用简化字段，正式 RBAC 应拆角色表）
     * 取值：USER / ADMIN
     */
    @Builder.Default
    @Column(nullable = false, length = 32)
    private String role = "USER";

    /** 状态：0-禁用 1-启用 */
    @Builder.Default
    @Column(nullable = false)
    private Integer status = 1;

    /** 创建时间（自动填充） */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createTime;

    /** 更新时间（自动更新） */
    @UpdateTimestamp
    private LocalDateTime updateTime;

}
