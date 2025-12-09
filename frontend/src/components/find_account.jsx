// src/pages/FindAccount.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

    const [tabIndex, setTabIndex] = useState(0); // 0: 계정 찾기, 1: 비밀번호 찾기
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setResult(null);
        setError('');
        setName('');
        setEmail('');
    };

    // 계정(이메일) 찾기
    const handleFindAccount = async () => {
        if (!name) {
            setError("이름을 입력하세요.");
            return;
        }
        try {
            const response = await axios.get("/api/users/modify", { params: { name } });

            if (response.data.status === 'success') {
                setResult({ type: "account", email: response.data.data.email });
                setError("");
            } else {
                setError(response.data.message || "이메일을 찾을 수 없습니다.");
                setResult(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "이메일을 찾을 수 없습니다.");
            setResult(null);
        }
    };

    // 비밀번호 찾기
    const handleFindPassword = async () => {
        if (!name || !email) {
            setError("이름과 이메일을 모두 입력하세요.");
            return;
        }
        try {
            const response = await axios.get("/api/users/modify", { params: { name, email } });

            if (response.data.status === 'success') {
                setResult({ type: "password", password: response.data.data.password });
                setError("");
            } else {
                setError(response.data.message || "비밀번호를 찾을 수 없습니다.");
                setResult(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "비밀번호를 찾을 수 없습니다.");
            setResult(null);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                {/* 상단 로고 */}
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
                            backgroundColor: "#F3FDE8",   // 파스텔 연두 (로그인 박스)
                            color: "#1A1A1A",              // 글씨 선명하게 (짙은 회색 계열)
                            fontWeight: 500                // 텍스트 가독성 강화
                        }}
                    >                        <Typography variant="h5" textAlign="center" mb={2}>
                            계정/비밀번호 찾기
                        </Typography>

                        {/* 탭 */}
                        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                            <Tab label="계정 찾기" />
                            <Tab label="비밀번호 찾기" />
                        </Tabs>

                        {/* 이름 입력 */}
                        <TextField
                            fullWidth
                            label="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="dense"
                            sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 1,
                                mb: 2, // 아래 여백
                            }}
                        />

                        {/* 비밀번호 찾기 탭에서만 이메일 입력 필요 */}
                        {tabIndex === 1 && (
                            <TextField
                                fullWidth
                                label="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="dense"
                                sx={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 1,
                                    mb: 2, // 아래 여백
                                }}
                            />
                        )}

                        {/* 버튼 */}
                        {tabIndex === 0 ? (
                            <Button variant="contained" fullWidth sx={{
                                mt: 2,
                                padding: 1,
                                backgroundColor:"#AED581",   // 로그인 박스보다 진한 연두
                                color: "#1A1A1A",             // 글씨 선명하게
                                '&:hover': {
                                    backgroundColor:  "#C5E1A5", // hover 시 조금 더 진하게
                                }
                            }} onClick={handleFindAccount}>
                                계정(이메일) 찾기
                            </Button>
                        ) : (
                            <Button variant="contained" fullWidth sx={{
                                mt: 2,
                                padding: 1,
                                backgroundColor:"#AED581",   // 로그인 박스보다 진한 연두
                                color: "#1A1A1A",             // 글씨 선명하게
                                '&:hover': {
                                backgroundColor:  "#C5E1A5", // hover 시 조금 더 진하게
                            }
                            }} onClick={handleFindPassword}>
                                비밀번호 찾기
                            </Button>
                        )}

                        {/* 결과 출력 */}
                        {result?.type === "account" && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                가입된 이메일: <strong>{result.email}</strong>
                            </Alert>
                        )}

                        {result?.type === "password" && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                비밀번호: <strong>{result.password}</strong>
                            </Alert>
                        )}

                        {/* 에러 출력 */}
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
