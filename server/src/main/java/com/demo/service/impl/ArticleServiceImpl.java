package com.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.demo.common.result.PageResult;
import com.demo.dto.ArticleCreateDTO;
import com.demo.dto.ArticleQueryDTO;
import com.demo.dto.ArticleUpdateDTO;
import com.demo.entity.Article;
import com.demo.mapper.ArticleMapper;
import com.demo.service.ArticleService;
import com.demo.vo.ArticleVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleMapper articleMapper;

    @Override
    public PageResult<ArticleVO> page(ArticleQueryDTO query) {
        int pageNum = query.getPageNum() == null || query.getPageNum() < 1 ? 1 : query.getPageNum();
        int pageSize = query.getPageSize() == null || query.getPageSize() < 1 ? 10 : query.getPageSize();
        if (pageSize > 100) {
            pageSize = 100;
        }

        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StringUtils.hasText(query.getCategory()), Article::getCategory, query.getCategory())
                .like(StringUtils.hasText(query.getTitle()), Article::getTitle, query.getTitle())
                .eq(StringUtils.hasText(query.getAuthor()), Article::getAuthor, query.getAuthor());
        applySort(wrapper, query.getSort());

        Page<Article> page = articleMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
        List<ArticleVO> list = page.getRecords().stream().map(this::toVO).toList();
        return new PageResult<>(list, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    public ArticleVO getById(Long articleId) {
        return toVO(requireArticle(articleId));
    }

    @Override
    public ArticleVO create(ArticleCreateDTO dto) {
        Article article = new Article();
        article.setTitle(dto.getTitle().trim());
        article.setCategory(normalizeCategory(dto.getCategory()));
        article.setAuthor(dto.getAuthor().trim());
        article.setViewCount(0L);
        articleMapper.insert(article);
        log.info("创建文章 articleId={} title={}", article.getArticleId(), article.getTitle());
        return toVO(article);
    }

    @Override
    public ArticleVO update(Long articleId, ArticleUpdateDTO dto) {
        Article article = requireArticle(articleId);
        article.setTitle(dto.getTitle().trim());
        article.setCategory(normalizeCategory(dto.getCategory()));
        article.setAuthor(dto.getAuthor().trim());
        articleMapper.updateById(article);
        log.info("更新文章 articleId={}", articleId);
        return toVO(articleMapper.selectById(articleId));
    }

    @Override
    public void delete(Long articleId) {
        requireArticle(articleId);
        articleMapper.deleteById(articleId);
        log.info("删除文章 articleId={}", articleId);
    }

    private Article requireArticle(Long articleId) {
        Article article = articleMapper.selectById(articleId);
        if (article == null) {
            throw new IllegalArgumentException("文章不存在");
        }
        return article;
    }

    private void applySort(LambdaQueryWrapper<Article> wrapper, String sort) {
        if ("create_time_asc".equals(sort)) {
            wrapper.orderByAsc(Article::getCreateTime);
        } else if ("view_count_desc".equals(sort)) {
            wrapper.orderByDesc(Article::getViewCount).orderByDesc(Article::getCreateTime);
        } else {
            wrapper.orderByDesc(Article::getCreateTime);
        }
    }

    private String normalizeCategory(String category) {
        return StringUtils.hasText(category) ? category.trim() : "";
    }

    private ArticleVO toVO(Article article) {
        return ArticleVO.builder()
                .articleId(article.getArticleId())
                .title(article.getTitle())
                .category(article.getCategory())
                .author(article.getAuthor())
                .viewCount(article.getViewCount())
                .createTime(article.getCreateTime())
                .updateTime(article.getUpdateTime())
                .build();
    }
}
