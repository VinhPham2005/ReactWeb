import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Box, Grid, Paper, Divider, Alert } from "@mui/material";
import fetchModel, { API_BASE_URLS, buildApiUrl, postModel }from "../../lib/fetchModelData";

const LoginRegister = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  // --- STATE ĐĂNG NHẬP ---
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- STATE ĐĂNG KÝ ---
  const [regUser, setRegUser] = useState({
    login_name: "", first_name: "", last_name: "", location: "",
    description: "", occupation: "", password: "", passwordConfirm: ""
  });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleRegChange = (e) => {
    setRegUser({ ...regUser, [e.target.name]: e.target.value });
  };

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await postModel( ("/user/admin/login"), {
        login_name: loginName,
        password: loginPassword,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);
      navigate(`/users/${response.data.user._id}`);
    } catch (err) {
      setLoginError(err.response?.data || "Đăng nhập thất bại.");
    }
  };

  // --- XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("1. Đã bấm nút Đăng ký!"); // Trạm kiểm soát 1
    
    setRegError("");
    setRegSuccess("");

    if (regUser.password !== regUser.passwordConfirm) {
      console.log("LỖI: Mật khẩu không khớp."); 
      setRegError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      console.log("2. Chuẩn bị gửi dữ liệu lên Backend:", regUser); // Trạm kiểm soát 2
      
      const response = await axios.post("http://localhost:8081/api/user", {
        login_name: regUser.login_name,
        password: regUser.password,
        first_name: regUser.first_name,
        last_name: regUser.last_name,
        location: regUser.location,
        description: regUser.description,
        occupation: regUser.occupation,
      });

      console.log("3. Backend trả về thành công:", response.data); // Trạm kiểm soát 3

      setRegSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay bên trái.");
      setRegUser({
        login_name: "", first_name: "", last_name: "", location: "",
        description: "", occupation: "", password: "", passwordConfirm: ""
      });
    } catch (err) {
      console.log("4. Backend trả về LỖI:", err.response || err); // Trạm kiểm soát 4
      setRegError(err.response?.data || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Grid container spacing={4} sx={{ p: 2 }}>
      
      {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">Đăng Nhập</Typography>
          <Divider sx={{ mb: 3 }} />
          {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
          <Box component="form" onSubmit={handleLogin}>
            <TextField fullWidth margin="normal" required label="Tên đăng nhập" value={loginName} onChange={(e) => setLoginName(e.target.value)} />
            <TextField fullWidth margin="normal" required type="password" label="Mật khẩu" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.5 }}>Đăng Nhập</Button>
          </Box>
        </Paper>
      </Grid>

      {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">Tạo Tài Khoản Mới</Typography>
          <Divider sx={{ mb: 3 }} />
          {regError && <Alert severity="error" sx={{ mb: 2 }}>{regError}</Alert>}
          {regSuccess && <Alert severity="success" sx={{ mb: 2 }}>{regSuccess}</Alert>}
          <Box component="form" onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Tên (First Name)" name="first_name" value={regUser.first_name} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Họ (Last Name)" name="last_name" value={regUser.last_name} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Tên đăng nhập (Login Name)" name="login_name" value={regUser.login_name} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required type="password" label="Mật khẩu" name="password" value={regUser.password} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required type="password" label="Xác nhận mật khẩu" name="passwordConfirm" value={regUser.passwordConfirm} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Địa điểm (Location)" name="location" value={regUser.location} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nghề nghiệp (Occupation)" name="occupation" value={regUser.occupation} onChange={handleRegChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Mô tả bản thân (Description)" name="description" value={regUser.description} onChange={handleRegChange} />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 3, py: 1.5 }}>Register Me</Button>
          </Box>
        </Paper>
      </Grid>
      
    </Grid>
  );
};

export default LoginRegister;