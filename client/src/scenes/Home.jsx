import React, { useState } from "react";
import PostCard from "../components/PostCard";
import { ThemeContext } from "../theme";
import { useContext, useEffect } from "react";

function Home() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  const [posts, setPosts] = useState([]);

  useEffect( () => {
    fetch(baseURL + "/post", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // ... other headers if needed
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-28 p-12 md:pt-32 md:px-36 text-${textColor}`}
    >
      <>
        {posts.length > 0 &&
          posts.map((post) => <PostCard key={post._id} {...post} />)}
      </>
    </div>
  );
}

export default Home;
