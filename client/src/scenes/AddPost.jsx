import React from "react";
import { ThemeContext } from "../theme";
import { useContext, useState } from "react";
import Editor from "../components/Editor";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

function AddPost() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  const shadowColor = isDarkMode ? "white" : "";

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  
  async function createNewPost(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]); //incase there are multiple files
    e.preventDefault();
    if (!title || !summary || !content || !files[0]) {
      alert("Please fill in all required fields.");
      return;
    }
   
    const response = await fetch(baseURL+"/createpost", {
      method: "POST",
      body: data,
     credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-28 p-16 md:p-20 md:px-36 lg:p-36 lg:px-80 text-${textColor}`}
    >
      <div
        className={` p-5 flex flex-col lg:justify-center lg:items-center rounded lg:p-8 gap-4 shadow-md shadow-${shadowColor} `}
      >
        <h1>Create Post</h1>
        <form onSubmit={createNewPost} className=" flex flex-col gap-3">
          <label for="title" className="block text-sm leading-6 ">
            Title:
          </label>
          <input
            className={` text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
            type="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label for="summary" className="block text-sm leading-6 ">
            Summary:
          </label>
          <input
            className={` text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
            type="summary"
            placeholder="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <label for="image" className="block text-sm leading-6 ">
            Image:
          </label>
          <input
            className={` text-slate-400 w-full shadow-sm sm:text-sm `}
            type="file"
            onChange={(e) => setFiles(e.target.files)}
          />
          <label for="content" className="block text-sm leading-6 ">
            Content:
          </label>
          <Editor value={content} onChange={setContent}></Editor>
          <button
            type="submit"
            className="inline-flex justify-center rounded-lg text-xs font-semibold py-2.5 px-4 bg-purple-600 text-${textColor} hover:bg-purple-700 w-full"
          >
            <span className="text-white">Add Post</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPost;
