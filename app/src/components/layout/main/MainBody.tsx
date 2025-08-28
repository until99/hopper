import { Navbar } from "../navbar/Navbar"

export const MainBody = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col w-full">
            <Navbar />
            {children}
        </div>
    )
}