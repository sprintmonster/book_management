// src/pages/FindAccount.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom'; // URL 쿼리 사용
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/logo.png";

const theme = createTheme({
    palette: {
        primary: { main: '#8BC34A' },
        secondary: { main: '#CDDC39' },
    },
});

function FindAccount() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // URL 쿼리 연동
    const initialTab = searchParams.get('tab') === 'password' ? 1 : 0; // URL에서 초기 탭 값 결정
    const [tabIndex, setTabIndex] = useState(initialTab); // 0: 계정 찾기, 1: 비밀번호 찾기
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // 탭 변경 시 상태와 URL 쿼리 연동
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setResult(null);
        setError('');
        setName('');
        setEmail('');
        setSearchParams({ tab: newValue === 0 ? 'account' : 'password' }); // URL에 반영
    };

    // ----- 계정 찾기 API 호출 -----
    const handleFindAccount = async () => {
        if (!name.trim()) {
            setError("이름을 입력하세요.");
            return;
        }
        try {
            const response = await axios.get("/api/users/modify/find_email", { params: { name } });
            if (response.status === 200) {
                // 백엔드 반환: "찾으시는 이메일: [a@a.com]"
                setResult({ type: "account", message: response.data });
                setError('');
            } else {
                setError("이메일을 찾을 수 없습니다.");
                setResult(null);
            }
        } catch (err) {
            setError(err.response?.data || "이메일을 찾을 수 없습니다.");
            setResult(null);
        }
    };

    // ----- 비밀번호 찾기 API 호출 -----
    const handleFindPassword = async () => {
        if (!name.trim() || !email.trim()) {
            setError("이름과 이메일을 모두 입력하세요.");
            return;
        }
        try {
            const response = await axios.get("/api/users/modify/find_password", { params: { name, email } });
            if (response.status === 200) {
                // 백엔드 반환: "비밀번호는: 1234"
                setResult({ type: "password", message: response.data });
                setError('');
            } else {
                setError("비밀번호를 찾을 수 없습니다.");
                setResult(null);
            }
        } catch (err) {
            setError(err.response?.data || "비밀번호를 찾을 수 없습니다.");
            setResult(null);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar sx={{ justifyContent: 'center' }}>
                        <Box component="img" src={logo} alt="로고" sx={{ height: 300, ml: -2 }} />
                    </Toolbar>
                </AppBar>

                <Box display="flex" justifyContent="center" alignItems="flex-start" sx={{ minHeight: '100vh', mt: 5 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 5,
                            width: 450,
                            height: 450,
                            backgroundColor: "#F3FDE8",
                            color: "#1A1A1A",
                            fontWeight: 500
                        }}
                    >
                        <Typography variant="h5" textAlign="center" mb={2}>
                            계정/비밀번호 찾기
                        </Typography>

                        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                            <Tab label="계정 찾기" />
                            <Tab label="비밀번호 찾기" />
                        </Tabs>

                        <TextField
                            fullWidth
                            label="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="dense"
                            sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, mb: 2 }}
                        />

                        {tabIndex === 1 && (
                            <TextField
                                fullWidth
                                label="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="dense"
                                sx={{ backgroundColor: "#FFFFFF", borderRadius: 1, mb: 2 }}
                            />
                        )}

                        {tabIndex === 0 ? (
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, padding: 1, backgroundColor:"#AED581", color: "#1A1A1A",
                                    '&:hover': { backgroundColor:  "#C5E1A5" } }}
                                onClick={handleFindAccount}
                            >
                                계정(이메일) 찾기
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, padding: 1, backgroundColor:"#AED581", color: "#1A1A1A",
                                    '&:hover': { backgroundColor:  "#C5E1A5" } }}
                                onClick={handleFindPassword}
                            >
                                비밀번호 찾기
                            </Button>
                        )}

                        {result && (
                            <Alert severity={result.type === "account" ? "success" : "info"} sx={{ mt: 2 }}>
                                {result.message}
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button variant="text" fullWidth sx={{ mt: 2,color: "#888888" }} onClick={() => navigate('/login')}>
                            로그인으로 돌아가기
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default FindAccount;
