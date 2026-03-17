export const metadata = {
    title: 'Deploy Dashboard',
    robots: 'noindex, nofollow',
};

export default function DeployLayout({ children }) {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#1a1a2e',
            color: '#e0e0e0',
            overflow: 'auto',
            zIndex: 9999,
        }}>
            {children}
        </div>
    );
}
