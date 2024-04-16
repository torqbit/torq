import { createContext, Dispatch, useContext, useReducer } from "react";
import { INotification } from "../Header/Header";
import { Session } from "next-auth";

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
  user?: Session;
};

// Define your action type
type AppAction =
  | { type: "SET_NOTIFICATION"; payload: INotification[] }
  | { type: "GET_NOTIFICATION"; payload: number }
  | { type: "SET_USER"; payload: Session }
  | { type: "SET_SELECTED_SIDER_MENU"; payload: ISiderMenu };

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
export const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [globalState, dispatch] = useReducer((currentState: AppState, action: AppAction) => {
    switch (action.type) {
      case "SET_NOTIFICATION":
        return { ...currentState, notifications: action.payload };
      case "SET_USER":
        return { ...currentState, user: action.payload };
      case "SET_SELECTED_SIDER_MENU":
        return { ...currentState, selectedSiderMenu: action.payload };
      default:
        return currentState;
    }
  }, initialState);

  return <AppContext.Provider value={{ globalState, dispatch }}>{children}</AppContext.Provider>;
};

// Custom hook to access the context
export const useAppContext = () => useContext(AppContext);
