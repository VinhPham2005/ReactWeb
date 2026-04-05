import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemButton
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const currentUserId = location.pathname.split("/")[2];

  useEffect(() => {
    fetchModel("/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load user list");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Typography variant="body1">User List</Typography>
      <List component="nav">
        {users.map((item) => (
          <div key={item._id}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={`/users/${item._id}`}
                selected={String(item._id) === currentUserId}
                sx={{
                  backgroundColor:
                    String(item._id) === currentUserId ? "#e3f2fd" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      String(item._id) === currentUserId ? "#bbdefb" : "#f5f5f5"
                  }
                }}
              >
                <ListItemText primary={`${item.first_name} ${item.last_name}`} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;