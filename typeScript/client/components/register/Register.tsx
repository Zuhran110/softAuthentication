import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import useDeviceFingerprint from "../hooks/useDeviceFingerprint";
import type { JSX } from "react";

type Status = "checking" | "new" | "done";

interface RegisterFromData {
  firstName: string;
}

interface CodeFormData {
  linkCode: string;
}

interface APIResponse {
  uuid?: string;
  linkCode?: string;
  message?: string;
}

const RegisterFlow = (): JSX.Element => {
  const [status, setStatus] = useState<Status>("checking");
  const [linkCode, setLinkCode] = useState<string | null>(
    localStorage.getItem("linkCode"),
  );

  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fingerprint: string | null = useDeviceFingerprint();
  const { register, handleSubmit } = useForm<RegisterFromData>();
  const { register: registerCode, handleSubmit: handleCodeSubmit } =
    useForm<CodeFormData>();

  useEffect(() => {
    const storedUUID = localStorage.getItem("session");
    if (storedUUID && storedUUID !== "null" && storedUUID !== "undefined") {
      sendUUID(storedUUID);
    } else {
      setStatus("new");
    }
  }, []);

  // Returning user: POST only UUID, no name or fingerprint needed
  const sendUUID = async (uuid: string): Promise<void> => {
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
        localStorage.removeItem("session");
        setStatus("new");
      }
    } catch (err) {
      console.error("UUID check failed", err);
      setStatus("new");
    }
  };

  // New user: POST name + fingerprint, backend returns UUID, store it
  const onSubmit: SubmitHandler<RegisterFromData> = async (
    data,
  ): Promise<void> => {
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
        localStorage.setItem("firstName", data.firstName);
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

  // Generate link code for authenticated user
  const generateCode = async (): Promise<void> => {
    setError(null);
    try {
      const uuid = localStorage.getItem("session");
      if (!uuid) {
        setError("No session found. Please register again.");
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid }),
        },
      );
      const result: APIResponse = await res.json();
      if (res.ok && result.linkCode) {
        setLinkCode(result.linkCode);
        localStorage.setItem("linkCode", result.linkCode);
      } else {
        setError(result.message || "Failed to generate code");
      }
    } catch (err) {
      setError("Network error. Is the server running?");
      console.error("Generate code error", err);
    }
  };

  // Authenticate using a link code on a new device
  const onCodeSubmit: SubmitHandler<CodeFormData> = async (
    data,
  ): Promise<void> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/link-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            linkCode: data.linkCode,
            deviceId: fingerprint,
          }),
        },
      );
      const result = await res.json();
      if (res.ok && result.uuid) {
        localStorage.setItem("session", result.uuid);
        setStatus("done");
      } else {
        console.error("Invalid code", result.message);
      }
    } catch (err) {
      console.error("Link code error", err);
    }
  };

  if (status === "checking") return <p>Checking session...</p>;

  if (status === "done") {
    return (
      <div>
        <p>Authenticated!</p>
        {linkCode ? (
          <p>
            Your code: <strong>{linkCode}</strong>
          </p>
        ) : (
          <>
            <button onClick={generateCode}>Get My Code</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
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
