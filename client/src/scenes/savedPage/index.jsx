/* eslint-disable jsx-a11y/img-redundant-alt */
import {Box, useMediaQuery, Grid, Paper, Typography, Select, MenuItem, Button} from '@mui/material';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Navbar from 'scenes/navBar';
import {PhotoAlbumOutlined} from '@mui/icons-material';
import PostWidget from 'scenes/widgets/PostWidget';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const SavedPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const [savedPosts, setSavedPosts] = useState([]);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const loggedUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const [selectedCategory, setSelectedCategory] = useState('all');

   const getSavedPosts = async () => {
    console.log("UserId is:", loggedUserId);
    try {
      const response = await axios.get(`http://localhost:3001/saved/${loggedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Replace token with the actual user token
        },
      });
      console.log(response.data);
      setSavedPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const getPostsByPostIds = async (postIdsArray) => {
  try {
    const requests = postIdsArray.map((postId) =>
      axios.get(`http://localhost:3001/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    const responses = await axios.all(requests);
     console.log('Responses', responses);
    const fetchedPosts = responses.map((response) => response.data[0]);
    console.log('Fetched Posts:', fetchedPosts);
    const fetchedPostsWithCategory = fetchedPosts.map((fetchedPost) => {
        const savedPost = savedPosts.find((post) => post.postId === fetchedPost._id);
        console.log('Saved Post:', savedPost); 
        if (savedPost) {
          return { ...fetchedPost, category: savedPost.category };
        }
        return fetchedPost;
      });

    console.log("abc", fetchedPostsWithCategory);
    setFetchedPosts(fetchedPostsWithCategory);


  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};



  useEffect(() => {
    getSavedPosts();
  }, []);

  useEffect(() => {
    if (savedPosts.length > 0) {
      const postIdsArray = savedPosts.map((image) => image.postId);
      console.log('Post IDs array:', postIdsArray);
      getPostsByPostIds(postIdsArray);
    }
  }, [savedPosts]);

  console.log("The saved Posts are: ", savedPosts);

  const handleCategoryChange = (event) => {
    console.log("Category",event.target.value)
    setSelectedCategory(event.target.value);
  };

  // const handleRemoveItem = (index) => {
  //   const items = JSON.parse(localStorage.getItem('savedPosts')) || [];
  //   items.splice(index, 1);
  //   localStorage.setItem('savedPosts', JSON.stringify(items));
  //   window.location.reload();
  // };

  // const deleteAllSaved = () => {
  //   localStorage.removeItem('savedPosts');
  // };
  // useEffect(() => {
  //   getsavedPosts();
  // }, []);

  console.log("Here: ", fetchedPosts)
  // const cat = fetchedPosts.map((image) => image.category);
  // console.log(cat);
  const filteredImages = selectedCategory === 'all'
    ? fetchedPosts // Use fetchedPosts here instead of savedPosts
    : fetchedPosts.filter((image) => image.category === selectedCategory);

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4' component='h1'>
              My Saved Images
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='flex-end'>
              <Select value={selectedCategory} onChange={handleCategoryChange}>
                <MenuItem value='all'>All</MenuItem>
                <MenuItem value='personal'>Personal</MenuItem>
                <MenuItem value='funny'>Funny</MenuItem>
                <MenuItem value='motivational'>Motivational</MenuItem>
              </Select>
            </Box>
          </Grid>
          {filteredImages?.length > 0 ? (
            filteredImages?.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <PostWidget
                  key={image._id}
                  postId={image._id}
                  postUserId={image.userId}
                  name={`${image.firstName} ${image.lastName}`}
                  description={image.description}
                  location={image.location}
                  picturePath={image.picturePath}
                  userPicturePath={image.userPicturePath}
                  likes={image.likes}
                  comments={image.comments}
                />
                {/* <Button variant="contained" color="error" style={{ marginTop: '1rem' }}
                  onClick={() => handleRemoveItem(index)}>Remove</Button> */}
              </Grid>
            ))


          ) : (
            <Grid item xs={12}>
              <Paper elevation={3}>
                <Grid container spacing={2} justify='center'>
                  <Grid item>
                    <PhotoAlbumOutlined fontSize='large' />
                  </Grid>
                  <Grid item>
                    <Typography variant='h6' component='h2'>
                      No saved images found for this category
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default SavedPage;