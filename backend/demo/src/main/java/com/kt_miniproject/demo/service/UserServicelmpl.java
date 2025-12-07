package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.book.BookCreateRequest;
import com.kt_miniproject.demo.dto.book.BookResponse;
import com.kt_miniproject.demo.dto.user.UserCreateRequest;
import com.kt_miniproject.demo.dto.user.UserResponse;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service               // 서비스 빈 등록
@RequiredArgsConstructor
@Transactional
@Builder
public class UserServicelmpl implements UserService {
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public UserResponse createUser(UserCreateRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole())
                .apiKey(request.getApiKey())
                .build();
        User savedUser = userRepository.save(user); // 2. DB에 저장 필수!

        // 3. 결과 반환 (UserResponse에 생성자가 있다고 가정)
        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .build();
    }
    public UserResponse getUserInfo(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Book> books = bookRepository.findByUserId(id);

        List<BookResponse> bookResponses = books.stream()
                .map(b -> BookResponse.builder()
                        .id(b.getId())
                        .title(b.getTitle())
                        .content(b.getContent())
                        .coverImageUrl(b.getCoverImageUrl())
                        .build())
                .collect(Collectors.toList()); // 리스트로 변환 마무리

        // UserResponse에 내 정보와 책 목록을 담아서 반환
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .myBooks(bookResponses) // List<BookResponse> 필드 반환
                .build();
    }
}
