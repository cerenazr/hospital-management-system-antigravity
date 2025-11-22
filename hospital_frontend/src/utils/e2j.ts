export const initMouseLogger = () => {
    // Create custom cursor if it doesn't exist
    let cursor = document.getElementById('custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        cursor.style.pointerEvents = 'none'; // Pass through clicks
        cursor.style.zIndex = '9999';
        cursor.style.transition = 'transform 0.1s ease';
        document.body.appendChild(cursor);
    }

    // Initialize global log array
    if (!(window as any).mouseLogs) {
        (window as any).mouseLogs = [];
    }

    // Mouse move listener
    const handleMouseMove = (e: MouseEvent) => {
        // Update cursor position
        if (cursor) {
            cursor.style.left = `${e.clientX - 10}px`;
            cursor.style.top = `${e.clientY - 10}px`;
        }

        // Log position
        (window as any).mouseLogs.push({
            time: Date.now(),
            x: e.clientX,
            y: e.clientY
        });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function (optional, if needed)
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (cursor && cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }
    };
};
