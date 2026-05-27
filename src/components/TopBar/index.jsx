import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

// Nhận thêm props currentUser và setCurrentUser từ App.js
function TopBar({ currentUser, setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Đổi tên state 'user' thành 'viewedUser' để phân biệt với người đang đăng nhập
  const [viewedUser, setViewedUser] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pathParts = location.pathname.split("/");
  const userId = (pathParts[1] === "users" || pathParts[1] === "photos") ? pathParts[2] : null;

  // LOGIC CŨ: Lấy thông tin người dùng đang được XEM dựa trên URL
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchModel(`/user/${userId}`)
        .then((data) => {
          setViewedUser(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load user");
          setLoading(false);
        });
    } else {
      setViewedUser(null);
    }
  }, [userId]);

  // LOGIC MỚI: Xử lý Đăng xuất
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8081/api/user/admin/logout', {});
      // Xóa dữ liệu local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Reset state
      setCurrentUser(null);
      // Chuyển hướng về trang đăng nhập
      navigate('/login-register');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        
        {/* === BÊN TRÁI: Tên App và Context (Đang xem ai) === */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">
            Photo Sharing App
          </Typography>

          {loading && <Typography variant="body2">Loading context...</Typography>}
          {error && <Typography variant="body2" color="error">{error}</Typography>}
          
          {/* Vẫn giữ nguyên logic cũ của bạn ở đây */}
          {viewedUser && !loading && !error && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                - {pathParts[1] === "photos"
                  ? `Photos of ${viewedUser.first_name} ${viewedUser.last_name}`
                  : `${viewedUser.first_name} ${viewedUser.last_name}`}
              </Typography>
            </Box>
          )}
        </Box>

        {/* === BÊN PHẢI: Trạng thái Đăng nhập / Đăng xuất === */}
        {currentUser ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  border: '1px solid white',
                  width: 32, 
                  height: 32
                }}
              >
                {currentUser.first_name[0]}
              </Avatar>
              <Typography variant="subtitle1">
                Hi {currentUser.first_name}
              </Typography>
            </Box>

            <Button color="inherit" variant="outlined" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Please Login
          </Typography>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default TopBar;