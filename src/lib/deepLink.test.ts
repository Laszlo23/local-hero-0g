import { describe, expect, it } from "vitest";
import { parseDeepLinkToRoute } from "./deepLink";

describe("deep link parser", () => {
  it("parses custom scheme app route", () => {
    expect(parseDeepLinkToRoute("localhero://app/redeem")).toBe("/app/redeem");
  });

  it("parses custom scheme with query", () => {
    expect(parseDeepLinkToRoute("localhero://app/ar?quest=park-nature-walk")).toBe(
      "/app/ar?quest=park-nature-walk"
    );
  });

  it("parses universal link route", () => {
    expect(parseDeepLinkToRoute("https://app.localhero.space/report-spot")).toBe("/report-spot");
  });

  it("parses redirectTo query route", () => {
    expect(
      parseDeepLinkToRoute("https://app.localhero.space/auth/callback?redirectTo=/app/redeem")
    ).toBe("/app/redeem");
  });

  it("parses hash route", () => {
    expect(parseDeepLinkToRoute("https://app.localhero.space/#/app/ar?quest=park-nature-walk")).toBe(
      "/app/ar?quest=park-nature-walk"
    );
  });

  it("rejects unknown/unsafe route", () => {
    expect(parseDeepLinkToRoute("localhero://evil/path")).toBeNull();
  });
});

