export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

let isTyping = false;

export function typeWriter(text, element, speed = 50, callback) {
    if (isTyping) return;
    isTyping = true;
    let i = 0;
    element.textContent = '';
    element.classList.remove('typing-complete');

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            isTyping = false;
            element.classList.add('typing-complete');
            if (callback) callback();
        }
    }
    type();
}
