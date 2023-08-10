import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { ThemeContext } from "../theme";

function PostPage() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "bg-slate-950" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(baseURL + `/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);
      });
  }, [id]);

  if (!postInfo) return null;

  const deletePost = async () => {
    try {
      const response = await fetch(baseURL + `/post/${postInfo._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error deleting post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`flex flex-col gap-5 pt-28 p-16 md:pt-32 md:px-36 ${bgColor} ${textColor}`}
    >
      <div className="w-full max-w-3xl mx-auto ">
        <div className="lg:flex lg:justify-center lg:gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{postInfo.title}</h1>
            <time className="text-gray-600 text-sm">
              {formatISO9075(new Date(postInfo.createdAt))}
            </time>
            <div className="author text-gray-600 text-sm">
              by: {postInfo.author.email}
            </div>
            {userInfo && userInfo.id === postInfo.author._id && (
              <div className=" mt-4 flex gap-3">
                <Link
                  className="inline-flex items-center px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  to={`/editpost/${postInfo._id}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit post
                </Link>
                <div
                  className="inline-flex items-center px-4 py-2 cursor-pointer rounded-md text-white bg-red-500 hover:bg-red-600"
                  onClick={deletePost}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Delete
                </div>
              </div>
            )}
          </div>

          <div className=" mt-8 lg:mt-0 lg:w-full">
            <img
              src={`${postInfo.cover}`}
              alt=""
              className="rounded-lg max-h-80  min-w-full object-cover"
            />
          </div>
        </div>
        <div
          className=" mt-8  "
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>
    </div>
  );
}

export default PostPage;
