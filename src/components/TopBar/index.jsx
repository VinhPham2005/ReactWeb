import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function TopBar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pathParts = location.pathname.split("/");
  const userId = (pathParts[1] === "users" || pathParts[1] === "photos") ? pathParts[2] : null;

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchModel(`/user/${userId}`)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load user");
          setLoading(false);
        });
    } else {
      setUser(null);
    }
  }, [userId]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Photo Sharing App
        </Typography>
        {loading && <Typography variant="body1">Loading user...</Typography>}
        {error && <Typography variant="body1">{error}</Typography>}
        {user && !loading && !error && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1">
              {pathParts[1] === "photos"
                ? `Photos of ${user.first_name} ${user.last_name}`
                : `${user.first_name} ${user.last_name}`}
            </Typography>
            <Avatar
              src={user.avatar   || undefined}
              sx={{
                bgcolor: user.avatar ? "transparent" : "#bdbdbd",
                color: "#fff"
              }}
            >
              {!user.avatar && user.first_name[0]}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;