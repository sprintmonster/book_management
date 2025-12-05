import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Pagination } from '@mui/material';

function MyPage() {
    const [userInfo, setUserInfo] = useState({
        email: 'user@example.com',
        password: '',
        apiKey: '',
    });

    const [posts, setPosts] = useState([
        { id: 1, title: '첫 번째 게시글', date: '2025-12-01' },
        { id: 2, title: '두 번째 게시글', date: '2025-12-02' },
        { id: 3, title: '세 번째 게시글', date: '2025-12-03' },
        { id: 4, title: '네 번째 게시글', date: '2025-12-04' },
        { id: 5, title: '다섯 번째 게시글', date: '2025-12-05' },
    ]);

    const [page, setPage] = useState(1); // 현재 페이지
    const postsPerPage = 3; // 페이지당 글 수

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        console.log('회원정보 저장:', userInfo);
        alert('회원정보가 저장되었습니다 (더미)');
        // 실제: API 호출 후 상태 업데이트
    };

    // 현재 페이지에 표시할 게시글
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box display="flex" sx={{ p: 3, gap: 3 }}>
            {/* 왼쪽: 회원정보 */}
            <Paper elevation={3} sx={{ p: 3, width: 300 }}>
                <Typography variant="h6" mb={2}>
                    회원정보
                </Typography>

                <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    value={userInfo.email}
                    InputProps={{
                        readOnly: true,
                    }}
                    margin="dense"
                    sx={{
                        '& .MuiInputLabel-root': { color: 'black' }, // 라벨 색상
                        '& .MuiInputBase-input': { color: 'black' }, // 입력 텍스트 색상
                    }}
                />

                <TextField
                    fullWidth
                    label="비밀번호"
                    name="password"
                    type="password"
                    value={userInfo.password}
                    onChange={handleChange}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="API Key"
                    name="apiKey"
                    value={userInfo.apiKey}
                    onChange={handleChange}
                    margin="dense"
                    placeholder="선택 입력"
                />

                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
                    저장
                </Button>
            </Paper>

            {/* 오른쪽: 게시글 목록 */}
            <Paper elevation={3} sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" mb={2}>
                    내 게시글
                </Typography>
                <List>
                    {currentPosts.map((post) => (
                        <ListItem key={post.id} button>
                            <ListItemText primary={post.title} secondary={post.date} />
                        </ListItem>
                    ))}
                </List>

                {/* 페이지네이션 */}
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
    );
}

export default MyPage;
