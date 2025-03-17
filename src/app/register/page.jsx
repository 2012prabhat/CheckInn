"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Logo from "/public/logo.png";
import LoginBg from "/public/loginBg.jpg";

const Register = () => {
  const router = useRouter();

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const resp = await axios.post("/api/auth/register", {
        ...values,
        role: "user", // Set default role to user
      });
      alert(resp.data.message || "Registration successful!");
      router.push("/login");
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm"
        style={{ backgroundImage: `url(${LoginBg.src})` }}
      />
      <div className="relative z-10 w-full max-w-lg p-6 rounded-lg shadow-lg bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Image
            onClick={() => router.push("/")}
            className="bg-white rounded-md cursor-pointer"
            src={Logo}
            alt="Logo"
            width={80}
            height={80}
          />
          <h2 className="text-2xl font-bold text-white mt-4">Register</h2>
        </div>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "", phone: "" }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, errors }) => (
            <Form className="mt-4">
              {errors.general && <div className="text-red-500 text-sm mb-2">{errors.general}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-white">Name</label>
                  <Field type="text" name="name" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your name" />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white">Email</label>
                  <Field type="email" name="email" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your email" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="password" className="block text-white">Password</label>
                  <Field type="password" name="password" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your password" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-white">Confirm Password</label>
                  <Field type="password" name="confirmPassword" className="w-full border rounded-lg px-4 py-2" placeholder="Confirm password" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="phone" className="block text-white">Phone (Optional)</label>
                <Field type="text" name="phone" className="w-full border rounded-lg px-4 py-2" placeholder="Enter your phone" />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-[var(--priBtn)] text-white font-medium py-2 rounded-lg hover:bg-[var(--priBtnHover)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
              <div className="text-center mt-4">
                <span className="text-yellow-500 cursor-pointer" onClick={() => router.push("/login")}>Already have an account? Login</span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
