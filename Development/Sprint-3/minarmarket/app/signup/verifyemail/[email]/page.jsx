"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyEmail({ params }) {
  const router = useRouter();
  const email = decodeURIComponent(params.email); // Extract email from the URL
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    sendOtp(); // Automatically send OTP when the page loads
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const sendOtp = async () => {
    try { 
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('otp', otp)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (data.success) {
        alert("OTP sent successfully to " + email);
        setTimer(60);
        setCanResend(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join(""); // Get user-entered OTP from state
    const storedOtp = sessionStorage.getItem("otp"); // Retrieve stored OTP

    if (!storedOtp) {
        setError("No OTP found. Please request a new OTP.");
        return;
    }

    if (enteredOtp === storedOtp) {
        alert("OTP verified successfully!");
        const signupdataa = sessionStorage.getItem("signupdata");
        const signupdata = JSON.parse(signupdataa);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/signup-post`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupdata),
          })
          const data = await response.json()
          if (!data.success) {
            throw new Error(data.message)
          }
        sessionStorage.removeItem("signupdata");
        router.push('/app/dashboard');
        


    } else {
        setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
      <p className="text-sm text-gray-600 mb-2">
        Enter the 6-digit OTP sent to <strong>{email}</strong>
      </p>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-2 my-4">
        {otp.map((digit, index) => (
          <Input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            className="w-12 text-center text-xl"
          />
        ))}
      </div>

      <Button onClick={verifyOtp} className="w-full bg-blue-600 hover:bg-blue-700">
        Verify OTP
      </Button>

      <div className="mt-4 text-sm">
        <p>
          Resend OTP in <span className="text-blue-500">{timer}s</span>
        </p>
        <Button
          onClick={sendOtp}
          disabled={!canResend}
          className={`mt-2 ${canResend ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
