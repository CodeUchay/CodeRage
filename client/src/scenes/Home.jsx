import React, { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { ThemeContext } from "../theme";
import { useContext } from "react";

function Home() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  const bgSkeleton = isDarkMode ? "purple-600" : "gray-300";
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    fetch(baseURL + "/post", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
        setIsLoading(false); // Set isLoading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setIsLoading(false); // Set isLoading to false in case of error
      });
  }, []);
  const loadingSkeletons = Array.from({ length: 3 }, (_, index) => (
    <div
      key={index}
      className={`p-3 md:p-5 w-full max-w-3xl mx-auto rounded-lg bg-${bgColor} text-${textColor} shadow-md transition-shadow animate-pulse mb-6`}
    >
      <div className="md:flex md:flex-row">
        <div
          className={`h-[180px] md:w-1/2 bg-${bgSkeleton} rounded-lg md:h-[300px]`}
        ></div>
        <div className="flex flex-col flex-grow justify-between p-3">
          <div>
            <div className={`h-4 bg-${bgSkeleton} rounded w-2/3 mb-2 md:mb-8`}></div>
            <div className={`h-3 bg-${bgSkeleton} rounded w-1/4 mb-2 md:mb-8`}></div>
            <div className={`h-2 bg-${bgSkeleton} rounded w-full mb-3 md:mb-5`}></div>
            <div className={`h-2 bg-${bgSkeleton} rounded w-full mb-3 md:mb-5`}></div>
            <div className={`h-2 bg-${bgSkeleton} rounded w-2/3 `}></div>
          </div>
          <div className="mt-4 flex justify-end">
            <div
              className={`px-4 py-2 rounded-md text-${bgSkeleton} bg-${bgSkeleton} shadow-sm font-semibold transition-colors`}
            >
              <p className="opacity-0">loading...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-28 p-12 md:pt-32 md:px-36 text-${textColor}`}
    >
      {isLoading
        ? loadingSkeletons
        : // Render fetched posts
          posts.map((post) => <PostCard key={post._id} {...post} />)}
    </div>
  );
}

export default Home;
