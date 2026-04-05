import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load user data");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <Box>
      <Typography variant="h5">{user.first_name} {user.last_name}</Typography>
      <Typography variant="body1">Location: {user.location}</Typography>
      <Typography variant="body1">Description: {user.description}</Typography>
      <Typography variant="body1">Occupation: {user.occupation}</Typography>
      <Button
        component={Link}
        to={`/photos/${user._id}`}
        variant="contained"
        sx={{ mt: 2 }}
      >
        View Photos
      </Button>
    </Box>
  );
}

export default UserDetail;