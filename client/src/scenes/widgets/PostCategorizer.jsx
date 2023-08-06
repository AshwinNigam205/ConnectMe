// PostCategorizer.js

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PostCategorizer = ({
  postId,
  likes,
  picturePath,
  userId,
  userPicturePath,
  name,
  description,
  location,
  comments,
}) => {
  const [category, setCategory] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const token = useSelector((state) => state.token);
  // const {_id} = useSelector((state) => state.user);
  // const userId = _id;

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSave = async () => {
    try {
      // Save the post to the database with the selected category
      const response = await axios.post(
        `http://localhost:3001/saved`,
        {
          userId,
          postId,
          category,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Replace token with the actual user token
          },
        }
      );

      if (response.status === 201) {
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'justifyCenter' }}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel>Category</InputLabel>
        <Select value={category} label='Category' onChange={handleCategoryChange}>
          <MenuItem value='personal'>Personal</MenuItem>
          <MenuItem value='funny'>Funny</MenuItem>
          <MenuItem value='motivational'>Motivational</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 1.1 }}>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message='Post saved!'
      />
    </Box>
  );
};

export default PostCategorizer;
