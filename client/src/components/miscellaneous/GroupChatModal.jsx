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
}
from "@mui/material";
import { useToast, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState, Fragment } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useTheme } from '@mui/material/styles';
import { useSelector } from "react-redux";
import ChatSearchBar from "components/ChatSearchBar";
import UserBadgeItem from "./UserBadgeItem";
import Alert from "./Alert";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const user = useSelector((state) => state.user);
  const [selectedUsers, setSelectedUsers] = useState([user]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.token);
  
 
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  //For Alert Component
  const [alertopen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 




  const handleClose = () => {
    setOpen(false);
  };
  const { chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    console.log("HandleGroup Function Triggered!")
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
    
      setAlertOpen(true);
      setAlertMessage("User Already Added!");
      console.log("Already Added!")
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);

  };


  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {

    handleClose();
    
    if (!groupChatName || !selectedUsers || selectedUsers.length === 0) {
      setAlertOpen(true);
      setAlertMessage("Please Fill in All Details");
      return;
    }

    console.log("Selected Users:", selectedUsers);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:3001/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      console.log(data);

      setChats([data, ...chats]);
      onClose();
      setAlertOpen(true);
      setAlertMessage("New Group Chat Created!");
      
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Failed To Create Group Chat!");
    }
  };

  return (
    <>
    <span onClick={() => {setOpen(true);}}>{children}</span>

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
            // sx={{alignContent: "center"}}
        >
          Create Group Chat
        </DialogTitle>
        <DialogContent sx={{padding: "10px"}}>
            <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                // "& > div" basically looks for any div that is a child of the Box
                sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
            >
                <TextField
                label="Chat Name"
                // onBlur={handleBlur}
                onChange={(e) => setGroupChatName(e.target.value)}
                helperText="Give Your Group Chat a Name"
                sx={{ gridColumn: "span 4", margin: "15px"}}
                />

            </Box>
            <Divider sx={{mb: "15px"}} />
            <ChatSearchBar helperText="Search Users for Chat" onClickAction="handleGroup" handleGroup={handleGroup}/>
            <Box  mt="10px" w="100%" d="flex" flexWrap="wrap">
              {/* {console.log(selectedUsers)}  */}
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleSubmit}>
                Add Chat
            </Button> 
            <Button autoFocus onClick={handleClose}>
                Close
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
};

export default GroupChatModal;