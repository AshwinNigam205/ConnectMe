import { Box, IconButton, Typography, Chip } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { ChatState } from "Context/ChatProvider";


const UserBadgeItem = ({ user, handleFunction, admin }) => {

  const {_id} = useSelector((state) => state.user);
  const isSelf = user._id === _id;
  const {selectedChat} = ChatState();


  return (
    <>
      {/* {!isSelf && ( */}
      <Chip
      label={`${user.firstName} ${user.lastName}`}
      onDelete={handleFunction}
      deleteIcon={<CloseIcon />}
      color={selectedChat?.groupAdmin._id === user._id ? "primary" : "default"}
      style={{ marginRight: "8px", marginBottom: "8px" }}

    />
    {/* )} */}
    </>
  );
};

export default UserBadgeItem;
