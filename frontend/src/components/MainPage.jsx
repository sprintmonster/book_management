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
import axios from 'axios';
import BookCard from '../components/BookCard';

function MainPage() {
    const navigate = useNavigate();

    // API에서 받아온 책 목록
    const [books, setBooks] = useState([]);

    // 검색 입력값 / 실제 검색에 사용하는 값
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // 추천/일반 구분 (임시: bookId가 짝수면 추천이라고 가정)
    const recommendedBooks = books.filter((b) => b.bookid % 2 === 0);
    const normalBooks = books.filter((b) => b.bookid % 2 !== 0);

    // 로그아웃 + 로그인 페이지 이동
    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (e) {
            console.error('로그아웃 실패:', e);
        } finally {
            navigate('/login');
        }
    };

    // 검색 입력 변경
    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 검색 버튼 클릭 또는 엔터
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setSearchTerm(searchKeyword.trim()); // 지금은 API에 안 쓰지만 상태만 분리
    };

    // 도서 목록 조회: /api/v1/books/search (GET, 입력데이터 없음)
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/books');
                const data = response.data;
                // 단일 객체 -> 배열로 변환
                const list = Array.isArray(data) ? data : [data];
                setBooks(list);
            } catch (err) {
                console.error('도서 목록 조회 실패:', err);
                setBooks([]);
            }
        };

        fetchBooks();
    }, [searchTerm]);

    const handleNewBook = () => {
        navigate('/enroll'); // 글 생성 화면으로 이동
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f2f2f2' }}>
            {/* 상단 AppBar */}
            <AppBar
                position="static"
                elevation={0}
                sx={{ bgcolor: '#D9D9D9', color: 'black' }}
            >
                <Toolbar sx={{ px: 2 }}>
                    {/* 좌측: 화살표(로그아웃 + 로그인 페이지 이동) */}
                    <IconButton edge="start" sx={{ mr: 2 }} onClick={handleLogout}>
                        <ArrowBackIcon />
                    </IconButton>

                    {/* 중앙: 검색창 + 검색 버튼 */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            justifyContent: 'center',
                        }}
                        component="form"
                        onSubmit={handleSearchSubmit}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                width: '100%',
                                maxWidth: 960,
                            }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="검색어를 입력하세요"
                                value={searchKeyword}
                                onChange={handleSearchInputChange}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 0,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#e0e0e0',
                                    },
                                }}
                            />
                            <IconButton
                                type="submit"
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
                    </Box>

                    {/* 우측: 마이페이지 버튼 */}
                    <Button
                        variant="contained"
                        onClick={() => navigate('/my_page')}
                        sx={{
                            ml: 2,
                            bgcolor: '#A1C50A',
                            color: 'white',
                            borderRadius: 0,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#5a6f04' },
                        }}
                    >
                        마이페이지
                    </Button>
                </Toolbar>
            </AppBar>

            {/* 본문 영역 */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                {/* AppBar 밖 우측 상단 +신규 버튼 */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleNewBook}
                        sx={{
                            bgcolor: '#A1C50A',
                            color: 'white',
                            borderRadius: 0,
                            px: 3,
                            '&:hover': { bgcolor: '#5a6f04' },
                        }}
                    >
                        +신규
                    </Button>
                </Box>

                {/* 추천책 섹션 */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    추천책
                </Typography>
                <Paper sx={{ bgcolor: '#D9D9D9', p: 3, mb: 4 }} elevation={0}>
                    {recommendedBooks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            추천책이 없습니다.
                        </Typography>
                    ) : (
                        recommendedBooks.map((book) => (
                            <Box key={book.bookid} sx={{ mb: 2 }}>
                                <BookCard
                                    id={book.bookid}             // ← id 전달
                                    title={book.title}
                                    content={book.content}
                                    imageUrl={book.imageUrl}
                                    views={book.views}
                                />
                            </Box>
                        ))
                    )}
                </Paper>

                {/* 게시글 섹션 */}
                <Typography variant="h5" sx={{ mb: 2 }}>
                    게시글
                </Typography>
                <Paper sx={{ bgcolor: '#D9D9D9', p: 3 }} elevation={0}>
                    {normalBooks.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            게시글이 없습니다.
                        </Typography>
                    ) : (
                        normalBooks.map((book) => (
                            <Box key={book.bookid} sx={{ mb: 2 }}>
                                <BookCard
                                    id={book.bookid}             // ← id 전달
                                    title={book.title}
                                    content={book.content}
                                    imageUrl={book.imageUrl}
                                    views={book.views}
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
