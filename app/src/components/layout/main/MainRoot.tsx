export const MainRoot = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex min-h-screen overflow-auto">
            {children}
        </main>
    );
};
