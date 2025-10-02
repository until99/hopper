interface LabelRootProps {
    innerText: string;
    bgColor: "purple" | "red" | "green" | "blue" | "yellow" | "orange" | "gray" | "pink" | "lime" | "cyan" | "indigo" | "brown" | "teal" | "custom";
}

// Mapeamento de classes para garantir que o Tailwind inclua essas classes no CSS final
const colorClasses = {
    purple: "bg-purple-300 text-purple-800",
    red: "bg-red-300 text-red-800",
    green: "bg-green-300 text-green-800",
    blue: "bg-blue-300 text-blue-800",
    yellow: "bg-yellow-300 text-yellow-800",
    orange: "bg-orange-300 text-orange-800",
    gray: "bg-gray-300 text-gray-800",
    pink: "bg-pink-300 text-pink-800",
    lime: "bg-lime-300 text-lime-800",
    cyan: "bg-cyan-300 text-cyan-800",
    indigo: "bg-indigo-300 text-indigo-800",
    brown: "bg-amber-300 text-amber-800", // Tailwind não tem brown, usando amber
    teal: "bg-teal-300 text-teal-800",
    custom: "bg-slate-300 text-slate-800", // Fallback para custom
} as const;

export const LabelRoot = ({ innerText, bgColor }: LabelRootProps) => {
    const colorClass = colorClasses[bgColor] || colorClasses.custom;

    return (
        <label className={`rounded-full px-4 py-0.5 text-sm font-semibold ${colorClass}`}>
            {innerText}
        </label>
    );
};
