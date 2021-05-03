/**
 * Animate
 *
 * Methods:
 * - run(node|selector, animation, [duration], [prefix])
 */
class Animate {
    run(element, animation, duration = '0.3s', prefix = '') {
        return new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = typeof element == 'string' ? document.querySelector(element) : element;

            node.style.setProperty('--animate-duration', duration);
            node.style.setProperty('animation-duration', duration);
            node.classList.add(`${prefix}animated`, animationName);

            function handleAnimationEnd() {
                node.classList.remove(`${prefix}animated`, animationName);
                resolve('Animation ended');
            }

            node.addEventListener('animationend', handleAnimationEnd, {once: true});
        })
    }
}

export default Animate;
