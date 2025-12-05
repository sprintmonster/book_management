package com.kt_miniproject.demo.dto.user;

import com.kt_miniproject.demo.domain.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String name;
    private String api_Key;


    //  Book 엔티티를 받아서 응답 DTO로 변환하는 생성자
    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.api_Key = user.getApi_Key();
        this.password = user.getPassowrd();
    }
}