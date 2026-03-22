import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useDeviceFingerprint from "../hooks/useDeviceFingerprint";

const RegisterFlow = () => {
  const [status, setStatus] = useState("checking");
  const [linkCode, setLinkCode] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const fingerprint = useDeviceFingerprint();
  const { register, handleSubmit } = useForm();
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
  } = useForm();

  useEffect(() => {
    const storedUUID = localStorage.getItem("session");
    if (storedUUID && storedUUID !== "null" && storedUUID !== "undefined") {
      sendUUID(storedUUID);
    } else {
      setStatus("new");
    }
  }, []);

  const fetchLinkCode = async (uuid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid }),
        },
      );
      const result = await res.json();
      if (res.ok && result.linkCode) {
        setLinkCode(result.linkCode);
      }
    } catch {
      // failed to fetch link code
    }
  };

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
        setStatus("done");
        fetchLinkCode(uuid);
      } else {
        localStorage.removeItem("session");
        setStatus("new");
      }
    } catch {
      setStatus("new");
    }
  };

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
        fetchLinkCode(result.uuid);
      }
    } catch {
      // registration failed
    }
  };

  const onCodeSubmit = async (data) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/link-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkCode: data.linkCode, deviceId: fingerprint }),
        },
      );
      const result = await res.json();
      if (res.ok && result.uuid) {
        localStorage.setItem("session", result.uuid);
        setStatus("done");
        fetchLinkCode(result.uuid);
      }
    } catch {
      // link code failed
    }
  };

  if (status === "checking") return <p>Checking session...</p>;

  if (status === "done") {
    return (
      <div>
        <p>Authenticated!</p>
        {linkCode && (
          <div>
            <p>Your recovery code: <strong>{linkCode}</strong></p>
            <p><em>use this code in another device</em></p>
          </div>
        )}
      </div>
    );
  }

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

      {!showCodeInput ? (
        <button onClick={() => setShowCodeInput(true)}>I have a code</button>
      ) : (
        <form onSubmit={handleCodeSubmit(onCodeSubmit)}>
          <input
            type="text"
            {...registerCode("linkCode")}
            placeholder="Enter your code"
          />
          <button type="submit" disabled={!fingerprint}>
            Submit Code
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterFlow;
