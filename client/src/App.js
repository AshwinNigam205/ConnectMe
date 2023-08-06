import { BrowserRouter, Navigate, Routes, Route  } from "react-router-dom";
//We dont have to make a lot of relative addressing because of jsconfig.json
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import ChatPage from "scenes/chatPage";
import SavedPage from 'scenes/savedPage';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";


function App() {

  //Used to grab dark or light mode info from state folder
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  //Basically checks if token exists i.e u are logged in or not
  const isAuth = Boolean(useSelector((state) => state.token))

  return (
    <div className="app">
     <BrowserRouter>
     <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element= {<LoginPage />} />
          {/* Only Navigate to Homepage if token exists else stay on login page */}
          <Route 
            path="/home" 
            element= {isAuth ? <HomePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile/:userId" 
            element= {isAuth ? <ProfilePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/chat" 
            element= {isAuth ? <ChatPage /> : <Navigate to="/" />} 
          />
          <Route
              path='/saved/:userId'
              element={isAuth ? <SavedPage /> : <Navigate to='/' />}
          />
        </Routes>
      </ThemeProvider>
     </BrowserRouter>
    </div>
  );
}

export default App;
