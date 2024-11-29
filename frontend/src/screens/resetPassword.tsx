import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/routes";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [pass, setPass] = useState("");
  const [repass, setRePass] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For button loading
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      alert("No reset token provided");
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/auth/verifyResetToken/${id}`,
          {
            method: "GET",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Invalid or expired token");
          navigate("/login");
        } else {
          setEmail(result.email);
        }
      } catch (err) {
        setError("Failed to verify token. Please try again later.");
        navigate("/login");
      }
    };

    verifyToken();
  }, [id, navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass !== repass) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/updateforgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: id, newPassword: pass }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password reset successfully");
        navigate("/login");
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-black">
      <div className="flex flex-col items-center justify-center mx-auto min-h-[500px] lg:py-0">
        <div className="w-full rounded-lg shadow sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">
              Reset Password
            </h1>
            {email && (
              <p className="leading-tight tracking-tight text-white">
                Email: {email}
              </p>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <form className="space-y-4" onSubmit={handlePasswordReset}>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="block text-white text-sm font-bold mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="confirm-password"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  required
                  value={repass}
                  onChange={(e) => setRePass(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
