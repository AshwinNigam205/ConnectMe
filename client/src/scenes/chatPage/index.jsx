import React, { useState } from 'react';
import Navbar from "scenes/navBar";
import { Box, Paper, Grid } from '@mui/material';
import { useSelector } from "react-redux";
import useMediaQuery from '@mui/material/useMediaQuery';
import ChatList from 'components/ChatList';
import ChatDetail from 'components/ChatDetail';

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Box>
      <Navbar />
      <Box mx={2} my={2}>
        <Grid container spacing={2} style={{ height: '100%' }}>
          <Grid item xs={12} md={4} style={{ flex: '0 0 30%' }}> 
            <ChatList
              fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
            />
          </Grid>
          <Grid item xs={12} md={8} style={{ flex: '0 0 68%' }}> 
            <ChatDetail  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ChatPage;


