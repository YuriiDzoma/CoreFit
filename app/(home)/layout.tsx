import React from "react";
import HomeLayout from "./homeLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <HomeLayout>{children}</HomeLayout>;
}
