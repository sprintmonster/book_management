package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.Role;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.user.UserCreateRequest;
import com.kt_miniproject.demo.dto.user.UserResponse;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

// Mockito를 사용하여 단위 테스트 진행
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock // 가짜 리포지토리 생성
    private UserRepository userRepository;

    @Mock // 가짜 리포지토리 생성
    private BookRepository bookRepository;

    @InjectMocks // 가짜 리포지토리들을 이 서비스에 주입
    private UserServiceImpl userService;

    @Test
    @DisplayName("회원가입 성공 테스트")
    void createUser() {
        // given (준비)
        UserCreateRequest request = new UserCreateRequest();
        request.setEmail("test@test.com");
        request.setName("테스터");
        request.setPassword("1234");
        request.setRole(Role.USER);
        request.setApiKey("key123");

        // DB에 저장된 것처럼 ID가 부여된 가짜 User 객체
        User savedUser = User.builder()
                .id(1L)
                .email(request.getEmail())
                .name(request.getName())
                .build();

        // userRepository.save()가 호출되면, 무조건 savedUser를 리턴하라고 가짜 설정
        given(userRepository.save(any(User.class))).willReturn(savedUser);

        // when (실행)
        UserResponse response = userService.createUser(request);

        // then (검증)
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@test.com");
        assertThat(response.getName()).isEqualTo("테스터");

        // 실제로 save 메소드가 호출되었는지 확인
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("내 정보와 책 목록 조회 성공 테스트")
    void getUserInfo() {
        // given (준비)
        Long userId = 1L;

        // 1. 가짜 유저 준비
        User user = User.builder()
                .id(userId)
                .email("test@test.com")
                .name("테스터")
                .build();

        // 2. 가짜 책 목록 준비
        Book book1 = Book.builder().title("책1").content("내용1").build();
        ReflectionTestUtils.setField(book1, "id", 100L); // ID 강제 주입

        Book book2 = Book.builder().title("책2").content("내용2").build();
        ReflectionTestUtils.setField(book2, "id", 101L);

        List<Book> bookList = List.of(book1, book2);

        // 3. 가짜 동작 정의 (Stubbing)
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(bookRepository.findByUserId(userId)).willReturn(bookList);

        // when (실행)
        UserResponse response = userService.getUserInfo(userId);

        // then (검증)
        assertThat(response.getId()).isEqualTo(userId);
        assertThat(response.getName()).isEqualTo("테스터");

        // 책 목록이 잘 들어왔는지 확인
        assertThat(response.getMyBooks()).hasSize(2);
        assertThat(response.getMyBooks().get(0).getTitle()).isEqualTo("책1");
        assertThat(response.getMyBooks().get(1).getTitle()).isEqualTo("책2");
    }

    @Test
    @DisplayName("존재하지 않는 회원 조회 시 예외 발생")
    void getUserInfo_Fail() {
        // given
        Long wrongId = 999L;
        // 찾았는데 데이터가 없다고(Empty) 설정
        given(userRepository.findById(wrongId)).willReturn(Optional.empty());

        // when & then
        // 예외가 터져야 성공!
        assertThatThrownBy(() -> userService.getUserInfo(wrongId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");
    }
}