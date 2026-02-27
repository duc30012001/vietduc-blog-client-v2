/**
 * Formula D: Bento Grid Layout
 *
 * Usage:
 * <BentoGrid>
 *   <BentoItem colSpan={2}>Main Feature</BentoItem>
 *   <BentoItem>Stat 1</BentoItem>
 *   <BentoItem>Stat 2</BentoItem>
 * </BentoGrid>
 */
export const BentoGrid = ({ children, className = '' }) => {
    return (
        <div
            className={`mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-3 ${className}`}
        >
            {children}
        </div>
    );
};

export const BentoItem = ({
    children,
    colSpan = 1,
    rowSpan = 1,
    className = '',
}) => {
    const spans = {
        col:
            colSpan === 2
                ? 'md:col-span-2'
                : colSpan === 3
                  ? 'md:col-span-3'
                  : 'md:col-span-1',
        row: rowSpan === 2 ? 'md:row-span-2' : 'md:row-span-1',
    };

    return (
        <div
            className={` ${spans.col} ${spans.row} group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${className} `}
        >
            <div className="flex h-full w-full flex-col justify-between">
                {children}
            </div>
        </div>
    );
};
