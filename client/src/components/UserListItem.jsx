import { Box, IconButton, Typography, useTheme, Snackbar } from "@mui/material";
import { useDisclosure } from "@chakra-ui/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { ChatState } from "Context/ChatProvider";
import axios from "axios";

const UserListItem = ({ friendId, name, subtitle, userPicturePath, onClickAction, userToAdd, handleGroup, handleAddUser}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [error, setError] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);



  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

    const {
    setSelectedChat,
    chats,
    setChats,
  } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:3001/chat`, { userId }, config);
      console.log(data);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log("Error");
    }
  };

  const handleClick = () => {
    // Perform the action based on the onClickAction prop
    if (onClickAction === "accessChat") {
      // console.log("Working");
      accessChat(friendId);
    } else if (onClickAction === "handleGroup") {
      // console.log(" Working Fine");
      handleGroup(userToAdd);
    }
    else if (onClickAction === "handleAddUser") {
      // console.log(" Handle Add User");
      handleAddUser(userToAdd);
    }
  };

//   const isFriend = friends.find((friend) => friend._id === friendId);
  const isSelf = friendId === _id;


  return (
    <>
    {!isSelf && (<FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={handleClick}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>
    )}
    </>
  );
};

export default UserListItem; 