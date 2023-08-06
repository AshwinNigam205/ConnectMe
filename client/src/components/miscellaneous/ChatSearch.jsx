import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import SearchBar from "components/SearchBar";


const ChatSearch = () => {

  //Used to toggle navbar menu in mobile screen  
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // const {user, _id, picturePath} = useSelector((state) => state.user);

  //Hook in Material UI that allows to determine whether current screen size is 
  // below this min-width or higher than it
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

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
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
          <SearchBar/>
      </FlexBetween>
      <Box m="20px" />
        <FlexBetween gap="2rem">
          <Notifications sx={{ fontSize: "25px" }} />
        </FlexBetween>
    </FlexBetween>
  );
};

export default ChatSearch;