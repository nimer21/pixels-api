import { useState } from "react";
import { Link } from "react-router-dom";
import loginIcons from "../assets/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imageTobase64 from './../helpers/imageTobase64';
import useAuthContext from "../context/AuthContext";

const SignUp = () => {

  const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
      name: "",  
      email: "",
      password: "",
      password_confirmation: "",        
      //profilePic: "",
    });
    const {register, errors} = useAuthContext();
    const handelOnChange = (e) => {
        const { name, value } = e.target;

        setData((preve)=> {
            return {...preve, [name]: value }
        });
        //setData({...data, [name]: value });
    }
    
    const handelUploadPic = async (e) => {
      const file = e.target.files[0];
      const imagePic = await imageTobase64(file)
      if (file) {
          setData((prev)=> {
              return {...prev, profilePic: imagePic }
          });
      }
      //console.log("file", file);
      //console.log("imagePic", imagePic);
  }
  const handelSubmit = async (e) => {
      e.preventDefault();
      if(data.password === data.password_confirmation) {
         // Add your code here to submit the form data
         register({...data});
      } else {
        alert("كلمة المرور غير متطابقة");
        console.log("Passwords do not match!");
      }
    }

  return (
    <section id="signup">
    <div className="mx-auto container p-4">
      <div className="bg-white p-5 w-full max-w-sm mx-auto">
        <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
          <div>
              <img src={data.profilePic || loginIcons} alt="login icon" className="" />
          </div>
          <form>
              <label>
              <div className="text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full">
                  تحميل الصورة
              </div>
                  <input type='file' className='hidden' onChange={handelUploadPic}/>
              </label>
              
          </form>
        </div>
        <form className="pt-6 flex flex-col gap-2" onSubmit={handelSubmit}>
        <div className="grid">
            <label htmlFor="name">الإسم : </label>
            <div className="bg-slate-100 p-2">
              <input
                type="text"
                placeholder="أدخل الاسم"
                id="name"
                name="name"
                value={data.name}
                onChange={handelOnChange}
                required
                className="w-full h-full outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="grid">
            <label htmlFor="email">الإيميل : </label>
            <div className="bg-slate-100 p-2">
              <input
                type="email"
                placeholder="أدخل الإيميل"
                id="email"
                name="email"
                value={data.email}
                onChange={handelOnChange}
                required
                className="w-full h-full outline-none bg-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password">كلمة المرور: </label>
            <div className="bg-slate-100 p-2 flex">
              <input
                type={showPassword ? "text" : "password" }
                placeholder="أدخل كلمة المرور"
                value={data.password}
                onChange={handelOnChange}
                id="password"
                name="password"
                required
                className="w-full h-full outline-none bg-transparent"
              />
              <div className="cursor-pointer text-xl" onClick={()=> setShowPassword((prev)=>!prev)}>
                <span>
                  {
                      showPassword? (
                          <FaEyeSlash />
                          
                      ) : (
                          <FaEye />
                      )
                  }
                </span>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="password_confirmation">تأكيد كلمة المرور: </label>
            <div className="bg-slate-100 p-2 flex">
              <input
                type={showConfirmPassword ? "text" : "password" }
                placeholder="أخل تأكيد كلمة المرور"
                value={data.password_confirmation}
                onChange={handelOnChange}
                id="password_confirmation"
                name="password_confirmation"
                required
                className="w-full h-full outline-none bg-transparent"
              />
              <div className="cursor-pointer text-xl" onClick={()=> setShowConfirmPassword((prev)=>!prev)}>
                <span>
                  {
                      showConfirmPassword? (
                          <FaEyeSlash />
                          
                      ) : (
                          <FaEye />
                      )
                  }
                </span>
              </div>
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">إنشاء حساب</button>
        </form>
        <p className="my-5">هل لديك حساب؟ <Link to={"/login"} className="text-red-600 hover:text-red-700 hover:underline">تسجيل الدخول</Link></p>
      </div>
    </div>
  </section>
  );
};
export default SignUp;
