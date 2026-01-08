import axiosClient from "@/axiosClient";
import { useState } from "react";

export default function EmailChange() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submit = async () => {
    setEmailError(null);

    if (!agreed || !email) return;
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await axiosClient.post(
        "/email-change/confirm",
        { token, email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess(true);
    } catch (error: any) {
      setEmailError(
        error?.response?.data?.message ||
          "This email is already in use or invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#92e3a9]">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-600">
            Email Updated Successfully!
          </h1>
          <p className="text-gray-600">
            Your email address has been successfully changed.
          </p>
          <p className="text-sm text-gray-400">
            You may safely close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#92e3a9]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Change Your Email
        </h1>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            New email address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-4 py-2
              text-gray-800
              placeholder:text-gray-300
              focus:outline-none
              focus:ring-2
              focus:ring-[#8cb662]
              disabled:bg-gray-100
            "
          />

          {emailError && (
            <p className="text-sm text-red-600 mt-1">{emailError}</p>
          )}
        </div>

        {/* Privacy Policy Agreement */}
        <div className="flex items-start gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={loading}
            className="mt-1 accent-[#92e3a9]"
          />
          <span>
            I agree to the{" "}
            <a
              href="/privacypolicy"
              target="_blank"
              className="text-[#92e3a9] font-medium hover:underline"
            >
              Privacy Policy
            </a>
          </span>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition
            ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#8cb662] hover:brightness-95"
            }
          `}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}

          {loading ? "Processing..." : "Confirm Email Change"}
        </button>
      </div>
    </div>
  );
}
