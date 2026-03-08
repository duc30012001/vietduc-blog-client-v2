export function ThemeScript() {
    const script = `
(function() {
    try {
        var theme = localStorage.getItem('theme') || 'system';
        var isDark = theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {}
})();
`;

    return (
        <script
            dangerouslySetInnerHTML={{ __html: script }}
            suppressHydrationWarning
        />
    );
}
