import { createContext, Dispatch, useContext, useReducer } from "react";
import { Session } from "next-auth";
import { INotification } from "@/services/NotificationService";
import { UserSession } from "@/lib/types/user";
import { Theme } from "@prisma/client";

export type ISiderMenu =
  | "dashboard"
  | "courses"
  | "certifications"
  | "guides"
  | "quiz"
  | "setting"
  | "notification"
  | "users"
  | "content"
  | "addCourseForm"
  | "configuration";

// Define your state type
type AppState = {
  notifications?: INotification[];
  selectedSiderMenu: ISiderMenu;
  session?: UserSession;
  theme?: Theme;
};

// Define your action type
type AppAction =
  | { type: "SET_NOTIFICATION"; payload: INotification[] }
  | { type: "GET_NOTIFICATION"; payload: number }
  | { type: "SET_USER"; payload: UserSession }
  | { type: "SET_SELECTED_SIDER_MENU"; payload: ISiderMenu }
  | { type: "SWITCH_THEME"; payload: Theme };

// Define the initial state
const initialState: AppState = {
  selectedSiderMenu: "dashboard",
};

// Create the context
const AppContext = createContext<{
  globalState: AppState;
  dispatch: Dispatch<AppAction>;
}>({
  globalState: initialState,
  dispatch: () => undefined,
});

// Create a provider component
export const AppProvider: React.FC<{ children: any; themeSwitcher: () => void }> = ({ children, themeSwitcher }) => {
  const [globalState, dispatch] = useReducer((currentState: AppState, action: AppAction) => {
    switch (action.type) {
      case "SET_NOTIFICATION":
        return { ...currentState, notifications: action.payload };
      case "SET_USER":
        return { ...currentState, session: action.payload };
      case "SET_SELECTED_SIDER_MENU":
        return { ...currentState, selectedSiderMenu: action.payload };
      case "SWITCH_THEME":
        themeSwitcher();
        return { ...currentState, theme: action.payload };

      default:
        return currentState;
    }
  }, initialState);

  return <AppContext.Provider value={{ globalState, dispatch }}>{children}</AppContext.Provider>;
};

// Custom hook to access the context
export const useAppContext = () => useContext(AppContext);
