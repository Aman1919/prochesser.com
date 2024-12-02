import { useState } from "react";
import { BACKEND_URL } from "../constants/routes";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      setSuccessMessage(
        data.message || "Password reset email sent successfully"
      );
      setEmail("");
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-black w-full min-h-[500px] flex items-center justify-center">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 pt-5 bg-black shadow-lg w-full max-w-md m-auto xl:p-6 rounded-lg">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-yellow-400 md:text-2xl">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-200"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            className={`w-full text-white bg-yellow-600 mt-6 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Forgot Password"}
          </button>
        </form>

        <p className="text-sm font-light mt-2 flex gap-2 text-white dark:text-gray-400">
          Already Have an Account?
          <a
            href="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Log In
          </a>
        </p>
      </div>
    </section>
  );
}
