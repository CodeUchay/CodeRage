import React from "react";
import {ImLeaf} from 'react-icons/im'
import {MdDarkMode} from 'react-icons/md'
function Footer() {
  return (
        <div className="flex justify-between h-10 px-10 lg:px-24 bg-slate-950 text-white">
            <div className="flex justify-center items-center gap-2"><span className="text-xl text-white">Purple</span><ImLeaf size={20} className="text-green-500"></ImLeaf></div>
            <div className="flex justify-center items-center gap-5"><button>Login</button> <button>Register</button> </div>
        </div>
  );
}

export default Footer;
