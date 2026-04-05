import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Avatar,
  Stack,
  Grid
} from "@mui/material";
import fetchModel, { API_BASE_URLS } from "../../lib/fetchModelData";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function getPhotoCandidates(photo) {
  const candidates = [];

  if (photo.url?.startsWith("http://") || photo.url?.startsWith("https://")) {
    candidates.push(photo.url);
  }

  if (photo.url) {
    API_BASE_URLS.forEach((baseUrl) => {
      candidates.push(`${baseUrl}${photo.url}`);
    });
  }

  if (photo.file_name) {
    API_BASE_URLS.forEach((baseUrl) => {
      candidates.push(`${baseUrl}/images/${photo.file_name}`);
    });
  }

  return [...new Set(candidates)];
}

function PhotoCardImage({ photo }) {
  const candidates = getPhotoCandidates(photo);
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [photo._id]);

  if (!candidates.length) {
    return null;
  }

  return (
    <CardMedia
      component="img"
      image={candidates[srcIndex]}
      alt="User photo"
      sx={{ width: "100%", objectFit: "cover" }}
      onError={() => {
        if (srcIndex < candidates.length - 1) {
          setSrcIndex((current) => current + 1);
        }
      }}
    />
  );
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModel(`/photosOfUser/${userId}`)
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load photos");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading photos...</div>;
  if (error) return <div>{error}</div>;
  if (!photos.length) return <div>No photos found</div>;

  return (
    <Grid container spacing={2}>
      {photos.map((photo) => (
        <Grid item xs={12} md={6} key={photo._id}>
          <Card sx={{ mb: 3 }}>
            <PhotoCardImage photo={photo} />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(photo.date_time)}
              </Typography>
              <Divider sx={{ my: 1 }} />
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((c) => (
                  <Stack direction="row" spacing={1} alignItems="center" key={c._id}>
                    <Avatar
                      component={Link}
                      to={`/users/${c.user._id}`}
                      sx={{ bgcolor: "#1976d2", cursor: "pointer" }}
                    >
                      {c.user.first_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        <b>
                          <Link to={`/users/${c.user._id}`}>
                            {c.user.first_name} {c.user.last_name}
                          </Link>
                        </b>{" "}
                        - {formatDate(c.date_time)}
                      </Typography>
                      <Typography variant="body1">{c.comment}</Typography>
                    </Box>
                  </Stack>
                ))
              ) : (
                <Typography variant="body2">No comments</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserPhotos;
