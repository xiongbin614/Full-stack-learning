package com.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 系统用户，对应表 sys_user。
 */
@Getter
@Setter
@TableName("sys_user")
public class SysUser {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String username;

    private String password;

    private String nickname;

    private String realName;

    private String email;

    private String phone;

    private String avatar;

    /** 性别：0未知 1男 2女 */
    private Integer gender;

    /** 状态：0禁用 1启用 */
    private Integer status;

    private String remark;

    private LocalDateTime lastLoginAt;

    private String lastLoginIp;

    @TableLogic
    private Integer deleted;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
