"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Logo from "/public/logo.png";
import LoginBg from "/public/loginBg.jpg";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  // ✅ Extract token inside useEffect to avoid Suspense issues
  useEffect(() => {
    setToken(searchParams.get("token"));
  }, [searchParams]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const resp = await axios.patch("/api/auth/reset-password", {
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      alert(resp.data.message || "Password reset successful!");
      router.push("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm"
        style={{ backgroundImage: `url(${LoginBg.src})` }}
      />

      {/* Reset Password Form */}
      <div className="relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Image
            onClick={() => router.push("/")}
            className="bg-white rounded-md cursor-pointer"
            src={Logo}
            alt="Logo"
            width={80}
            height={80}
          />
          <h2 className="text-2xl font-bold text-white mt-4">Reset Password</h2>
        </div>

        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

              {/* New Password */}
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-white">
                  New Password
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter new password"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-white">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Confirm new password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[var(--priBtn)] text-white font-medium py-2 rounded-lg hover:bg-[var(--priBtnHover)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// ✅ Suspense Wrapper for `useSearchParams()`
const ResetPassword = () => {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
