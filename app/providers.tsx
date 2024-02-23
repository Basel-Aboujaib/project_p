// This component wraps the entire application with the ThemeProvider from next-themes,
// enabling the use of themes and providing a default theme of "system",
// which automatically switches between light and dark modes based on the user's system preferences.
// The "attribute" prop is set to "class" to apply the theme class to the document's root element,
// and the "enableSystem" prop is set to true to enable the system theme detection.
// This component ensures that the application's theming is consistent and customizable.
'use client'

import { ThemeProvider } from "next-themes"
import React from "react"

export function Providers({children}: {children: React.ReactNode}) {
    return <ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider>
}