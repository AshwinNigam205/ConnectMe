import { Box, Divider, Typography, useTheme, Button, Stack, Text } from "@mui/material";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useSelector } from "react-redux";
import WidgetWrapper from "./WidgetWrapper";
import { Add, GroupAdd } from "@mui/icons-material";
import ChatLoading from "./miscellaneous/ChatLoading";
import {getSender } from "../config/ChatLogics";
import UserListItem from "./UserListItem";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const UserChats = ({ fetchAgain, setFetchAgain }) => {

    // const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const loggedUser = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;

    const toast = useToast();

    const fetchChats = async () => {
        // console.log(user._id);
        try {
        const config = {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.get("http://localhost:3001/chat", config);
        console.log(data);
        setChats(data);
        } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        }
    };
    
    useEffect(() => {
        // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

//     useEffect(() => {
//     if (fetchAgain) {
//       fetchChats();
//     }
//   }, [fetchAgain]);

    return (
            <Box
                d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
                flexdir="column"
                alignItems="center" 
                p={2}
                // bg="white"
                w={{ base: "100%", md: "31%" }}
                borderRadius="lg"
                borderWidth="1px"
            >
                <Box
                    pb={2}
                    px={1}
                    fontSize={{ base: "28px", md: "30px" }}
                    d="flex"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography 
                    fontWeight="bold"
                    fontSize="clamp(0.5rem, 1rem, 2.25rem)"
                    color="primary"
                    align="center"
                    sx={{marginBottom: '5px' }}
                    >
                    Your Chats
                    </Typography>
                    <Divider />
                     <Box
                        d="flex"
                        flexdir="column"
                        p={3}
                        bg="#F8F8F8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowy="hidden"
                    >
                        {chats ? (
                            <Stack overflowy="scroll">
                                {chats.map((chat) => (
                                     <Box
                                        onClick={() => setSelectedChat(chat)}
                                        cursor="pointer"
                                        sx={{
                                            // backgroundColor: selectedChat === chat ? "#38B2AC" : "#E8E8E8"
                                            backgroundColor: selectedChat === chat ? "#00e5ff" : "#E8E8E8",
                                            margin: "10px"
                                        }}
                                        color=" #4A4A4A"
                                        px={1}
                                        py={1}
                                        borderRadius="lg"
                                        key={chat._id}
                                    >
                                         <Typography fontWeight="bold">
                                            {!chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)
                                                : chat.chatName}
                                        </Typography>  
                                    </Box>
                                ))}
                            </Stack>
                        
                        ) : (
                        <ChatLoading />
                        )}
                    </Box>
                    <Divider />
                    <GroupChatModal>
                        <Button 
                        variant="contained" 
                        endIcon={<GroupAdd/>}
                        sx={{ml: "20px"}}
                        >
                            Add New Group Chat
                        </Button>
                    </GroupChatModal>
                    
                </Box>   
            </Box>

    );
    

};

export default UserChats;