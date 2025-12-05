import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";

export default function TopBar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon />
                </IconButton>

                <Typography variant="h6" sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: "bold",
                }}>
                    페이지 제목
                </Typography>
            </Toolbar>
        </AppBar>
    );
}