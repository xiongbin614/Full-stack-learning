package com.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "更新用户入参")
public class UserUpdateDTO {

    @Size(max = 64, message = "昵称最长 64")
    @Schema(description = "昵称")
    private String nickname;

    @Size(max = 64, message = "真实姓名最长 64")
    @Schema(description = "真实姓名")
    private String realName;

    @Size(max = 128, message = "邮箱最长 128")
    @Schema(description = "邮箱")
    private String email;

    @Size(max = 20, message = "手机号最长 20")
    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "头像 URL")
    private String avatar;

    @Schema(description = "性别：0未知 1男 2女")
    private Integer gender;

    @Schema(description = "状态：0禁用 1启用")
    private Integer status;

    @Size(max = 255, message = "备注最长 255")
    @Schema(description = "备注")
    private String remark;
}
