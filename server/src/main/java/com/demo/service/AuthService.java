package com.demo.service;

import com.demo.dto.LoginDTO;
import com.demo.vo.LoginVO;

public interface AuthService {

    LoginVO login(LoginDTO dto);
}
