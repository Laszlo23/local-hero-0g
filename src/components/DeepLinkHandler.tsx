import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { parseDeepLinkToRoute } from "@/lib/deepLink";

/**
 * Native deep-link bridge:
 * - handles appUrlOpen events (localhero://..., https app links)
 * - navigates to safe in-app routes only
 */
const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let active = true;

    const applyUrl = (url: string) => {
      const route = parseDeepLinkToRoute(url);
      try {
        localStorage.setItem(
          "mobile_debug_last_deeplink",
          JSON.stringify({
            url,
            route,
            at: new Date().toISOString(),
          })
        );
      } catch {
        // ignore storage failures
      }
      if (route && active) navigate(route);
    };

    CapacitorApp.getLaunchUrl()
      .then((res) => {
        if (res?.url) applyUrl(res.url);
      })
      .catch(() => {});

    const listenerPromise = CapacitorApp.addListener("appUrlOpen", ({ url }) => {
      if (url) applyUrl(url);
    });

    return () => {
      active = false;
      void listenerPromise.then((h) => h.remove()).catch(() => {});
    };
  }, [navigate]);

  return null;
};

export default DeepLinkHandler;

