import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './components/login.jsx';
import RegisterPage from './components/register.jsx'
import MyPage from './components/my_page.jsx';
import InfoPage from './components/infoPage.jsx'
import MainPage from './components/MainPage.jsx'
import Enroll from './components/enroll.jsx'
import Revision from './components/revision-1.jsx'

const theme = createTheme({
    palette: {
        mode: 'light', // 필요에 따라 'dark' 가능
    },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
            {/* 기본 페이지 → 로그인으로 이동 */}
          <Route path="/" element={<Navigate to="/my_page" replace />} />

            {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          {/*회원가입 페이지*/}
          <Route path="/register" element={<RegisterPage />} />
          {/*  마이페이지 */}
           <Route path="/my_page" element={<MyPage />} />{}

          <Route path="/enroll" element={<Enroll />} />
          <Route path="/revision/:id" element={<Revision />} />
          {/* 테스트용 직접 링크 */}
          <Route path="/test/revision1" element={<Navigate to="/revision/1" replace />} />
          <Route path="/test/revision2" element={<Navigate to="/revision/2" replace />} />
          <Route path="/test/revision3" element={<Navigate to="/revision/3" replace />} />
          {/*상세정보보기*/}
          <Route path="/books/:id/info" element={<InfoPage />} />
            {/*메인 페이지*/}
          <Route path="/books" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
