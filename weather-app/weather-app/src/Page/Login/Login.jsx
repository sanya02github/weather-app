import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub'
import { auth, provider } from '../../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            
          
            const token = result.user.accessToken;
            console.log(token)
       
            const user = result.user;
            
            console.log(user);
            navigate('/');
          }).catch((error) => {
    
            console.error(error);
          });
     };

  return (
    <Box display={"flex"} height={"100vh"} justifyContent={"center"} alignItems={'center'}>
    <Box display="flex" bgcolor={"white"}  flexDirection="column" justifyContent={"center"} boxShadow={'0 4px 8px 0 rgba(0,0,0,0.2)'} alignItems="center" mt={8} padding={"50px"} border={"1px solid black"} borderRadius={"10px"}>
      <Typography variant="h4" gutterBottom>
        ClimateWise
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
     Welcome
      </Typography>
      <Button 
        variant="contained"
        style={{background:"black",marginTop:"150px"}}
        onClick={handleLogin}
        startIcon={<GitHubIcon />}
        size="large"
      >
        Login with GitHub
      </Button>
    </Box>
    </Box>
  );
};

export default Login;