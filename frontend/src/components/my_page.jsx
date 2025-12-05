import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

function MyPage() {
    // 예시 회원 정보 (실제는 API 호출)
    const [userInfo, setUserInfo] = useState({
        email: 'user@example.com',
        password: '',
        apiKey: '',
    });

    // 예시 게시글 목록 (실제는 API 호출)
    const [posts, setPosts] = useState([
        { id: 1, title: '첫 번째 게시글', date: '2025-12-01' },
        { id: 2, title: '두 번째 게시글', date: '2025-12-02' },
        { id: 3, title: '세 번째 게시글', date: '2025-12-03' },
    ]);

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
                    disabled
                    margin="dense"
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
                    {posts.map((post) => (
                        <ListItem key={post.id} button>
                            <ListItemText primary={post.title} secondary={post.date} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}

export default MyPage;
