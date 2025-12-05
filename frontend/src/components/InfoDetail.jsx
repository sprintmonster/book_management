import React,{ useState } from "react";
import { Box, Typography,Divider} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoComment from "./InfoComment";


export default function InfoDetail() {
    const [likeCount, setLikeCount] = useState(1);
    return (
        <Box sx={{ p: 3, maxWidth: 1000, margin: "0 auto" }}>
            <Box sx={{display:"flex"}}>

                {/* 왼쪽 이미지 */}
                <Box sx={{flexShrink:0 ,width: "250px", mr:3}}>
                    <img
                        src="https://images.novelpia.com/imagebox/cover/4aa930de841254b65ebf07d54caf2d0f_372751_ori.file"
                        style={{ width: "100%", borderRadius: 4 }}
                        alt="이미지 불러오기에 실패했습니다"
                    />
                </Box>

                {/* 오른쪽 정보 영역 */}
                <Box sx={{ flex: 1, maxWidth:"700px" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        소설 제목 예시
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        작가명 홍길동
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        추천수 123
                    </Typography>

                    <Typography variant="body1" sx={{bgcolor: "grey.200",p: 1,
                        borderRadius: 1, lineHeight: 1.7,width: "100%", ml:-1,       // ⭐ 텍스트가 박스를 벗어나지 못하게 함
                            wordBreak: "break-all",whiteSpace: "pre-line"}}>
                        {`소설의 간단한 소개 또는 줄거리 텍스트를 입력하는 영역입니다.1111111111111111111111111111111111111111
                        111111111111111111111111111111111111111111111111111
                        11111111111111111111111111111111111111
                        11111111111111111111111111111
                        11111111111111111111111111111
                        1111111111111111111`}

                    </Typography>
                </Box>



            </Box>
            <Divider sx={{ my: 3, borderColor: "grey.400" }} />
            {/* 하단: 본문 내용 */}
            <Box sx={{ mt: 4,
                wordBreak: "break-all",whiteSpace: "pre-line"}}>  {/* 위쪽 여백 */}

                <Typography sx={{fontSize: "1.1rem",lineHeight: 1.7 }}>
                    {`내111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    용
                    입
                    니
                    다`}

                </Typography>
            </Box>

            {/*추천 영역*/}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2}}>
                <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => setLikeCount(prev => prev + 1)}
                >
                    <ThumbUpIcon color="primary" />
                    <Typography sx={{ ml: 0.5 }}>추천 {likeCount}</Typography>
                </Box>

                <Box
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => setLikeCount(prev => prev - 1)}
                >
                    <ThumbDownIcon color="error" />
                </Box>
            </Box>
            <Divider sx={{ my: 3, borderColor: "grey.400" }} />
            {/* 댓글 영역 */}
            <InfoComment />

        </Box>
    );
}