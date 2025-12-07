// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8BC34A', // 연두색
        },
        secondary: {
            main: '#CDDC39',
        },
    },
});

function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            alert('이메일과 비밀번호를 입력하세요.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/v1/users/login', {
                email: form.email,
                password: form.password
            });

            if (response.data.status === 'success') {
                // 성공 시 토큰 저장 (localStorage 예시)
                const { accessToken, refreshToken, userId, name } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userName', name);
                localStorage.setItem('userId', userId);

                alert('로그인 성공!');
                navigate('/MainPage'); // 로그인 성공 시 이동
            }
        } catch (err) {
            const message = err.response?.data?.message || '서버 오류가 발생했습니다.';
            alert(`로그인 실패: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                {/* 상단 로고 */}
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar sx={{ justifyContent: 'center' }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="로고"
                            sx={{ height: 300, ml: -3 }}
                        />
                    </Toolbar>
                </AppBar>

                {/* 로그인 박스 */}
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ height: 'calc(100vh - 500px)' }}
                >
                    <Paper elevation={3} sx={{ padding: 5, width: 450 , height: 400 }}>
                        <Typography variant="h5" textAlign="center" mb={2}>
                            로그인
                        </Typography>

                        <TextField
                            fullWidth
                            label="이메일"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            label="비밀번호"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            margin="dense"
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 4, padding : 2}}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>

                        {/* 하단 버튼 그룹: 회원가입 + 계정/비밀번호 찾기 */}
                        <Box display="flex" justifyContent="space-between" mt={3}>
                            <Button
                                variant="text"
                                onClick={() => navigate('/register')}
                            >
                                회원가입
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => navigate('/find_account')}
                            >
                                계정/비밀번호 찾기
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default LoginPage;
