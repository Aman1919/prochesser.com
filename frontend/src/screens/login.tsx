import { useState } from "react";
import { BACKEND_URL } from "../constants/routes";
import { useGlobalStore } from "../contexts/global.context";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please enter all details");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An unexpected error occurred");
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/game";
    } catch (error: any) {
      showAlert("Error", error.message || "Something went wrong");
    } finally {
      resetForm();
    }
  };

  const showAlert = (title: string, body: string) => {
    alertPopUp({
      message: title,
      type: "Error",
      showPopUp: true,
      body: <div className="p-2">{body}</div>,
    });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <section className="bg-black">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[500px] lg:py-0">
        <div className="w-full rounded-lg sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-2xl font-bold text-center text-yellow-500">
              Log In to Your Account
            </h1>
            <form className="space-y-6">
              <InputField
                label="Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => (window.location.href = "/forgotpassword")}
                className="text-sm font-medium text-white hover:underline"
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                className="w-full bg-yellow-500 font-semibold text-black py-2 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                Login
              </button>
              <p className="text-sm text-gray-500">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-white text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
        required
      />
    </div>
  );
}
