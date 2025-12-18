import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CloseIcon from "@mui/icons-material/Close";

export default function InfoComment({ bookId, comments: initialComments }) {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");

    // localStorage에서 정보 가져오기
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    /* -------------------- 댓글 추가 -------------------- */
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert("댓글 내용을 입력해야 합니다.");
            return;
        }

        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/books/${bookId}/comments`, {
                method: "POST",
                headers: {
                    // Authorization: `Bearer ${token}`, // 토큰 필요시 사용
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: Number(userId),
                    content: newComment,
                }),
            });

            if (!response.ok) {
                alert("댓글 작성 실패");
                return;
            }

            const data = await response.json();

            // UI 업데이트
            setComments((prev) => [
                ...prev,
                {
                    id: data.commentId,
                    text: data.content,
                    author: data.userName || data.userId, // 이름이 오면 이름, 없으면 ID
                    timestamp: data.createdAt,
                    likes: data.recommend || 0,
                    userId: data.userId // 본인 확인용 ID 저장
                },
            ]);
            setNewComment("");

        } catch (err) {
            console.error(err);
            alert("댓글 작성 중 오류가 발생했습니다.");
        }
    };

    /* -------------------- [수정됨] 좋아요/싫어요 (책 추천과 동일 방식) -------------------- */
    const handleLike = async (commentId, isUpvote) => {
        try {
            // URL에 ?isUpvote=true/false 붙여서 전송
            const response = await fetch(
                `http://localhost:8080/api/books/${bookId}/comments/${commentId}/like?isUpvote=${isUpvote}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId: Number(userId) }),
                }
            );

            if (response.ok) {
                // 백엔드가 돌려준 '최신 추천 수' 받기
                const updatedCount = await response.json();

                // 해당 댓글만 찾아서 숫자 업데이트
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, likes: updatedCount }
                            : comment
                    )
                );
            } else {
                alert("추천 요청 실패");
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* -------------------- [수정됨] 댓글 삭제 (책 삭제와 동일 방식) -------------------- */
    const handleDelete = async (commentId, authorId) => {
        // 1. 본인 확인 (프론트에서 1차 방어)
        if (String(userId) !== String(authorId)) {
            alert("본인의 댓글만 삭제할 수 있습니다.");
            return;
        }

        if (!window.confirm("정말 댓글을 삭제하시겠습니까?")) return;

        try {
            // URL 쿼리 파라미터로 userId 전송 (?userId=...)
            const response = await fetch(
                `http://localhost:8080/api/books/${bookId}/comments/${commentId}?userId=${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                // UI에서 즉시 제거
                setComments((prev) => prev.filter((comment) => comment.id !== commentId));
                alert("댓글이 삭제되었습니다.");
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || "삭제 실패 (권한이 없거나 오류)");
            }

        } catch (err) {
            console.error(err);
            alert("서버 통신 오류");
        }
    };

    /* -------------------- 댓글 렌더링 -------------------- */
    return (
        <Box sx={{ mt: 4 }}>
            {/* 댓글 입력 */}
            <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={userId ? "댓글 작성..." : "로그인이 필요합니다."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!userId}
                />
                <Button
                    variant="contained"
                    sx={{ ml: 1, bgcolor: "#AED581", color: "white" }}
                    onClick={() => handleAddComment()}
                    disabled={!userId}
                >
                    작성
                </Button>
            </Box>

            {/* 댓글 리스트 */}
            {comments.map((node) => (
                <Box key={node.id} sx={{ mt: 2, border: "1px solid #eee", borderRadius: 2, overflow: "hidden" }}>

                    {/* 헤더: 작성자 / 날짜 / 삭제버튼 */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#f9f9f9", px: 2, py: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {node.author || `User ${node.userId}`}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                {node.timestamp ? new Date(node.timestamp).toLocaleString() : ""}
                            </Typography>

                            {/* 본인 글일 때만 X 버튼 표시 (옵션) */}
                            {String(userId) === String(node.userId) && (
                                <IconButton size="small" onClick={() => handleDelete(node.id, node.userId)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* 내용 + 추천버튼 */}
                    <Box sx={{ px: 2, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ whiteSpace: "pre-line", flex: 1 }}>{node.text}</Typography>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* 추천 (+1) */}
                            <IconButton size="small" color="primary" onClick={() => handleLike(node.id, true)}>
                                <ThumbUpIcon fontSize="small" />
                            </IconButton>

                            <Typography variant="body2" sx={{ mx: 1, fontWeight: "bold" }}>
                                {node.likes}
                            </Typography>

                            {/* 비추천 (-1) */}
                            <IconButton size="small" color="error" onClick={() => handleLike(node.id, false)}>
                                <ThumbDownIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}