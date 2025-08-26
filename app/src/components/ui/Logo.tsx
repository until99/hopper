import { CpuIcon } from "@phosphor-icons/react";

export const Logo = ({ size = "md", showText = true }: { size: "sm" | "md" | "lg", showText: boolean }) => {
    const sizes = {
        sm: {
            icon: 24,
            text: "text-lg",
        },
        md: {
            icon: 48,
            text: "text-2xl",
        },
        lg: {
            icon: 64,
            text: "text-3xl",
        },
    };

    const currentSize = sizes[size];

    return (
        <div className={`flex items-center gap-3`}>
            <CpuIcon
                size={currentSize.icon}
                className="rounded-lg bg-blue-500 p-3 text-white"
            />
            {showText && (
                <span className={`font-bold text-slate-900 ${currentSize.text}`}>
                    Hopper
                </span>
            )}
        </div>
    );
};