import { useState, useRef} from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Bookmarks,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchBar from "components/SearchBar";
import { ChatState } from "Context/ChatProvider";
import { getSender } from "config/ChatLogics";


const Navbar = () => {

  //Used to toggle navbar menu in mobile screen  
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const {
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  // const {user, _id, picturePath} = useSelector((state) => state.user);

  //Hook in Material UI that allows to determine whether current screen size is 
  // below this min-width or higher than it
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");


  //Notification Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const spanRef = useRef();
  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(spanRef.current);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Allows us to use theme settings that we defined in Theme file 
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  //Making a variable for full name of user
  const fullName = `${user.firstName} ${user.lastName}`;
    // const fullName = "Ashwin Nigam";
    

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt} ref={spanRef}>
      <FlexBetween gap="1.75rem" >
        <Typography
          fontWeight="bold"
          //clamp allows you to provide a range a values
          //i.e min = 1rem, max = 2.25rem, prefered = 2rem
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          //Navigate to home on clicking logo
          onClick={() => navigate("/home")}
          //CSS for logo image
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          ConnectMe
        </Typography>
        {isNonMobileScreens && (
          //If its not a Mobile screen Then we give it a search bar
          <SearchBar/>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */ }
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
            {/* Light And Dark Mode Button */}
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Message
              onClick = {() => navigate("/chat")}
              sx={{ fontSize: "25px" }} />
          </IconButton>


          {/* <Notifications sx={{ fontSize: "25px" }} /> */}

           <IconButton onClick={handleClick} size="large">
              <Badge
                badgeContent={notification.length}
                color="secondary"
                showZero
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Notifications sx={{ fontSize: "25px" }} onClick = {() => navigate("/chat")}/>
              </Badge>
            </IconButton>
            {/* <Box display="flex" flexDirection="column" gap="1.5rem">
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
              {!notification.length && (
                <MenuItem onClick={handleClose}>No New Messages</MenuItem>
              )} */}
              {/* {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                    handleClose();
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))} */}
            {/* </Menu>
            </Box> */}


          <IconButton>
            <Bookmarks
              onClick = {() => navigate("/saved/${user._id}")}
              sx={{ fontSize: "25px" }} />
          </IconButton>
          {/* Dropdown for login and logout */}
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <SearchBar />
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message 
              onClick = {() => navigate("/chat")}
              sx={{ fontSize: "25px" }} />


            <IconButton onClick={handleClick} size="large">
              <Badge
                badgeContent={notification.length}
                color="secondary"
                showZero
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Notifications fontSize="large" onClick = {() => navigate("/chat")}/>
              </Badge>
            </IconButton>
              {/* <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
              >
                {!notification.length && (
                  <MenuItem onClick={handleClose}>No New Messages</MenuItem>
                )}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                      handleClose();
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </Menu> */}

            <IconButton>
              <Bookmarks
                onClick = {() => navigate("/saved/${user._id}")}
                sx={{ fontSize: "25px" }} />
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;