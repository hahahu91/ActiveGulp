import {ANIMATION_DURATION, ANIMATE_DY}  from './constants.js';

export class Animation {
    constructor(item, fn = (x) => x) {
        this._item = item;
        this._currentAnimation = null;
        this._baseProgress = null;
        this._activationTimestamp = null;
        this._duration = null;
        this._isAnimation = false;
        this._fnAnimate = fn;
    }
    getCurAnimate() {
        return this._currentAnimation;
    }
    isAnimation() {
        return this._isAnimation;
    }
    activate() {
        this.createAnimation(true);
    }
    deactivate() {
        this.createAnimation(false);
    }
    createAnimation(isActive) {
       this._baseProgress = this._item.isActive()
           ? (1 - this._currentAnimation / ANIMATE_DY)
           : (this._currentAnimation / ANIMATE_DY);
        this._duration = ANIMATION_DURATION * (1 - this._baseProgress);
        this._activationTimestamp = performance.now(); 
        this._isAnimation = true;
    }
    animate() {
        const start = performance.now();
        if (this._duration > 0) {
            const timeFraction = (start - this._activationTimestamp ) / ANIMATION_DURATION;
            this._duration = ANIMATION_DURATION * ((1 - this._baseProgress) - timeFraction); 
            const progress = timeFraction + this._baseProgress;
            this._currentAnimation = this._item.isActive()
                ? this._fnAnimate(progress) * ANIMATE_DY
                : ANIMATE_DY - this._fnAnimate(progress)  * ANIMATE_DY;
            if (this._currentAnimation < 0) this._currentAnimation = 0; 
        }
        else {
            this._duration = 0;
            this._isAnimation = false;
        }
    }
}
