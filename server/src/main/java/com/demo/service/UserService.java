package com.demo.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.demo.dto.UserCreateDTO;
import com.demo.dto.UserQuery;
import com.demo.dto.UserUpdateDTO;
import com.demo.vo.UserVO;

public interface UserService {

    IPage<UserVO> page(UserQuery query);

    UserVO getById(Long id);

    Long create(UserCreateDTO dto);

    void update(Long id, UserUpdateDTO dto);

    void delete(Long id);
}
