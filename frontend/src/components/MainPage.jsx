import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Box,
    Container,
    Paper,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
// import bookService from '../services/bookService';   // 가정
// import BookCard from '../components/BookCard';       // 가정

function MainPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 예: 서버에서 isRecommended 필드로 구분된다고 가정
    const recommendedBooks = books.filter((b) => b.isRecommended);
    const normalBooks = books.filter((b) => !b.isRecommended);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await bookService.fetchBooks(searchTerm);
                setBooks(data);
            } catch (err) {
                console.error('도서 목록 조회 실패:', err);
            }
        };
        fetchData();
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleNewBook = () => {
        navigate('/books/create'); // BookCreatePage.jsx 화면으로 이동[file:1]
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f2f2f2' }}>
            {/* 상단 회색 막대(AppBar 역할) */}
            <AppBar
                position="static"
                elevation={0}
                sx={{ bgcolor: '#D9D9D9', color: 'black' }}
            >
                <Toolbar sx={{ px: 2 }}>
                    {/* 좌측: 뒤로/로그아웃 아이콘 영역 (와이어프레임의 왼쪽 아이콘) */}
                    <IconButton edge="start" sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>

                    {/* 중앙: 검색창 + 아이콘 버튼 */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="검색어를 입력하세요"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 0,
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                            }}
                        />
                        <IconButton
                            sx={{
                                bgcolor: '#000',
                                color: '#fff',
                                borderRadius: 0,
                                '&:hover': { bgcolor: '#333' },
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    {/* 우측: +신규 버튼 (노란 박스) */}
                    <Button
                        variant="contained"
                        onClick={handleNewBook}
                        sx={{
                            ml: 2,
                            bgcolor: '#FFD900',
                            color: 'black',
                            borderRadius: 0,
                            px: 3,
                            '&:hover': { bgcolor: '#e6c800' },
                        }}
                    >
                        +신규
                    </Button>
                </Toolbar>
            </AppBar>

            {/* 본문 영역 */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                {/* 추천책 섹션 */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    추천책
                </Typography>
                <Paper
                    sx={{
                        bgcolor: '#D9D9D9',
                        p: 3,
                        mb: 4,
                    }}
                    elevation={0}
                >
                    {recommendedBooks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            추천책이 없습니다.
                        </Typography>
                    ) : (
                        recommendedBooks.map((book) => (
                            <Box key={book.id} sx={{ mb: 2 }}>
                                <BookCard
                                    // “게시글” 와이어프레임 구조에 맞게 BookCard에서
                                    // 이미지(왼쪽), 제목/조회수/내용(오른쪽)을 배치하도록 구현
                                    title={book.title}
                                    content={book.content}
                                    imageUrl={book.coverImageUrl || book.aiCoverUrl}
                                    views={book.viewCount}
                                    book={book}
                                />
                            </Box>
                        ))
                    )}
                </Paper>

                {/* 게시글 섹션 */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    게시글
                </Typography>
                <Paper
                    sx={{
                        bgcolor: '#D9D9D9',
                        p: 3,
                    }}
                    elevation={0}
                >
                    {normalBooks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            게시글이 없습니다.
                        </Typography>
                    ) : (
                        normalBooks.map((book) => (
                            <Box key={book.id} sx={{ mb: 2 }}>
                                <BookCard
                                    title={book.title}
                                    content={book.content}
                                    imageUrl={book.coverImageUrl || book.aiCoverUrl}
                                    views={book.viewCount}
                                    book={book}
                                />
                            </Box>
                        ))
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default MainPage;
