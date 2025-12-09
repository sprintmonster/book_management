// src/components/Enroll.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, Paper,
    RadioGroup, FormControlLabel, Radio, FormControl, FormLabel,
    Alert, CircularProgress, Card, CardMedia
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, AutoAwesome as AutoAwesomeIcon, Save as SaveIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: { main: "#AED581"},
        secondary: { main: '#CDDC39' },
    },
});

function Enroll() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        coverImageType: 'upload', // 'upload' or 'ai'
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('이미지 크기는 5MB를 초과할 수 없습니다.');
                return;
            }
            setUploadedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt.trim() || !apiKey.trim()) {
            setError('API Key와 프롬프트를 모두 입력해주세요.');
            return;
        }

        setAiGenerating(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    n: 1,
                    size: "512x512",
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || '이미지 생성 실패');
            }

            const data = await response.json();
            setPreviewImage(data.data[0].url);
            setSuccess('AI 표지가 성공적으로 생성되었습니다!');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setAiGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            setError('제목과 내용을 입력해주세요.');
            return;
        }
        if (formData.coverImageType === 'upload' && !uploadedImage) {
            setError('표지 이미지를 업로드해주세요.');
            return;
        }
        if (formData.coverImageType === 'ai' && !previewImage) {
            setError('AI 표지를 생성해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);

            if (formData.coverImageType === 'upload' && uploadedImage) {
                formDataToSend.append('coverImage', uploadedImage);
            } else if (formData.coverImageType === 'ai' && previewImage) {
                formDataToSend.append('aiCoverUrl', previewImage);
            }

            // 실제 백엔드 연동 전 테스트용으로 console.log
            console.log('전송 데이터:', {
                title: formData.title,
                content: formData.content,
                cover: formData.coverImageType === 'ai' ? previewImage : uploadedImage,
            });

            // 백엔드 연동 시 주석 해제
            // const response = await axios.post('/api/books', formDataToSend, {
            //   headers: { 'Content-Type': 'multipart/form-data' }
            // });

            // if (response.data.success) {
            //   setSuccess('도서가 성공적으로 등록되었습니다!');
            //   setTimeout(() => navigate('/books'), 1500);
            // }

            setSuccess('✅ 테스트 완료! (백엔드 미연동 상태)');
        } catch (err) {
            console.error('도서 등록 오류:', err);
            setError(err.message || '도서 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#F3FDE9", minHeight: '100vh', pb: 5 }}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            신규 도서 등록
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="제목"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="내용"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                multiline
                                rows={6}
                            />

                            <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }}>
                                <FormLabel component="legend">표지 이미지 선택 방식</FormLabel>
                                <RadioGroup
                                    row
                                    name="coverImageType"
                                    value={formData.coverImageType}
                                    onChange={handleInputChange}
                                >
                                    <FormControlLabel value="upload" control={<Radio />} label="직접 업로드" />
                                    <FormControlLabel value="ai" control={<Radio />} label="AI 생성" />
                                </RadioGroup>
                            </FormControl>

                            {formData.coverImageType === 'upload' && (
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                    >
                                        이미지 업로드
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </Button>
                                    {uploadedImage && <Typography variant="body2" sx={{ mt: 1 }}>{uploadedImage.name}</Typography>}
                                </Box>
                            )}

                            {formData.coverImageType === 'ai' && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="OpenAI API Key"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="AI 표지 프롬프트"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        margin="normal"
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={aiGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                                        onClick={handleGenerateAI}
                                        disabled={aiGenerating || !aiPrompt.trim() || !apiKey.trim()}
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    >
                                        {aiGenerating ? 'AI 표지 생성 중...' : 'AI 표지 생성'}
                                    </Button>
                                </Box>
                            )}

                            {previewImage && (
                                <Card sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
                                    <CardMedia
                                        component="img"
                                        image={previewImage}
                                        alt="표지 미리보기"
                                        sx={{ height: 300, objectFit: 'cover' }}
                                    />
                                    <Typography variant="caption" sx={{ p: 1, display: 'block', textAlign: 'center' }}>
                                        표지 미리보기
                                    </Typography>
                                </Card>
                            )}

                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading ? '등록 중...' : '도서 등록'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={() => navigate('/MainPage')}
                                    disabled={loading}
                                >
                                    취소
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Enroll;
