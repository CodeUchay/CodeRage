import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import { ThemeContext } from "../theme";

export default function EditPost() {
  const { isDarkMode } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  const shadowColor = isDarkMode ? "white" : "";
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    });
  }, []);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch("http://localhost:5000/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-28 p-16 md:p-20 md:px-36 lg:p-36 lg:px-80 text-${textColor}`}
    >
      <div
        className={` p-5 flex flex-col lg:justify-center lg:items-center rounded lg:p-8 gap-4 shadow-md shadow-${shadowColor} `}
      >
        <h1>Edit Post</h1>
        <form onSubmit={updatePost} className=" flex flex-col gap-3">
          <label for="email" className="block text-sm leading-6 ">
            Title:
          </label>
          <input
            className={` text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
            type="title"
            placeholder={"Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label for="email" className="block text-sm leading-6 ">
            Summary:
          </label>
          <input
            className={` text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
            type="summary"
            placeholder={"Summary"}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <label for="email" className="block text-sm leading-6 ">
            Image:
          </label>
          <input
            className={` text-slate-400 w-full shadow-sm sm:text-sm `}
            type="file"
            onChange={(e) => setFiles(e.target.files)}
          />
          <label for="email" className="block text-sm leading-6 ">
            Content:
          </label>
          <Editor onChange={setContent} value={content} />
          <button className="inline-flex justify-center rounded-lg text-xs font-semibold py-2.5 px-4 bg-purple-600 text-${textColor} hover:bg-purple-700 w-full">
            Update post
          </button>
        </form>
      </div>
    </div>
  );
}
