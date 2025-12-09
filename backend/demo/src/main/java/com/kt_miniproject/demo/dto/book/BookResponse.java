package com.kt_miniproject.demo.dto.book;

import com.kt_miniproject.demo.domain.book.Book;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {

    private Long id;
    private String title;
    private String content;
    private String coverImageUrl;


    //  Book 엔티티를 받아서 응답 DTO로 변환하는 생성자
    public BookResponse(Book book) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.content = book.getContent();
        this.coverImageUrl = book.getCoverImageUrl();

    }
}
