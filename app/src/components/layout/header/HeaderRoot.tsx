interface HeaderRootProps {
    title: string;
    subtitle: string;
}

export const HeaderRoot = ({ title, subtitle }: HeaderRootProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <h2 className="text-md text-slate-500">
                    {subtitle}
                </h2>
            </div>
        </div>
    );
};