// Tailwind configuration for custom colors and Apple animation curves
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                appleBlue: {
                    light: '#0071e3',
                    dark: '#2997ff',
                },
                bg: {
                    light: '#fbfbfd',
                    dark: '#000000',
                },
                card: {
                    light: '#ffffff',
                    dark: '#1d1d1f',
                },
                text: {
                    light: '#1d1d1f',
                    dark: '#f5f5f7',
                },
                muted: {
                    light: '#86868b',
                    dark: '#86868b',
                }
            },
            transitionTimingFunction: {
                'apple-ease': 'cubic-bezier(0.25, 1, 0.5, 1)',
            },
            transitionDuration: {
                '400': '400ms',
            }
        }
    }
}