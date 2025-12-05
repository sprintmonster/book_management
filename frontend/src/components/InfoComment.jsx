import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function NovelComment() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("홍길동");

    const handleAddComment = (parentId = null) => {
        if (!newComment.trim()) return;
        const timestamp = new Date().toLocaleString();

        const addCommentRecursively = (nodes) => {
            return nodes.map(node => {
                if (node.id === parentId) {
                    return {
                        ...node,
                        replies: [
                            ...node.replies,
                            {
                                id: Date.now(),
                                text: newComment,
                                author,
                                timestamp,
                                replies: [],
                                isReplying: false,
                                likes: 0
                            }
                        ],
                        isReplying: false
                    };
                }
                return { ...node, replies: addCommentRecursively(node.replies) };
            });
        };

        if (parentId === null) {
            setComments(prev => [
                ...prev,
                {
                    id: Date.now(),
                    text: newComment,
                    author,
                    timestamp,
                    replies: [],
                    isReplying: false,
                    likes: 0
                }
            ]);
        } else {
            setComments(prev => addCommentRecursively(prev));
        }

        setNewComment("");
    };

    const toggleReplyInput = (id) => {
        const toggleRecursively = (nodes) => {
            return nodes.map(node => {
                if (node.id === id) {
                    return { ...node, isReplying: !node.isReplying };
                }
                return { ...node, replies: toggleRecursively(node.replies) };
            });
        };
        setComments(prev => toggleRecursively(prev));
    };

    const handleLike = (id, delta) => {
        const updateLikes = (nodes) => {
            return nodes.map(node => {
                if (node.id === id) {
                    return { ...node, likes: (node.likes || 0) + delta }; // undefined 방지
                }
                return { ...node, replies: updateLikes(node.replies) };
            });
        };
        setComments(prev => updateLikes(prev));
    };

    const renderComments = (nodes, level = 0) => {
        return nodes.map(node => (
            <Box key={node.id} sx={{ ml: level * 4, mt: 2 }}>
                <Box sx={{ border: "1px solid #ccc", overflow: "hidden" }}>
                    {/* 작성자 + 시간 */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.200", px: 2, py: 1 }}
                         onClick={() => toggleReplyInput(node.id)}
                    >
                        <Typography variant="subtitle2" fontWeight="bold">{node.author}</Typography>
                        <Typography variant="caption" color="text.secondary">{node.timestamp}</Typography>
                    </Box>

                    {/* 댓글 내용 + 추천/비추천 */}
                    <Box sx={{ px: 2, py: 1, bgcolor: "white", display: "flex", justifyContent: "space-between", alignItems: "flex-start" ,wordBreak:"break-all",whiteSpace:"pre-line"}}>
                        <Typography sx={{flex:1, mr: 2 }}>{node.text}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                            <IconButton size="small" color="primary" onClick={() => handleLike(node.id, 1)}>
                                <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" sx={{ mx: 0.5 }}>{node.likes}</Typography>
                            <IconButton size="small" color="error" onClick={() => handleLike(node.id, -1)}>
                                <ThumbDownIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                {/* 대댓글 입력창 */}
                {node.isReplying && (
                    <Box sx={{ display: "flex", mt: 1, ml: 4 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="대댓글 작성..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <Button variant="contained" sx={{ ml: 1 }} onClick={() => handleAddComment(node.id)}>
                            작성
                        </Button>
                    </Box>
                )}

                {/* 대댓글 */}
                {node.replies.length > 0 && renderComments(node.replies, level + 1)}
            </Box>
        ));
    };

    return (
        <Box sx={{ mt: 4 }}>
            {/* 최상단 댓글 입력 */}
            <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="댓글 작성..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <Button variant="contained" sx={{ ml: 1 }} onClick={() => handleAddComment()}>
                    작성
                </Button>
            </Box>

            {/* 댓글 리스트 */}
            {renderComments(comments)}
        </Box>
    );
}