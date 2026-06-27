import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Community() {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});
  const [openCommentId, setOpenCommentId] = useState(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://habittracker-of6r.onrender.com/api/posts",
        getConfig()
      );

      setPosts(response.data || []);
    } catch (error) {
      console.log("Fetch posts error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Could not load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      return;
    }

    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!post.trim()) {
      alert("Write something before posting");
      return;
    }

    try {
      const response = await axios.post(
        "https://habittracker-of6r.onrender.com/api/posts",
        {
          text: post.trim(),
        },
        getConfig()
      );

      setPosts((oldPosts) => [response.data, ...oldPosts]);
      setPost("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Post not created";

      console.log("Post error:", error.response?.data || error.message);
      alert(message);
    }
  };

 const likePost = async (id) => {
  try {
    const response = await axios.put(
      `https://habittracker-of6r.onrender.com/api/posts/${id}/like`,
      {},
      getConfig()
    );

    setPosts((oldPosts) =>
      oldPosts.map((p) => {
        if (p._id !== id) return p;

        return {
          ...p,
          ...response.data,
          comments: p.comments || response.data.comments || [],
        };
      })
    );
  } catch (error) {
    alert(error.response?.data?.message || "Could not like post");
  }
};
  const addComment = async (postId) => {
    const text = commentTexts[postId];

    if (!text || !text.trim()) {
      alert("Write a comment first");
      return;
    }

    try {
      const response = await axios.post(
        `https://habittracker-of6r.onrender.com/api/posts/${postId}/comment`,
        {
          text: text.trim(),
        },
        getConfig()
      );

      setPosts((oldPosts) =>
        oldPosts.map((p) => (p._id === postId ? response.data : p))
      );

      setCommentTexts((old) => ({
        ...old,
        [postId]: "",
      }));

      await fetchPosts();
    } catch (error) {
      alert(error.response?.data?.message || "Could not add comment");
    }
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://habittracker-of6r.onrender.com/api/posts/${id}`,
        getConfig()
      );

      setPosts((oldPosts) =>
        oldPosts.filter((postItem) => postItem._id !== id)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Could not delete post");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Community</h1>

        <div className="card">
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Share your achievement or motivation..."
          ></textarea>

          <button onClick={addPost}>Post</button>
        </div>

        {loading && <p>Loading community posts...</p>}

        {!loading && posts.length === 0 && (
          <p>No posts yet. Be the first to share something.</p>
        )}

       {posts.map((p) => {
  const postOwnerId = p.userId?._id || p.userId;

  const isMyPost =
    String(postOwnerId) === String(currentUser.id);

  return (
    <div className="card" key={p._id}>
      <h3>{p.name || "Habit Tracker User"}</h3>

      <p>{p.text}</p>

     <div className="post-actions">
  <button type="button" onClick={() => likePost(p._id)}>
    <span className="material-symbols-outlined action-icon like-icon">
      favorite
    </span>
    Like {p.likes?.length || 0}
  </button>

  <button
    type="button"
    onClick={() =>
      setOpenCommentId(
        openCommentId === p._id ? null : p._id
      )
    }
  >
    <span className="material-symbols-outlined action-icon">
      chat_bubble
    </span>
    Comment {p.comments?.length || 0}
  </button>

  {isMyPost && (
    <button
      type="button"
      className="danger"
      onClick={() => deletePost(p._id)}
    >
      <span className="material-symbols-outlined action-icon">
        delete
      </span>
      Delete Post
    </button>
  )}
</div>
      <div className="comment-section">
        {p.comments?.map((comment) => (
          <div className="comment" key={comment._id}>
            <b>{comment.name}:</b> {comment.text}
          </div>
        ))}

        {openCommentId === p._id && (
          <div className="comment-input">
            <input
              value={commentTexts[p._id] || ""}
              onChange={(e) =>
                setCommentTexts((old) => ({
                  ...old,
                  [p._id]: e.target.value,
                }))
              }
              placeholder="Write a comment..."
            />

            <button type="button" onClick={() => addComment(p._id)}>
  <span className="material-symbols-outlined action-icon">
    send
  </span>
  Send
</button>
          </div>
        )}
      </div>
    </div>
  );
        })}
      </div>
      <Footer />
    </>
  );
}

export default Community;