import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} title
 */

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const Fetch = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    if (savedPosts.length > 0) {
      setPosts(savedPosts);
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(BASE_URL);
          const posts = await res.json();
          setPosts(posts);
          if (res) {
            console.log(posts);
          }
        } catch (error) {
          console.log("Error: ", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  localStorage.setItem("posts", JSON.stringify(posts));

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });

      const updatedPost = await res.json();

      setPosts(
        posts.map((post) =>
          post.id === id ? { ...post, title: updatedPost.title } : post
        )
      );
      setEditId(null);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const startEdit = (id, title) => {
    setEditId(id);
    setEditTitle(title);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Fetching Data</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editId === post.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => handleUpdate(post.id)}>Save</button>
              </>
            ) : (
              <>
                {post.title}
                <FontAwesomeIcon
                  className="editBtn"
                  icon={faPenToSquare}
                  onClick={() => startEdit(post.id, post.title)}
                />
              </>
            )}
            <FontAwesomeIcon
              className="editBtn"
              icon={faTrash}
              onClick={() => handleDelete(post.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fetch;
