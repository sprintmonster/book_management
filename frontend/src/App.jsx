import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Enroll from './components/enroll.jsx';
import Revision from './components/revision.jsx';

const express = require('express');
const app = express();
const booksRouter = require('./books.routes');

app.use(express.json());
app.use(booksRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/enroll" replace />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/revision/:id" element={<Revision />} />
          {/* 테스트용 직접 링크 */}
          <Route path="/test/revision1" element={<Navigate to="/revision/1" replace />} />
          <Route path="/test/revision2" element={<Navigate to="/revision/2" replace />} />
          <Route path="/test/revision3" element={<Navigate to="/revision/3" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
