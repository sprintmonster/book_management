// src/pages/FindAccount.jsx
import React, { useState } from 'react';
import {Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab, AppBar, Toolbar} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/logo.png";

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
function FindAccount() {
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(0); // 0: 계정 찾기, 1: 비밀번호 찾기
    const [inputEmail, setInputEmail] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setResult(null);
        setError('');
        setInputEmail('');
    };

    const handleChange = (e) => setInputEmail(e.target.value);

    // 공통 API 호출
    const searchUser = async () => {
        if (!inputEmail) {
            setError('이메일을 입력하세요.');
            setResult(null);
            return null;
        }
        try {
            const response = await axios.get(`/api/v1/users/modify/${inputEmail}`);
            if (response.data.status === 'success') {
                setError('');
                return response.data.data;
            }
        } catch (err) {
            setError(err.response?.data?.message || '오류가 발생했습니다.');
            setResult(null);
            return null;
        }
    };

    // 계정 찾기
    const handleFindAccount = async () => {
        const data = await searchUser();
        if (data) {
            setResult({ type: 'account', data });
        }
    };

    // 비밀번호 찾기
    const handleFindPassword = async () => {
        const data = await searchUser();
        if (data) {
            setResult({ type: 'password', data });
            // 실제 앱에서는 여기서 비밀번호 재설정 페이지로 이동
            navigate(`/reset-password/${data.userId}`);
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
                            sx={{ height: 300, ml: -2 }}
                        />
                    </Toolbar>
                </AppBar>
                <Box display="flex"
                     justifyContent="center"
                     alignItems="flex-start"
                     sx={{ minHeight: '100vh', mt: 5 }}>
                    <Paper elevation={3} sx={{ p: 4, width: 450, mt: 3 }}>
                <Typography variant="h5" textAlign="center" mb={2}>
                    계정/비밀번호 찾기
                </Typography>

                {/* 탭 */}
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    <Tab label="계정 찾기" />
                    <Tab label="비밀번호 찾기" />
                </Tabs>

                {/* 이메일 입력 */}
                <TextField
                    fullWidth
                    label="이메일 입력"
                    value={inputEmail}
                    onChange={handleChange}
                    margin="dense"
                    sx={{ mt: 2 }}
                />

                {/* 탭별 버튼 */}
                {tabIndex === 0 && (
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleFindAccount}>
                        계정 찾기
                    </Button>
                )}
                {tabIndex === 1 && (
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleFindPassword}>
                        비밀번호 찾기
                    </Button>
                )}

                {/* 결과 출력 */}
                {result && result.type === 'account' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        검색 성공! 이메일: {result.data.email}
                    </Alert>
                )}

                {result && result.type === 'password' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        비밀번호 재설정 페이지로 이동합니다.
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="text"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/login')}
                >
                    로그인으로 돌아가기
                </Button>
            </Paper>
        </Box>
            </Box>
        </ThemeProvider>
    );
}

export default FindAccount;
