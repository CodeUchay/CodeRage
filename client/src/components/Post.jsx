import React from "react";
import unsplash from "../image/unsplash.jpg";
import { ThemeContext } from "../theme";
import { useContext } from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Post({ _id, title, summary, cover, content, createdAt, author }) {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  const shadowColor = isDarkMode ? "white" : "";

  return (
    <div
      className={`p-5 flex flex-col lg:flex-row w-full max-w-3xl mx-auto rounded-lg bg-${bgColor} text-${textColor} shadow-md transition-shadow`}
    ><Link
    to={`/post/${_id}`}
    > 
      <img
        src={`http://localhost:5000/${cover}`}
        alt=""
        className="h-[180px] w-full md:w-96 object-cover rounded-lg md:h-[300px] transition-transform transform-gpu hover:scale-105"
      />
      </Link>
      <div className="flex flex-col flex-grow justify-between p-3">
        <div>
          <h2 className="text-lg font-semibold leading-5 ">{title}</h2>
          <div className="text-xs lg:text-sm mt-2 text-gray-600">
            <p className="">by: {author.email}</p>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </div>
          <p className="text-sm mt-4 lg:text-base leading-4 ">{summary}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            to={`/post/${_id}`}
            className={`px-4 py-2 rounded-md text-${textColor} bg-purple-600 hover:bg-purple-700 font-semibold transition-colors`}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Post;
