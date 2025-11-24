import React, { useEffect, useRef } from 'react';

const PixelRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        const chars = "1LGRAM01WTF_FUTURE_AI_CYBER_NEON_GLITCH_VOID_NULL_SYSTEM_ERROR";

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '14px "VT323", monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];

                // Random colors
                const random = Math.random();
                if (random > 0.95) ctx.fillStyle = '#ff00ff';
                else if (random > 0.9) ctx.fillStyle = '#fff';
                else ctx.fillStyle = '#00f3ff';

                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1, // Above background, below UI
                opacity: 0.1,
                mixBlendMode: 'screen'
            }}
        />
    );
};

export default PixelRain;
