package com.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "文章分页查询")
public class ArticleQueryDTO {

    @Schema(description = "页码，从 1 开始", example = "1")
    private Integer pageNum = 1;

    @Schema(description = "每页条数", example = "10")
    private Integer pageSize = 10;

    @Schema(description = "分类（精确）")
    private String category;

    @Schema(description = "标题关键词")
    private String title;

    @Schema(description = "作者")
    private String author;

    /** create_time_desc | create_time_asc | view_count_desc */
    @Schema(description = "排序：create_time_desc / create_time_asc / view_count_desc", example = "create_time_desc")
    private String sort;
}
