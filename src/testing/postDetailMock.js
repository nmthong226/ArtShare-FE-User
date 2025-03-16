// src/mocks/mockData.js

export const mockPosts = [
    {
      id: '1',
      title: 'Arcane Castle',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a nibh erat.  Nullam lobortis pretium nisl id tempor. Sed ac sem at mi scelerisque tempor sit amet eu nisl. Proin vehicula lorem bibendum pulvinar.  ${"This is extra text to make the description longer. ".repeat(10)}`,
      imageUrl: 'https://cdna.artstation.com/p/assets/images/images/085/847/304/large/charlotte-o-neill-charlotte-oneill-matte-painting-arcane-s2-1-low.jpg?1741784995', // Replace with a real image URL or a local image path
      postedDate: '2023-10-27', // Use a consistent date format
      author: {
        name: 'Author Name',
        handle: 'Author123',
      },
      likes: 840,
      comments: 20, // This is the *count* of comments, not the comments themselves
      isSaved: false,
    },
    {
      id: '2',
      title: 'Another Awesome Artwork',
      description: 'A shorter description for this post.',
      imageUrl: 'https://cdna.artstation.com/p/assets/images/images/085/847/304/large/charlotte-o-neill-charlotte-oneill-matte-painting-arcane-s2-1-low.jpg?1741784995',
      postedDate: '2023-10-26',
      author: {
        name: 'Different Author',
        handle: 'Author456',
      },
      likes: 123,
      comments: 5,
      isSaved: true,
    },
    // Add more mock posts as needed
  ];
  
  export const mockComments = {
    '1': [ // Comments for post with id '1'
      {
        id: 'c1',
        author: {
          name: 'Author Name',
          profilePictureUrl: 'https://cdna.artstation.com/p/users/avatars/003/463/592/medium/d407f6fe42bffb3ab4b4bd258bc95fc7.jpg?1630494856',
        },
        text: 'In Sed Ex Rutrum, Porta Tortor Ut, Mollis Odio. Phasellus Tristique id Quam Ut Mattis. In Egestas Vel Mi At Suscipit. Sed Facilisis Mollis Orci id Pharetra.',
        timestamp: '22h',
      },
      {
        id: 'c2',
        author: {
          name: 'Author Name',
          profilePictureUrl: 'https://cdna.artstation.com/p/users/avatars/003/463/592/medium/d407f6fe42bffb3ab4b4bd258bc95fc7.jpg?1630494856',
        },
        text: 'In Sed Ex Rutrum, Porta Tortor Ut Mollis Odio. Phasellus Tristique Id Quam Ut Mattis. In Egestas Vel MI',
        timestamp: '1d', // Different format to show variation
      },
    ],
    '2': [ //comments for post with id '2'
        {
          id: 'c3',
          author:{
            name: "Commenter 1",
          },
          text: "Great Post!",
          timestamp: '2h'
        }
    ]
    // Add comments for other posts as needed
  };
  
  // Helper functions to simulate API calls
  export const getMockPostById = (postId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = mockPosts.find((p) => p.id === postId);
        if (post) {
          resolve(post);
        } else {
          reject(new Error('Post not found'));
        }
      }, 500); // Simulate a 500ms delay
    });
  };
  
  export const getMockCommentsForPost = (postId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const comments = mockComments[postId] || []; // Return empty array if no comments
          resolve(comments);
  
      }, 300); // Simulate a 300ms delay
    });
  };