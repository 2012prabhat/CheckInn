"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuthStore from "@/components/useAuthStore";
import axios from "axios";
import Image from "next/image";
import Logo from "/public/logo.png";
import LoginBg from "/public/loginBg.jpg";

const Login = () => {
  const router = useRouter();
  const { login, isAuthenticated, setUser } = useAuthStore();
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const resp = await axios.post("/api/auth/login", {
        email: values.username,
        password: values.password,
      });

      login(resp.data.accessToken);
      setUser(resp.data.user);
      router.push("/");
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Image with Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm"
        style={{ backgroundImage: `url(${LoginBg.src})` }}
      />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Image src={Logo} alt="Logo" width={80} height={80} />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            {isForgotPassword ? "Forgot Password" : "Sign in"}
          </h2>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors }) => (
            <Form className="mt-4">
              {errors.general && (
                <div className="text-red-500 text-sm mb-2">{errors.general}</div>
              )}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="username"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <div className="text-center mt-4">
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
