/**
 * Formula B: Neo-Brutalist Button
 *
 * Usage:
 * <NeoButton>Click Me</NeoButton>
 */
export const NeoButton = ({ children, onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`rounded-none border-2 border-black bg-yellow-400 px-6 py-3 text-lg font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${className} `}
        >
            {children}
        </button>
    );
};
