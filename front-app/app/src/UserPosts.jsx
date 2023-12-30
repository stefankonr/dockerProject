import React, { useState, useEffect } from 'react';

const UserPosts = ({ loggedInUserId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts for the logged-in user
    fetch(`http://localhost:8555/users/posts/${loggedInUserId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched user posts:', data);
        setPosts(data);
      })
      .catch(error => console.error('Error fetching user posts:', error));
  }, [loggedInUserId]);

  
  console.log('Posts before rendering:', posts); // Dodane logowanie

  return (
    <div>
      <h2>User Posts</h2>
      <p>Logged-in User ID: {loggedInUserId}</p>
      <ul>
        {posts.map(post => (
          <li key={post.post_id}>
            <strong>{post.title}</strong>
            <p>{post.content}</p>
            <p>Author: {post.user_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPosts;
