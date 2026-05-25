import '../ui/base.scss';
import '../ui/global.css';
import {roboto} from '../ui/fonts';
import Providers from './providers';

export const metadata = {
    manifest: '/manifest.json',
    themeColor: '#000000',
    icons: {
        apple: '/icons/icon-192x192.png',
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${roboto.className} antialiased`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}