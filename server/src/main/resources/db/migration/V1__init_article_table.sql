-- 文章表（规范命名：article / article_id）
-- 若本地仍是旧表 post，可执行：
--   RENAME TABLE post TO article;
--   ALTER TABLE article CHANGE post_id article_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '文章主键ID';

CREATE TABLE IF NOT EXISTS `article` (
  `article_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '文章主键ID',
  `title` VARCHAR(255) NOT NULL COMMENT '文章标题',
  `category` VARCHAR(100) DEFAULT '' COMMENT '分类',
  `author` VARCHAR(64) NOT NULL COMMENT '作者',
  `view_count` BIGINT NOT NULL DEFAULT 0 COMMENT '浏览量',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除 0未删 1已删',
  PRIMARY KEY (`article_id`),
  KEY `idx_category` (`category`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';
