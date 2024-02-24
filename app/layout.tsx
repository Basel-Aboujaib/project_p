import { Providers } from "./providers";
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body className="dark:bg-slate-900 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
				<div className="w-full dark:text-white">
					<Providers>
						{children}
					</Providers>
				</div>
			</body>
		</html>
	);
}