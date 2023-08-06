import { 
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,   
    useMediaQuery,
    FormControl,
    Input,
    TextField,
    Divider,
    Typography,
    Snackbar,
    IconButton,
    useTheme,
    CircularProgress
}
from "@mui/material";
import { DriveFileRenameOutline, Settings } from '@mui/icons-material';
import axios from "axios";
import { useState, Fragment } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";
import ChatSearchBar from "components/ChatSearchBar";
import Alert from "./Alert";
import UserBadgeItem from "./UserBadgeItem";

export default function ResponsiveDialog( {fetchMessages, fetchAgain, setFetchAgain}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [groupChatName, setGroupChatName] = useState();
  const user = useSelector((state) => state.user);
  const [selectedUsers, setSelectedUsers] = useState([user]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.token);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat} = ChatState();


  //For Alert Component
  const [alertopen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3001/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Couldn't Rename Group!");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      setAlertOpen(true);
      setAlertMessage("User Already Added In The Group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setAlertOpen(true);
      setAlertMessage("Only Admins Can Add Someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3001/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Error Occured!");
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      setAlertOpen(true);
      setAlertMessage("Only Admins Can Remove Someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3001/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      if (user1._id === selectedChat.groupAdmin._id) {
      // If the removed user was the group admin, select a new admin from the remaining users
        if (data.users && data.users.length > 0) {
        // Here, you can implement your own logic to select a new admin, for example, select the first user from the users list.
        const newAdmin = data.users[0];
        // Update the groupAdmin field in the chat
        data.groupAdmin = newAdmin;
      } else {
        // If there are no other users in the group, delete the chat
        await axios.delete(`http://localhost:3001/chat/${selectedChat._id}`, config);
        setSelectedChat(); // Clear the selectedChat since the chat is deleted
      }
    }

      //As User has removed himself only, then we remove the chat from thier chat list
      user1._id === user.id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Error Occured!");
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton onClick={() => {setOpen(true);}}>
        <Settings />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle 
            id="responsive-dialog-title"
            fontSize="25px"
            textAlign="center"
        >
          {selectedChat.chatName}
        </DialogTitle>
        <DialogContent>
          <Box  mt="10px" mb="10px" w="100%" d="flex" flexWrap="wrap">
              {/* {console.log(selectedUsers)}  */}
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
          </Box>
          <Divider />
          <Box
                display="grid"
                gap="15px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                // "& > div" basically looks for any div that is a child of the Box
                sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                mb: "15px"
            }}
            >
                <TextField
                label="Rename Group"
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
                sx={{ gridColumn: "span 4", margin: "15px 15px 0px"}}
                />
                <Button 
                  variant="contained" 
                  endIcon={<DriveFileRenameOutline />}
                  isLoading={renameloading}
                  sx={{ gridColumn: "span 4"}}
                  onClick={handleRename}
                  >
                    Change Group Name
                </Button>
            </Box>
            <Divider sx={{mb: "15px"}}/>
            <ChatSearchBar 
              helperText="Add Users To Group" 
              onClickAction="handleAddUser" 
              handleAddUser={handleAddUser}
            />
            {loading ? (
               <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
               </Box>
            ) : (<></>)}
          
        </DialogContent>
        <DialogActions>
          
          <Button onClick={() => {handleRemove(user)}} sx={{color: "grey" ,backgroundColor: "red"}} autoFocus >
            Leave Group
          </Button>
          <Button onClick={handleClose} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <Alert
        message={alertMessage}
        open={alertopen}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}
