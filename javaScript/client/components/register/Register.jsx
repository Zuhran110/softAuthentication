import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useDeviceFingerprint from "../hooks/useDeviceFingerprint";

const RegisterFlow = () => {
  // "checking" | "new" | "done"
  const [status, setStatus] = useState("checking");
  const fingerprint = useDeviceFingerprint();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const storedUUID = localStorage.getItem("session");
    if (storedUUID && storedUUID !== "null" && storedUUID !== "undefined") {
      sendUUID(storedUUID);
    } else {
      setStatus("new");
    }
  }, []);

  // Returning user: POST only UUID, no name or fingerprint needed
  const sendUUID = async (uuid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid }),
        },
      );
      if (res.ok) {
        console.log("Welcome back", uuid);
        setStatus("done");
      } else {
        // UUID rejected by backend, treat as new user
        localStorage.removeItem("session");
        setStatus("new");
      }
    } catch (err) {
      console.error("UUID check failed", err);
      setStatus("new");
    }
  };

  // New user: POST name + fingerprint, backend returns UUID, store it
  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, deviceId: fingerprint }),
        },
      );
      const result = await res.json();
      if (res.ok && result.uuid) {
        localStorage.setItem("session", result.uuid);
        setStatus("done");
      } else {
        if (res.status === 401) {
          console.error("Name does not match our records");
        } else {
          console.error("Registration failed", result.message);
        }
      }
    } catch (err) {
      console.error("Registration error", err);
    }
  };

  if (status === "checking") return <p>Checking session...</p>;
  if (status === "done") return <p>Authenticated!</p>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("firstName")}
          placeholder="Enter your name"
        />
        <button type="submit" disabled={!fingerprint}>
          {fingerprint ? "Register" : "Loading fingerprint..."}
        </button>
      </form>
    </div>
  );
};

export default RegisterFlow;
