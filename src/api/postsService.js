// src/services/postsService.js

import { getMockCommentsForPost, getMockPostById } from "../testing/postDetailMock";

// Simulate API calls using the mock data
export const getPostById = (postId) => {
    return getMockPostById(postId); //use mock function directly
};

export const getCommentsForPost = (postId) => {
    return getMockCommentsForPost(postId); //use mock function directly.
};

// You can add other functions here (e.g., createPost, updatePost)
// and simulate them using the mock data as well.