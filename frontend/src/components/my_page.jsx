// src/components/MyPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper,
    List, ListItem, ListItemText, Pagination,
    AppBar, Toolbar, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: { main: "#AED581"},
        secondary: { main: '#CDDC39' },
    },
});

function MyPage() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        userId: '',
        name: '',
        email: '',
        password: '',
        role: 0,
        apiKey: '',
    });

    const [posts, setPosts] = useState([
        { id: 1, title: '첫 번째 게시글', date: '2025-12-01' },
        { id: 2, title: '두 번째 게시글', date: '2025-12-02' },
        { id: 3, title: '세 번째 게시글', date: '2025-12-03' },
        { id: 4, title: '네 번째 게시글', date: '2025-12-04' },
        { id: 5, title: '다섯 번째 게시글', date: '2025-12-05' },
    ]);

    const [page, setPage] = useState(1);
    const postsPerPage = 5;

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        // 여기서는 더미 알림
        alert('회원정보가 저장되었습니다 (더미)');
    };

    const handleDelete = (id) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            setPosts(posts.filter(post => post.id !== id));
            alert("삭제되었습니다.");
        }
    };

    const handlePageChange = (event, value) => setPage(value);

    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // -------------------------
    // API 호출: 사용자 정보 조회
    // -------------------------
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = localStorage.getItem('userId'); // 로그인 시 저장된 ID 사용
                if (!userId) return;

                const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
                if (response.data.status === 'success') {
                    const data = response.data.data;
                    setUserInfo(prev => ({
                        ...prev,
                        userId: data.userId,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        apiKey: data.api_key || '',
                    }));
                }
            } catch (err) {
                alert(err.response?.data?.message || '사용자 정보를 불러오지 못했습니다.');
            }
        };

        fetchUserInfo();
    }, []);
    // useEffect(() => {
    //     // 🔥 테스트를 위해 더미 데이터로 값 넣기
    //     setUserInfo({
    //         userId: "1",
    //         name: "홍길동",
    //         email: "test123@example.com",
    //         password: "",   // 빈칸 가능
    //         role: 0,
    //         apiKey: "ABC-123-DEF"
    //     });
    // }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#F3FDE9", minHeight: '100vh', pb: 5 }}>

            <AppBar position="static" color="transparent" elevation={0}
                    sx={{
                        bgcolor: '#D8E8B0',   // ⬅ 색상 변경 (구분감 있는 연녹 톤)
                        color: 'black',
                        height: '90px',       // ⬅ 상단바 높이 증가
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => navigate('/MainPage')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 1 }}>마이페이지</Typography>
                    </Toolbar>
                </AppBar>

                <Box display="flex" sx={{ p: 3, gap: 3, mt: 10,minHeight: '70vh'}}>
                    {/* 왼쪽: 회원정보 */}
                    <Paper elevation={3} sx={{ p: 4, width: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography variant="h6" mb={2}>회원정보</Typography>

                        {/* 이름 */}
                        <TextField
                            fullWidth
                            label="이름"
                            name="name"
                            value={userInfo.name}
                            margin="dense"
                            InputProps={{
                                readOnly: true,
                                style: { color: "black" }
                            }}
                        />

                        {/* 이메일 */}
                        <TextField
                            fullWidth
                            label="이메일"
                            name="email"
                            value={userInfo.email}
                            margin="dense"
                            InputProps={{
                                readOnly: true,
                                style: { color: "black" }
                            }}
                        />

                        {/* 비밀번호 */}
                        <TextField
                            fullWidth
                            label="비밀번호"
                            name="password"
                            type="password"
                            value={userInfo.password}
                            onChange={handleChange}
                            margin="dense"
                        />

                        {/* API Key */}
                        <TextField
                            fullWidth
                            label="API Key"
                            name="apiKey"
                            value={userInfo.apiKey}
                            onChange={handleChange}
                            margin="dense"
                            placeholder="선택 입력"
                        />

                        <Button variant="contained" fullWidth sx={{
                            mt: 2,
                            padding: 1,
                            backgroundColor:"#AED581",   // 로그인 박스보다 진한 연두
                            color: "#1A1A1A",             // 글씨 선명하게
                            '&:hover': {
                                backgroundColor:  "#C5E1A5", // hover 시 조금 더 진하게
                            }
                        }} onClick={handleSave}>
                            저장
                        </Button>
                    </Paper>


                    {/* 오른쪽: 게시글 목록 */}
                    <Paper elevation={3} sx={{ flex: 1, p: 5, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>                        <Typography variant="h6" mb={2}>내 게시글</Typography>
                        <List>
                            {currentPosts.map(post => (
                                <ListItem key={post.id} secondaryAction={
                                    <>
                                        <Button
                                            size="small"
                                            onClick={() => navigate(`/revision/${post.id}`, { state: post })}
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            삭제
                                        </Button>
                                    </>
                                }>
                                    <ListItemText primary={post.title} secondary={post.date} />
                                </ListItem>
                            ))}
                        </List>

                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination
                                count={Math.ceil(posts.length / postsPerPage)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MyPage;
