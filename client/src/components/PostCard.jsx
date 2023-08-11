import React from "react";
import { ThemeContext } from "../theme";
import { useContext } from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function PostCard({ _id, title, summary, cover, content, createdAt, author }) {
  const { isDarkMode } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";

  return (
    <div
      className={`p-3 md:p-5 flex flex-col md:flex-row w-full max-w-3xl mx-auto rounded-lg bg-${bgColor} text-${textColor} shadow-md transition-shadow`}
    >
      <img
        src={cover}
        alt=""
        className="h-[180px] w-full md:w-1/2 object-cover rounded-lg md:h-[300px]"
      />
      <div className="flex flex-col flex-grow justify-between p-3">
        <div>
          <h2 className="text-lg font-semibold leading-5 lg:text-2xl">
            {title}
          </h2>
          <div className="text-xs lg:text-sm mt-2 text-gray-600">
            <p className="">@{author.username}</p>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </div>
          <p className="text-sm mt-4 lg:text-base leading-4 ">{summary}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            to={`/post/${_id}`}
            className={`px-4 py-2 rounded-md text-${textColor}  bg-purple-500 shadow-sm hover:bg-purple-600 font-semibold transition-colors`}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
