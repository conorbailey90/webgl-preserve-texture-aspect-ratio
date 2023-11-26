function lerp(start, end, t){
    return start * (1 - t) + end * t;
}

class SmoothScroll{
    constructor(el){
        this.el = el;
        this.currentY = 0;
        this.targetY = 0;
        this.setup();
        this.animate()
    }

    setup(){
        document.body.style.height = `${this.el.offsetHeight}px`;
        window.addEventListener('scroll', () => {
            this.targetY = window.scrollY;
        })
    }

    animate(){
        this.currentY = lerp(this.currentY, this.targetY, .1);
        this.el.style.transform = `translate3d(0, -${this.currentY}px, 0)`;
    }
}

export {
    SmoothScroll
}