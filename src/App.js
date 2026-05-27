import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

const App = () => {
  return (
    <Router>
      <TopBar />
      {/* buffer giữa AppBar và Grid */}
      <Box sx={{ mt: 2 }} />
      <Grid container spacing={3} sx={{ px: 2 }}>
        {/* User List */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, height: '80vh', overflowY: 'auto' }}>
            <UserList />
          </Paper>
        </Grid>
        {/* User Detail / Photos */}
        <Grid item xs={12} sm={9}>
          <Paper sx={{ p: 3, minHeight: '80vh' }}>
            <Routes>
              <Route path="/users/:userId" element={<UserDetail />} />
              <Route path="/photos/:userId" element={<UserPhotos />} />
              <Route
                path="/users"
                element={<Typography variant="h6">Select a user</Typography>}
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </Router>
  );
};

export default App;