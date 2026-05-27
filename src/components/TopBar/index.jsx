import React, { useRef, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Để gửi file bằng FormData

const TopBar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Hàm xử lý Logout (Giữ nguyên của bạn)
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login-register");
  };

  // Mở cửa sổ chọn file khi bấm nút "Add Photo"
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  // Nhận file và gửi lên Backend
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    // Gửi file thì bắt buộc phải dùng FormData thay vì JSON thông thường
    const formData = new FormData();
    formData.append("photo", file); 

    try {
      // Nhớ dùng đúng cổng Backend của bạn (ví dụ: 8081)
      await axios.post("http://localhost:8081/api/photo/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tải ảnh lên thành công!");
      
      // Yêu cầu đề bài: Hiển thị ngay ảnh đó. 
      // Chuyển hướng người dùng về đúng trang chứa ảnh của họ để xem
      navigate(`/photos/${currentUser._id}`);
      
      // Mẹo: Reload nhẹ dữ liệu nếu họ đang đứng sẵn ở trang đó
      window.location.reload(); 
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      alert("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      // Reset input để có thể up cùng 1 ảnh nhiều lần nếu muốn
      e.target.value = null; 
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {currentUser ? `Hi, ${currentUser.first_name}` : "Photo Sharing App"}
        </Typography>

        {currentUser ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            
            {/* 1. NÚT ADD PHOTO */}
            <Button 
              color="inherit" 
              variant="outlined" 
              onClick={handleAddPhotoClick}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Add Photo"}
            </Button>
            
            {/* THẺ INPUT FILE BỊ ẨN */}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {/* 2. NÚT LOGOUT */}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">Vui lòng đăng nhập</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;