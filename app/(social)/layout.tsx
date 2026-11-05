import React from "react";
import SocialLayout from "./socialLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <SocialLayout>{children}</SocialLayout>;
}
