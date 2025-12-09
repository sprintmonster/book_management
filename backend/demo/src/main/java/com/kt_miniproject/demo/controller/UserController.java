package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.user.LoginRequest;
import com.kt_miniproject.demo.dto.user.UserResponse;
import com.kt_miniproject.demo.repository.UserRepository;
import com.kt_miniproject.demo.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")   // ★ /api/users 로 통일
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // 1. 유저 생성
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    // 2. 유저 조회
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return ResponseEntity.ok(user);
    }

    // 1. 로그인 (POST)
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        UserResponse loginUser = userService.login(request);

        // 세션에 회원 정보 저장 (서버가 "이 사람 로그인했음" 하고 기억표를 줌)
        session.setAttribute("loginUser", loginUser);

        return ResponseEntity.ok(loginUser);
    }

    // 2. 로그아웃 (POST) - 서비스 안 가고 여기서 끝냄
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // 세션 폭파 (기억표 삭제)
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    // 3. 아이디 찾기 (GET) - 쿼리 파라미터 사용 (?name=홍길동)
    @GetMapping("/modify/find_email")
    public ResponseEntity<Object> findEmail(@RequestParam String name) {
        List<String> email = userService.findEmail(name);
        return ResponseEntity.ok("찾으시는 이메일: " + email);
    }

    // 4. 비밀번호 찾기 (GET) - (?email=a@a.com&name=홍길동)
    @GetMapping("/modify/find_password")
    public ResponseEntity<String> findPassword(@RequestParam String email, @RequestParam String name) {
        String password = userService.findPassword(email, name);
        return ResponseEntity.ok("비밀번호는: " + password);
    }
}