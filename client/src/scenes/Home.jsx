import React, { useState } from "react";
import Post from "../components/Post";
import { ThemeContext } from "../theme";
import { useContext, useEffect } from "react";

function Home() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/post").then((response) => {
      response.json().then((posts) => {
        console.log(posts);
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-28 p-16 md:pt-32 md:px-36 text-${textColor}`}
    >
      <> {posts.length > 0 && posts.map((post) => <Post {...post} />)}</>
    </div>
  );
}

export default Home;
