// src/components/BookCard.jsx
import React from 'react';
import { Card, CardMedia, Box, Typography } from '@mui/material';

function BookCard({
                      imageUrl,
                      title,
                      views,
                      content,
                  }) {
    // 가짜 데이터(임시) 기본값
    const displayTitle = title || '글 제목';
    const displayViews = views ?? 0;
    const displayContent =
        content ||
        '대충 작성 글 AI로 요약한 것을 넣었다는 내용 대충 작성 글 AI로 요약한 것을 넣었다는 내용 대충 작성 글 AI로 요약한 것을 넣었다는 내용.';

    const displayImage =
        imageUrl ||
        'https://via.placeholder.com/160x160?text=%EC%9D%B4%EB%AF%B8%EC%A7%80';

    return (
        <Card sx={{ display: 'flex', p: 3, boxShadow: 'none', bgcolor: '#fff' }}>
            {/* 왼쪽: 이미지 영역 */}
            <Box sx={{ mr: 4, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardMedia
                    component="img"
                    image={displayImage}
                    alt={displayTitle}
                    sx={{
                        width: 160,
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 0,
                    }}
                />
            </Box>

            {/* 오른쪽: 제목 / 조회수 / 내용 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* 제목 + 조회수 줄 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {displayTitle}
                    </Typography>
                    <Typography variant="body2">조회수 : {displayViews}</Typography>
                </Box>

                {/* 내용 */}
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {displayContent}
                </Typography>
            </Box>
        </Card>
    );
}

export default BookCard;