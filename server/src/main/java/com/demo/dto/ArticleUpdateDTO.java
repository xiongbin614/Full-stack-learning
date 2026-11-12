package com.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "更新文章入参")
public class ArticleUpdateDTO {

    @NotBlank(message = "标题不能为空")
    @Size(max = 255, message = "标题最长 255")
    @Schema(description = "标题")
    private String title;

    @Size(max = 100, message = "分类最长 100")
    @Schema(description = "分类")
    private String category;

    @NotBlank(message = "作者不能为空")
    @Size(max = 64, message = "作者最长 64")
    @Schema(description = "作者")
    private String author;
}
