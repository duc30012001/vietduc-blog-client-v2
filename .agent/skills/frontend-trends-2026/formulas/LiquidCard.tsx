/**
 * Formula A: Liquid Glass Card
 *
 * Usage:
 * <LiquidCard>
 *   <h2>Glass Ethereal</h2>
 *   <p>Content floats on a blurred surface.</p>
 * </LiquidCard>
 */
export const LiquidCard = ({ children, className = '' }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:scale-[1.02] dark:border-white/10 dark:bg-black/20 ${className} `}
        >
            {/* Noise Texture Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

            {/* Content */}
            <div className="relative z-10 text-slate-800 dark:text-slate-100">
                {children}
            </div>
        </div>
    );
};
