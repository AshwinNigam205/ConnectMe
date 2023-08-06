import React from 'react';
import { Box, Paper, Typography, List } from '@mui/material';
import { useSelector } from "react-redux";
import UserListItem from 'components/UserListItem';
import ChatSearchBar from 'components/ChatSearchBar';
import Friend from './Friend';
import UserChats from 'components/UserChats';
import { ChatState } from 'Context/ChatProvider';

const ChatList = ({fetchAgain, setFetchAgain}) => {
  const user = useSelector((state) => state.user);
  const { selectedChat } = ChatState();

  return (
    <Paper
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
        height: '100%',
      }}
    >
      <Typography
        fontWeight="bold"
        fontSize="clamp(1rem, 1.5rem, 2.25rem)"
        color="primary"
        align="center"
        sx={{ marginTop: '10px', mb: "15px" }}
        className="header-message"
      >
        Chat
      </Typography>
      {/* <List style={{ width: '100%',}}> */}
        <Friend
          friendId={user._id}
          name={`${user.firstName} ${user.lastName}`}
          subtitle={user.occupation}
          userPicturePath={user.picturePath}
        />
      {/* </List> */}
      <Box  sx={{mt: "15px"}}/>
      <ChatSearchBar helperText="Search Users For Chat" onClickAction="accessChat" />
      <UserChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Paper>
  );
};

export default ChatList;
