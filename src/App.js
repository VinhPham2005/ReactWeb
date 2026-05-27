import React, { useEffect, useState } from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister"; 

const App = () => {
  // Quản lý trạng thái người dùng đăng nhập trên toàn hệ thống
  const [currentUser, setCurrentUser] = useState(null);

  // Tự động kiểm tra và khôi phục phiên đăng nhập từ localStorage khi reload (F5) trang
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* 1. Truyền currentUser và bộ set trạng thái vào TopBar */}
      <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      
      {/* buffer giữa AppBar và Grid */}
      <Box sx={{ mt: 2 }} />
      <Grid container spacing={3} sx={{ px: 2 }}>
        
        {/* Khu vực User List (Bên trái) */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, height: '80vh', overflowY: 'auto' }}>
            {/* 2. ĐIỀU KIỆN: Chỉ hiển thị danh sách người dùng khi ĐÃ ĐĂNG NHẬP */}
            {currentUser ? (
              <UserList />
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                Đăng nhập để xem danh sách
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Khu vực Nội dung chính (Bên phải) */}
        <Grid item xs={12} sm={9}>
          <Paper sx={{ p: 3, minHeight: '80vh' }}>
            <Routes>
              {/* 3. LOGIC PHÂN QUYỀN ROUTE: */}
              {currentUser ? (
                // Nếu ĐÃ ĐĂNG NHẬP: Mở các trang nội dung bình thường
                <>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  <Route path="/photos/:userId" element={<UserPhotos />} />
                  <Route
                    path="/users"
                    element={<Typography variant="h6">Select a user</Typography>}
                  />
                  {/* Nếu đã đăng nhập mà cố tình gõ link login-register thì đẩy về trang chủ */}
                  <Route path="/login-register" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
                  <Route path="/" element={<Navigate to={`/users/${currentUser._id}`} replace />} />
                </>
              ) : (
                // Nếu CHƯA ĐĂNG NHẬP: Khóa hết tất cả và bắt buộc hiển thị LoginRegister
                <>
                  <Route path="/login-register" element={<LoginRegister setCurrentUser={setCurrentUser} />} />
                  {/* Bất kỳ đường dẫn deep-link nào khác đều bị ép chuyển hướng về trang login-register */}
                  <Route path="*" element={<Navigate to="/login-register" replace />} />
                </>
              )}
            </Routes>
          </Paper>
        </Grid>

      </Grid>
    </Router>
  );
};

export default App;