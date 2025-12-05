import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
        apiKey: '', // 선택사항
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = () => {
        console.log('회원가입 요청 데이터:', form);

        if (!form.email || !form.password) {
            alert('이메일과 비밀번호를 입력하세요.');
            return;
        }

        alert('회원가입 성공 (더미)');
        // 회원가입 후 로그인 페이지로 이동
        navigate('/login');
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 4, width: 380 }}>
                <Typography variant="h5" textAlign="center" mb={2}>
                    회원가입
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
                <TextField
                    fullWidth
                    label="API Key (선택)"
                    name="apiKey"
                    value={form.apiKey}
                    onChange={handleChange}
                    margin="dense"
                />

                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
                    회원가입
                </Button>

                <Button
                    variant="text"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/login')}
                >
                    로그인으로 돌아가기
                </Button>
            </Paper>
        </Box>
    );
}

export default RegisterPage;
