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
  const { login, isAuthenticated,initializeAuth, setUser } = useAuthStore();
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    initializeAuth()
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const resp = await axios.post("/api/auth/login", {
        email: values.email,
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

  const handleForgotPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      const resp = await axios.post("/api/auth/forgot-password", {
        email: values.email,
      });

      alert(resp.data.message || "Password reset link sent to your email!");
      setIsForgotPassword(false); // Switch back to login form
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || "Request failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    ...(isForgotPassword
      ? {} // No password field for forgot password
      : { password: Yup.string().required("Password is required") }),
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Image with Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm"
        style={{ backgroundImage: `url(${LoginBg.src})` }}
      />

      {/* Login Form */}

      <div className="relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Image onClick={()=>router.push("/")} className="bg-white rounded-md cursor-pointer" src={Logo} alt="Logo" width={80} height={80} />
          <h2 className="text-2xl font-bold text-white mt-4">
            {isForgotPassword ? "Forgot Password" : "Sign in"}
          </h2>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          validateOnChange={false} // ✅ Disables validation on change
          validateOnBlur={false} // ✅ Disables validation on blur
          onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
        >
          {({ isSubmitting, errors }) => (
            <Form className="mt-4">
              {errors.general && (
                <div className="text-red-500 text-sm mb-2">{errors.general}</div>
              )}

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-white">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className={`w-full border rounded-lg px-4 py-2 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Password Field (Only in Login Mode) */}
              {!isForgotPassword && (
                <div className="mb-4">
                  <label htmlFor="password" className="block text-white">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className={`w-full border rounded-lg px-4 py-2 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[var(--priBtn)] text-white font-medium py-2 rounded-lg hover:bg-[var(--priBtnHover)]"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isForgotPassword
                    ? "Processing..."
                    : "Logging in..."
                  : isForgotPassword
                  ? "Reset Password"
                  : "Login"}
              </button>

              {/* Toggle between Login and Forgot Password */}
              <div className="text-center mt-4">
                {isForgotPassword ? (
                  <span
                    className="text-yellow-500 cursor-pointer"
                    onClick={() => setIsForgotPassword(false)}
                  >
                    Back to Login
                  </span>
                ) : (
                  <>
                  <span
                    className="text-yellow-500 cursor-pointer"
                    onClick={() => setIsForgotPassword(true)}
                    >
                    Forgot Password?
                  </span>

                  <span
                    className="ml-8 text-yellow-500 cursor-pointer"
                    onClick={() => router.push('/register')}
                    >
                    Create an account
                  </span>
                    </>
                )}
                
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
