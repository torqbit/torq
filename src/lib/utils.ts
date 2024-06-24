import appConstant from "@/services/appConstant";

export const getCookieName = () => {
  let cookieName = appConstant.development.cookieName;
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    cookieName = appConstant.production.cookieName;
  }
  return cookieName;
};

export const addDays = function (days: number) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export function createSlug(title: string) {
  return title
    .trim() // Trim whitespace from both sides
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
