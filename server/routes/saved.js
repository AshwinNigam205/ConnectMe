// saved.js

import express from 'express';
import { savePost, getSavedPosts } from '../controllers/saved.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* CREATE */
router.post('/', verifyToken, savePost);

/* READ */
router.get('/:id', verifyToken, getSavedPosts);

export default router;
