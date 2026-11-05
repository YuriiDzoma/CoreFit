import { createContext, useContext } from "react";

// True inside the 1200+ two-column Friends layout (socialLayout.tsx). The
// route pages render AllFriends/Requests/UserList with no props, so the
// layout signals the column mode through context: no page title (the
// column's tabs or heading stand in) and one row per line.
export const SocialColumnsContext = createContext(false);

export const useInSocialColumns = () => useContext(SocialColumnsContext);
