package com.demo.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "文章出参")
public class ArticleVO {

    private Long articleId;
    private String title;
    private String category;
    private String author;
    private Long viewCount;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
