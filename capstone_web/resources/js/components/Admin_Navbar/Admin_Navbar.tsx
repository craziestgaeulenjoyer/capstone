import axiosClient from "@/axiosClient";
import { router } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Calendar,
  BarChart2,
  PieChart,
  Settings,
  LayoutGrid,
  Menu,
  Bell,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

const Modal: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}> = ({ children, onClose, size = "lg" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 animate-fadeIn
          ${
            size === "sm"
              ? "w-[420px]"
              : size === "md"
              ? "w-[550px]"
              : "w-3/4 max-w-3xl"
          }
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

const AccountSettings: React.FC<{
  user: { username: string; email: string; role: string };
  onEmailUpdated: (email: string) => void;
}> = ({ user, onEmailUpdated }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [passwordStrength, setPasswordStrength] =
    useState<"weak" | "normal" | "strong">("weak");


  const [otpRequestStatus, setOtpRequestStatus] =
    useState<"success" | "error" | null>(null);

  const [otpRequestMessage, setOtpRequestMessage] =
    useState<string>("");


  const handleEmailChange = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/api/change-email", {
        password,
        email: newEmail,
      });

      onEmailUpdated(newEmail);
      setMode("view");
      setPassword("");
      setNewEmail("");
    } catch (err) {
      alert("Incorrect password or invalid email");
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || name.length <= 2) return `**@${domain}`;

    const visible = name.slice(-2);
    const masked = "*".repeat(Math.max(name.length - 2, 4));

    return `${masked}${visible}@${domain}`;
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score === 3) return "normal";
    return "strong";
  };

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(newPassword));
  }, [newPassword]);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* HEADER */}
      <div className="pb-4 border-b-3 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Account Profile and Settings
        </h2>
      </div>

      {/* VIEW MODE */}
      {mode === "view" && (
        <>
          {/* PROFILE DETAILS */}
          <div className="space-y-1">
            <span className="inline-block w-full px-2 py-1 mb-4 rounded-md text-sm font-semibold bg-[#8cb662]/80 text-gray-50">
              Account Details
            </span>

            <span className="inline-block w-fit px-2 py-0.5 rounded-full text-sm font-semibold bg-[#8cb662]/10 text-[#8cb662]">
              {user.role}
            </span>

            <p className="text-lg font-medium text-gray-900">
              {user.username}
            </p>

            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                {showEmail ? user.email : maskEmail(user.email)}
              </p>

              <button
                onClick={() => setShowEmail((prev) => !prev)}
                className="text-xs text-[#8cb662] hover:underline"
              >
                {showEmail ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 border-t-3 border-gray-200">
            <span className="inline-block w-full px-2 py-1 mb-2 rounded-md text-sm font-semibold bg-[#8cb662]/80 text-gray-50">
              Account Settings
            </span>
            {/* CHANGE EMAIL */}
            <button
              onClick={() => setShowVerifyModal(true)}
              className="cursor-pointer w-full mb-2 flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <span className="text-[#8cb662] font-medium">
                Change Email
              </span>

              <span className="text-sm italic text-gray-400">
                {showEmail ? user.email : maskEmail(user.email)}
              </span>
            </button>

            {/* CHANGE PASSWORD */}
            <button
              onClick={async () => {
                try {
                  const res = await axiosClient.post(
                    '/api/password-change/request-otp',
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );

                  setOtpRequestMessage(res.data.message || "OTP sent successfully.");
                  setOtpRequestStatus("success");

                } catch (err: any) {
                  setOtpRequestMessage(
                    err.response?.data?.message || "Failed to send OTP. Please try again."
                  );
                  setOtpRequestStatus("error");
                }
              }}
              className="cursor-pointer w-full mb-2 flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <span className="text-[#8cb662] font-medium">
                Change Password
              </span>
            </button>
          </div>
        </>
      )}

      {/* EDIT EMAIL MODE */}
      {mode === "edit" && (
        <div className="w-full max-w-sm space-y-4">
          <input
            type="password"
            placeholder="Confirm your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
          />

          <input
            type="email"
            placeholder="New email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8cb662]"
          />

          <div className="flex gap-3">
            <button
              onClick={() => setMode("view")}
              className="px-4 py-2 rounded-lg border text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleEmailChange}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#8cb662] text-white hover:bg-[#7ca551]"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {showVerifyModal && (
        <Modal onClose={() => setShowVerifyModal(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              We Need to Verify You
            </h3>

            <p className="text-sm text-gray-600">
              In order to change your email of{" "}
              <span className="font-medium">{user.email}</span>, we need to make sure
              you can access your old email. We can send you a verification email to
              ensure that it is you who is doing this specific action.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                disabled={sendingEmail}
                onClick={() => setShowVerifyModal(false)}
                className={`px-4 py-2 rounded-md
                  ${
                    sendingEmail
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gray-400 cursor-pointer hover:bg-gray-500 text-gray-100"
                  }
                `}
              >
                Cancel
              </button>

              <button
                disabled={sendingEmail}
                onClick={async () => {
                  try {
                    setSendingEmail(true);

                    await axiosClient.post(
                      "/api/email-change/request",
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );

                    setShowVerifyModal(false);
                    setShowSuccessModal(true);

                    setTimeout(() => {
                      setShowSuccessModal(false);
                    }, 5000);

                  } catch (error) {
                    alert("Failed to send verification email. Please try again.");
                  } finally {
                    setSendingEmail(false);
                  }
                }}
                className={`px-4 py-2 rounded-md text-white flex items-center justify-center gap-2
                  ${
                    sendingEmail
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#8cb662] cursor-pointer hover:bg-[#7ca551]"
                  }
                `}
              >
                {sendingEmail ? (
                  <>
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
                    <span>Sending…</span>
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {otpRequestStatus && (
        <Modal onClose={() => setOtpRequestStatus(null)}>
          <div className="text-center space-y-4">
            <h3
              className={`text-2xl font-bold ${
                otpRequestStatus === "success"
                  ? "text-[#8cb662]"
                  : "text-red-600"
              }`}
            >
              {otpRequestStatus === "success"
                ? "OTP Sent"
                : "Request Failed"}
            </h3>

            <p className="text-gray-600">
              {otpRequestMessage}
            </p>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setOtpRequestStatus(null);
                  if (otpRequestStatus === "success") {
                    setShowOtpModal(true);
                  }
                }}
                className="px-6 py-2 rounded-md bg-[#8cb662] text-white hover:bg-[#7ca551]"
              >
                OK
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showOtpModal && (
        <Modal onClose={() => setShowOtpModal(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              Verify OTP
            </h3>

            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to your email.
            </p>

            {otpError && (
              <p className="text-sm text-red-600">{otpError}</p>
            )}

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-center tracking-widest text-lg"
              placeholder="••••••"
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                disabled={otpLoading}
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-700"
              >
                Cancel
              </button>

              <button
                disabled={otpLoading || otp.length !== 6}
                onClick={async () => {
                  try {
                    setOtpLoading(true);
                    setOtpError(null);

                    await axiosClient.post(
                      '/api/password-change/verify-otp',
                      { otp },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );

                    setShowOtpModal(false);
                    setShowPasswordModal(true);
                    setOtp("");

                  } catch (err: any) {
                    setOtpError(
                      err.response?.data?.message || "Invalid OTP."
                    );
                  } finally {
                    setOtpLoading(false);
                  }
                }}
                className={`px-4 py-2 rounded-md text-white ${
                  otpLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8cb662] hover:bg-[#7ca551]"
                }`}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showPasswordModal && (
        <Modal
          size="sm"
          onClose={() => setShowPasswordModal(false)}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              Change Password
            </h3>

            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}

            <div className="flex flex-col items-center space-y-3 mt-6">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-[80%] text-gray-900 border-gray-300 border-2 rounded-lg px-4 py-2 mb-4"
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-[80%] text-gray-900 border-gray-300 border-2rounded-lg px-4 py-2 mb-4 mt-2"
              />
            </div>

            <div className="w-[80%] mx-auto mt-2">
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === "weak"
                      ? "w-1/3 bg-red-500"
                      : passwordStrength === "normal"
                      ? "w-2/3 bg-yellow-400"
                      : "w-full bg-green-500"
                  }`}
                />
              </div>

              <p
                className={`mt-1 text-sm text-center font-medium ${
                  passwordStrength === "weak"
                    ? "text-red-600"
                    : passwordStrength === "normal"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {passwordStrength.toUpperCase()} PASSWORD
              </p>
            </div>

            <div className="text-gray-900 w-[70%] mx-auto flex items-start gap-2 text-sm mt-3">
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="mt-1"
              />
              <span>
                I accept the{" "}
                <a
                  href="/privacypolicy"
                  target="_blank"
                  className="text-[#8cb662] underline"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                disabled={passwordLoading}
                onClick={() => setShowPasswordModal(false)}
                className="cursor-pointer px-4 py-2 rounded-md bg-gray-300 text-gray-700"
              >
                Cancel
              </button>

              <button
                disabled={
                  passwordLoading ||
                  newPassword !== confirmPassword ||
                  passwordStrength === "weak" ||
                  !acceptPrivacy
                }
                onClick={async () => {
                  setPasswordError(null);

                  if (newPassword !== confirmPassword) {
                    setPasswordError("Passwords do not match.");
                    return;
                  }

                  try {
                    setPasswordLoading(true);

                    await axiosClient.post(
                      "/api/password-change/confirm",
                      {
                        password: newPassword,
                        password_confirmation: confirmPassword,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );

                    setShowPasswordModal(false);
                    alert("Password changed successfully.");

                    setNewPassword("");
                    setConfirmPassword("");
                    setAcceptPrivacy(false);

                  } catch (err: any) {
                    setPasswordError(
                      err.response?.data?.message || "Failed to change password."
                    );
                  } finally {
                    setPasswordLoading(false);
                  }
                }}
                className={`cursor-pointer px-4 py-2 rounded-md text-white ${
                  passwordLoading ||
                  passwordStrength === "weak" ||
                  !acceptPrivacy
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8cb662] hover:bg-[#7ca551]"
                }`}
              >
                {passwordLoading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showSuccessModal && (
        <Modal onClose={() => setShowSuccessModal(false)}>
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-[#8cb662]">
              Email Sent Successfully
            </h3>

            <p className="text-gray-600">
              We’ve sent a verification email to your current email address.
              Please check your inbox to confirm the change.
            </p>

            <p className="text-sm text-gray-400">
              This window will close automatically…
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface NavItem {
  name: string;
  icon: LucideIcon;
  route: string;
}

const Admin_Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [user, setUser] = useState<{
    username: string;
    role: string;
    email: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: LayoutGrid, route: "/admin/dashboard" },
    { name: "Inventory", icon: Package, route: "/admin/dashboard/inventory" },
    { name: "Sales Order", icon: ShoppingCart, route: "/admin/dashboard/salesorder" },
    { name: "Customers", icon: Users, route: "/admin/dashboard/customers" },
    { name: "Events", icon: Calendar, route: "/admin/dashboard/events" },
    { name: "Reports", icon: BarChart2, route: "/admin/dashboard/reports" },
    { name: "Analytics", icon: PieChart, route: "/admin/dashboard/analytics" },
    { name: "Manage Items", icon: Settings, route: "/admin/dashboard/manage-items" },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await axiosClient.get(
        "/api/admin/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications(res.data.data);

      // count unread only
      setUnreadCount(
        res.data.data.filter((n: any) => !n.is_read).length
      );
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axiosClient.post(
        "/admin/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      sessionStorage.clear();
      localStorage.removeItem("token");

      router.visit("/dashboardgetstarted");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* -------------------- CLICK OUTSIDE -------------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- FETCH ADMIN PROFILE -------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axiosClient.get("/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#8cb662] text-white flex flex-col z-50 transition-all duration-500
        ${isSidebarOpen ? "w-64 rounded-r-lg" : "w-20"}`}
      >
        <div className="p-6 flex items-center justify-center border-b border-[#7ca551]">
          <img
            src="\images\MiAmoreLogo.png"
            alt="Mi Amore Logo"
            className={`transition-all duration-300 ${isSidebarOpen ? "h-20" : "h-12"}`}
          />
        </div>

        <nav className="mt-6 flex-grow">
          {isSidebarOpen && (
            <div className="px-6 mb-4 text-sm font-semibold text-white">Menu</div>
          )}

          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-3">
                <a
                  href={item.route}
                  className={`flex items-center py-2 px-5 rounded-l-full transition-all
                  ${
                    window.location.pathname === item.route
                      ? "bg-gray-100 text-[#76B13A]"
                      : "text-white hover:bg-gray-100 hover:text-[#76B13A]"
                  }`}
                >
                  <item.icon size={20} className="mr-4" />
                  {isSidebarOpen && <span className="font-bold">{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main
        className={`flex flex-col h-full transition-all duration-500
        ${isSidebarOpen ? "ml-64" : "ml-20"}`}
        style={{ width: `calc(100% - ${isSidebarOpen ? "16rem" : "5rem"})` }}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-md">
          <div className="flex items-center space-x-4">
            <Menu
              size={24}
              className="text-gray-600 cursor-pointer hover:text-[#76B13A]"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <h1 className="text-xl font-extrabold text-gray-800">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-6" ref={dropdownRef}>
            <div className="relative">
              <Bell
                size={24}
                className="cursor-pointer text-gray-600 hover:text-[#76B13A]"
                onClick={() => setShowNotifications(true)}
              />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </div>

            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src="\images\profile.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />

                {isSidebarOpen && user && (
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">{user.username}</span>
                    <span className="text-gray-500">{user.role}</span>
                  </div>
                )}

                <ChevronDown
                  size={16}
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 animate-fadeIn">
                  <button
                    onClick={() => setIsAccountModalOpen(true)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </button>

                  <div className="border-t border-gray-100"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto w-full">{children}</div>
        </div>
      </main>

      {showNotifications && (
        <div className="absolute right-6 top-16 w-96 bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] z-50 max-h-[420px] overflow-y-auto">
          <div className="p-4 font-semibold text-gray-800 flex justify-between shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <span>Notifications</span>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              There are no new notifications for now...
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 text-sm ${
                    !notification.is_read ? "bg-gray-50" : ""
                  }`}
                >
                  <p className="font-medium text-gray-900">
                    {notification.action} — {notification.subject}
                    {" — "}
                    <span className="text-blue-600">
                      {notification.performed_by}
                    </span>
                  </p>

                  {notification.changed_fields && (
                    <div className="text-xs text-gray-600 mt-1">
                      <p className="font-medium">Modified:</p>
                      {Object.entries(notification.changed_fields).map(
                        ([field, v]: any) => (
                          <p key={field}>
                            • {field}: {String(v.old)} → {String(v.new)}
                          </p>
                        )
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isAccountModalOpen && user && (
        <Modal onClose={() => setIsAccountModalOpen(false)}>
          <AccountSettings
            user={user}
            onEmailUpdated={(email) =>
              setUser((prev) => prev && { ...prev, email })
            }
          />
        </Modal>
      )}
    </div>
  );
};

export default Admin_Navbar;
