package com.kt_miniproject.demo.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {
    private String email;
    private String password;
    private String name;
    private Role role;
    private String api_key;

}
