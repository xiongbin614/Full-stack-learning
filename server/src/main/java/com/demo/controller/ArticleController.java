package com.demo.controller;

import com.demo.common.result.PageResult;
import com.demo.common.result.Result;
import com.demo.dto.ArticleCreateDTO;
import com.demo.dto.ArticleQueryDTO;
import com.demo.dto.ArticleUpdateDTO;
import com.demo.service.ArticleService;
import com.demo.vo.ArticleVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
@Tag(name = "文章模块", description = "文章 CRUD")
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    @Operation(summary = "分页查询文章")
    public Result<PageResult<ArticleVO>> page(ArticleQueryDTO query) {
        return Result.ok(articleService.page(query));
    }

    @GetMapping("/{articleId}")
    @Operation(summary = "文章详情")
    public Result<ArticleVO> detail(@PathVariable Long articleId) {
        return Result.ok(articleService.getById(articleId));
    }

    @PostMapping
    @Operation(summary = "创建文章")
    public Result<ArticleVO> create(@Valid @RequestBody ArticleCreateDTO dto) {
        log.info("创建文章 title={}", dto.getTitle());
        return Result.ok(articleService.create(dto), "创建成功");
    }

    @PutMapping("/{articleId}")
    @Operation(summary = "更新文章")
    public Result<ArticleVO> update(@PathVariable Long articleId, @Valid @RequestBody ArticleUpdateDTO dto) {
        log.info("更新文章 articleId={}", articleId);
        return Result.ok(articleService.update(articleId, dto), "更新成功");
    }

    @DeleteMapping("/{articleId}")
    @Operation(summary = "删除文章（逻辑删除）")
    public Result<Void> delete(@PathVariable Long articleId) {
        log.info("删除文章 articleId={}", articleId);
        articleService.delete(articleId);
        return Result.ok(null, "删除成功");
    }
}
