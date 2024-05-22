import { Directive, EventEmitter, Output, OnInit, ElementRef } from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective implements OnInit {

  @Output() swipe = new EventEmitter<any>();
  swipeGesture = {
    name: 'swipe',
    enabled: false,
    interval: 250,
    threshold: 15,
    reportInterval: 'live' as 'live' | 'start' | 'end',
    direction: [] as string[],
  };
  GESTURE_CREATED = false;
  moveTimeout: any = null;
  isMoving = false;
 // lastSwipeReport: number | null = null;
  lastSwipeReport:any = null;

  constructor(
    private gestureCtrl: GestureController,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.swipeGesture.enabled = true;
    this.swipeGesture.direction = ['left', 'right'];
    this.createGesture();
  }

  private createGesture() {
    if (this.GESTURE_CREATED) {
      return;
    }
    const gesture = this.gestureCtrl.create({
      gestureName: 'swipe-gesture',
      el: this.el.nativeElement,
      onStart: () => {
        if (this.swipeGesture.enabled) {
          this.isMoving = true;
          this.moveTimeout = setInterval(() => {
            this.isMoving = false;
          }, 249);
        }
      },
      onMove: ($event: any) => {
        if (this.swipeGesture.enabled) {
          this.handleMoving('moving', $event);
        }
      },
      onEnd: ($event: any) => {
        if (this.swipeGesture.enabled) {
          this.handleMoving('moveend', $event);
        }
      },
    }, true);
    gesture.enable();
    this.GESTURE_CREATED = true;
  }

  private handleMoving(type: 'moving' | 'moveend', $event: any) {
    if (this.moveTimeout !== null) {
      clearTimeout(this.moveTimeout);
      this.moveTimeout = null;
    }
    const deltaX = $event.deltaX;
    const deltaY = $event.deltaY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const reportInterval = this.swipeGesture.reportInterval || 'live';
    const threshold = this.swipeGesture.threshold;
    if (absDeltaX < threshold && absDeltaY < threshold) {
      return;
    }
    const shouldReport = this.isMoving &&
      (
        (reportInterval === 'start' && this.lastSwipeReport === null) ||
        (reportInterval === 'live') ||
        (reportInterval === 'end' && type == 'moveend')
      );
    this.lastSwipeReport = $event.timeStamp;
    if (shouldReport) {
      const emitObj: any = {
        dirX: undefined,
        dirY: undefined,
        swipeType: type === 'moveend' ? 'moveend' : 'moving',
        ...$event,
      };
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          emitObj.dirX = 'right';
        } else if (deltaX < 0) {
          emitObj.dirX = 'left';
        }
      }
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          emitObj.dirY = 'down';
        } else if (deltaY < 0) {
          emitObj.dirY = 'up';
        }
      }
      const dirArray = this.swipeGesture.direction;
      if (dirArray.includes(emitObj.dirX) ||  dirArray.includes(emitObj.dirY)) {
         this.swipe.emit(emitObj);
      }
    }
    if ((type == 'moveend' && this.lastSwipeReport !== null)) {
      this.isMoving = false;
      this.lastSwipeReport = null;
    }
  }
  

}