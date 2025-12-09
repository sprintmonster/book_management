// src/components/revision.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
    Alert,
    CircularProgress,
    Card,
    CardMedia,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    AutoAwesome as AutoAwesomeIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#AED581' },
        secondary: { main: '#CDDC39' },
    },
});

function Revision() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        coverImageType: 'existing', // 'existing', 'upload', 'ai'
    });

    const [existingImage, setExistingImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [aiImageConfirmed, setAiImageConfirmed] = useState(false); // AI 이미지 사용 여부

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 기존 도서 정보 조회
    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        setFetchLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/books/${id}`);

            if (response.data.success && response.data.data) {
                const book = response.data.data;
                setFormData({
                    title: book.title || '',
                    content: book.content || '',
                    coverImageType: 'existing',
                });
                setExistingImage(book.coverImageUrl || null);
                setPreviewImage(book.coverImageUrl || null);
            }
        } catch (err) {
            console.error('도서 정보 조회 오류:', err);
            setError(
                err.response?.data?.message ||
                    '도서 정보를 불러오는 중 오류가 발생했습니다.',
            );
        } finally {
            setFetchLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'coverImageType') {
            // 표지 방식이 바뀔 때 상태 초기화
            setError('');
            setSuccess('');
            setAiPrompt('');
            setAiImageConfirmed(false);

            if (value === 'existing') {
                setPreviewImage(existingImage);
                setUploadedImage(null);
            } else if (value === 'upload') {
                setPreviewImage(null);
                setUploadedImage(null);
            } else if (value === 'ai') {
                setPreviewImage(null);
                setUploadedImage(null);
            }
        }
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
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
            setAiImageConfirmed(false);
        }
    };

    // 테스트용 AI 표지 생성
    const handleGenerateAI = async () => {
        if (!aiPrompt.trim()) {
            setError('AI 표지 생성을 위한 프롬프트를 입력해주세요.');
            return;
        }

        setAiGenerating(true);
        setError('');
        setSuccess('');
        setAiImageConfirmed(false);

        try {
            // 실제 OpenAI 대신, 랜덤 이미지 URL 사용
            await new Promise((resolve) => setTimeout(resolve, 800));
            const fakeUrl = `https://picsum.photos/512/512?random=${Date.now()}`;

            setPreviewImage(fakeUrl);
            setSuccess('🔍 (테스트용) AI 표지가 생성된 것처럼 동작합니다.');
        } catch (err) {
            console.error('AI 표지 생성 오류(테스트):', err);
            setError('테스트용 AI 표지 생성 중 오류가 발생했습니다.');
        } finally {
            setAiGenerating(false);
        }
    };

    // AI 이미지 사용 확정
    const handleConfirmAiImage = () => {
        if (!previewImage) {
            setError('먼저 AI 표지를 생성해주세요.');
            return;
        }
        setAiImageConfirmed(true);
        setError('');
        setSuccess('이 AI 이미지를 표지로 사용합니다. 도서 수정을 진행해주세요.');
    };

    // 같은 프롬프트로 이미지 재생성
    const handleRegenerateAiImage = async () => {
        setAiImageConfirmed(false);
        setSuccess('');
        setError('');
        await handleGenerateAI();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }

        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
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
                // 새 파일 업로드
                formDataToSend.append('coverImage', uploadedImage);
            } else if (formData.coverImageType === 'ai' && previewImage) {
                // AI 이미지 URL → coverImageUrl로 보내기 (Enroll이랑 통일)
                formDataToSend.append('coverImageUrl', previewImage);
            }
            // coverImageType === 'existing' 이면 이미지 필드 안 보냄 → 서버가 기존 이미지 유지

            const response = await axios.put(`/api/books/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setSuccess('도서가 성공적으로 수정되었습니다!');
                setTimeout(() => {
                    // 상세 페이지 라우트에 맞게 이동
                    navigate(`/infoPage/${id}`);
                }, 1500);
            }
        } catch (err) {
            console.error('도서 수정 오류:', err);
            setError(
                err.response?.data?.message ||
                '도서 수정 중 오류가 발생했습니다.'
            );
        } finally {
            setLoading(false);
        }
    };


    if (fetchLoading) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 4, display: 'flex', justifyContent: 'center' }}
            >
                <CircularProgress />
            </Container>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: '#F3FDE9', minHeight: '100vh', pb: 5 }}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            align="center"
                        >
                            도서 수정
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                                onClose={() => setError('')}
                            >
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert
                                severity="success"
                                sx={{ mb: 2 }}
                                onClose={() => setSuccess('')}
                            >
                                {success}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}
                        >
                            <TextField
                                fullWidth
                                label="제목"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                                placeholder="도서 제목을 입력하세요"
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
                                placeholder="도서 내용을 입력하세요"
                            />

                            <FormControl
                                component="fieldset"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                <FormLabel component="legend">
                                    표지 이미지 선택 방식
                                </FormLabel>
                                <RadioGroup
                                    row
                                    name="coverImageType"
                                    value={formData.coverImageType}
                                    onChange={handleInputChange}
                                >
                                    <FormControlLabel
                                        value="existing"
                                        control={<Radio />}
                                        label="기존 이미지 유지"
                                    />
                                    <FormControlLabel
                                        value="upload"
                                        control={<Radio />}
                                        label="새로 업로드"
                                    />
                                    <FormControlLabel
                                        value="ai"
                                        control={<Radio />}
                                        label="AI 생성"
                                    />
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
                                    {uploadedImage && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 1,
                                                color: 'text.secondary',
                                            }}
                                        >
                                            선택된 파일: {uploadedImage.name}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {formData.coverImageType === 'ai' && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="AI 표지 생성 프롬프트"
                                        value={aiPrompt}
                                        onChange={(e) =>
                                            setAiPrompt(e.target.value)
                                        }
                                        placeholder="예: 신비로운 숲 속의 오래된 도서관"
                                        margin="normal"
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            aiGenerating ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <AutoAwesomeIcon />
                                            )
                                        }
                                        onClick={handleGenerateAI}
                                        disabled={
                                            aiGenerating || !aiPrompt.trim()
                                        }
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    >
                                        {aiGenerating
                                            ? 'AI 표지 생성 중...'
                                            : 'AI 표지 생성'}
                                    </Button>
                                </Box>
                            )}

                            {previewImage && (
                                <Card
                                    sx={{
                                        mt: 3,
                                        maxWidth: 400,
                                        mx: 'auto',
                                        p: 1,
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={previewImage}
                                        alt="표지 미리보기"
                                        sx={{
                                            height: 300,
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            p: 1,
                                            display: 'block',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {formData.coverImageType ===
                                        'existing'
                                            ? '현재 표지'
                                            : '표지 미리보기'}
                                    </Typography>

                                    {formData.coverImageType === 'ai' && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                mt: 1,
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                onClick={handleConfirmAiImage}
                                            >
                                                이 이미지 사용하기
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                fullWidth
                                                onClick={
                                                    handleRegenerateAiImage
                                                }
                                            >
                                                이미지 재생성
                                            </Button>
                                        </Box>
                                    )}
                                </Card>
                            )}

                            <Box
                                sx={{
                                    mt: 4,
                                    display: 'flex',
                                    gap: 2,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <SaveIcon />
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {loading ? '수정 중...' : '도서 수정'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={() =>
                                        navigate(`/infoPage/${id}`)
                                    }
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
export default Revision;