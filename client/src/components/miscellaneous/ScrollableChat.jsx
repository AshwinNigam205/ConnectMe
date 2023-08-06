import { Tooltip, Button } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "config/ChatLogics";
import { ChatState } from "Context/ChatProvider";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";

const ScrollableChat = ({ messages }) => {
//   const { user } = ChatState();
    const user = useSelector((state) => state.user);
    // const {_id } = useSelector((state) => state.user);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) || 
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={`${m.sender.firstName} ${m.sender.lastName}`} placement="bottom-start" arrow>
                <Button>
                    <UserImage image={m.sender.picturePath} size="55px"/>
                </Button>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#00e5ff" : "#E8E8E8"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: " #4A4A4A"
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;