import FingerPrintJS from "@fingerprintjs/fingerprintjs";
import { useEffect, useState } from "react";

const useDeviceFingerprint = (): string | null => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const getFingerprint = async () => {
    const fp = await FingerPrintJS.load();
    const result = await fp.get();
    setFingerprint(result.visitorId);
  };

  useEffect(() => {
    getFingerprint();
  }, []);
  return fingerprint;
};

export default useDeviceFingerprint;
