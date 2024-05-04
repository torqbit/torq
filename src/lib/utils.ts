import appConstant from "@/services/appConstant";

export const getCookieName = () => {
  let cookieName = appConstant.development.cookieName;
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    cookieName = appConstant.production.cookieName;
  }
  return cookieName;
};
