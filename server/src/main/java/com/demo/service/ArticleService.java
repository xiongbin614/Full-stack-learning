package com.demo.service;

import com.demo.common.result.PageResult;
import com.demo.dto.ArticleCreateDTO;
import com.demo.dto.ArticleQueryDTO;
import com.demo.dto.ArticleUpdateDTO;
import com.demo.vo.ArticleVO;

public interface ArticleService {

    PageResult<ArticleVO> page(ArticleQueryDTO query);

    ArticleVO getById(Long articleId);

    ArticleVO create(ArticleCreateDTO dto);

    ArticleVO update(Long articleId, ArticleUpdateDTO dto);

    void delete(Long articleId);
}
