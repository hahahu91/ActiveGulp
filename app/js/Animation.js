import {ANIMATION_DURATION, ANIMATE_DY}  from './constants.js';
import {TimingFunctions} from './TimingFunctions.js';
export class Animation {
    constructor(item, fn = TimingFunctions.linear) {
        this._item = item;
        this._currentAnimation = null;
        this._baseProgress = null;
        this._activationTimestamp = null;
        this._duration = null;
        this._isAnimation = false;
        this._timingFn = fn;
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
            const progress = timeFraction + this._baseProgress;
            
            this._duration = ANIMATION_DURATION * ((1 - this._baseProgress) - timeFraction); 
            this._currentAnimation = this._item.isActive()
                ? this._timingFn(progress) * ANIMATE_DY
                : ANIMATE_DY - this._timingFn(progress)  * ANIMATE_DY;
            this._currentAnimation = Math.max(this._currentAnimation, 0);
            this._currentAnimation = Math.min(this._currentAnimation, ANIMATE_DY);
        }
        else {
            this._duration = 0;
            this._isAnimation = false;
        }
    }
}
