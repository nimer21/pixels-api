import { useContext, useState } from "react";
import loginIcons from "../assets/signin.gif";
import SummaryApi from './../common/index';
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Context from './../context/index';

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetials } = useContext(Context);

  const handelOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return { ...preve, [name]: value };
    });
    //setData({...data, [name]: value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    //console.log("Login Data", data);
    // Add your code here to submit the form data
    const dataResponse = await fetch(SummaryApi.signIn.url, { //https://pixelsback.localproductsnetwork.com/api/login
      //targetAddressSpace: "public",
      //mode: 'no-cors',
      method: SummaryApi.signIn.method, //'POST'
      credentials:'include',
      headers: {
        "Content-Type": "application/json",
        //"Access-Control-Allow-Origin": "http://backad.localproductsnetwork.com",
        //"Access-Control-Allow-Origin": "https://demo1.art-feat.com",
        //"Access-Control-Allow-Origin": "*",
        //"Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(data),
    });

    //const xx= JSON.parse(theStringThatIsNotJson);
    //const xx= JSON.parse(dataResponse);
    const dataApi = await dataResponse.json();
    //console.log("dataResponse =  ",dataResponse); //Response {type: 'opaque', url: '', redirected: false, status: 0, ok: false, …}

    
    if (dataApi.success) {
      //console.log("dataApi.success");
      toast.success(dataApi.message);
      navigate("/");
      fetchUserDetials();
    }
    if (dataApi.error) {
      console.log("dataApi.error");
      toast.error(dataApi.message);
    }


      /*
      fetch('https://pixelsback.localproductsnetwork.com/api/login')
      .then(response => {
        if (response.headers.post('content-type')?.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not JSON');
        }
      })
      .then(data => {
        // Process the JSON data
      })
      .catch(error => {
        console.error('Error:', error);
      });*/
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icon" className="" />
          </div>
          <form className="pt-6 flex flex-col gap-2" onSubmit={handelSubmit}>
            <div className="grid">
              <label htmlFor="email">إسم المستخدم : </label>
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
              <label htmlFor="email">كلمة المرور : </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={data.password}
                  onChange={handelOnChange}
                  id="password"
                  name="password"
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
                </div>
              </div>
              {/* <Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                نسيت كلمة المرور؟
              </Link> */}
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              تسجيل دخول
            </button>
          </form>
          <p className="my-5">
            ليس لديك حساب؟{" "}
            <Link
              to={"/sign-up"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
export default Login;
