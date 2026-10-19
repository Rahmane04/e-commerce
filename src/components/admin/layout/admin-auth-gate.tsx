"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/infrastructure/auth/auth-token";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (getAuthToken()) {
      setAllowed(true);
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}
