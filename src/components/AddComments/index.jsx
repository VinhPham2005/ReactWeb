import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { postModel } from "../../lib/fetchModelData";

function AddComment({ photoId, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      // Gọi API POST mà bạn đã viết ở backend
      await postModel(`/photo/commentsOfPhoto/${photoId}`, {
        comment: comment,
      });
      
      setComment(""); // Xóa trắng ô input sau khi gửi
      onCommentAdded(); // Gọi hàm load lại danh sách ảnh từ component cha
    } catch (error) {
      console.error("Lỗi khi gửi comment:", error);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Viết bình luận..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        variant="contained" 
        disabled={!comment.trim() || isSubmitting}
        disableElevation
      >
        Gửi
      </Button>
    </Box>
  );
}

export default AddComment;