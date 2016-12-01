import {Ref} from './ref'
import {SketchObject} from './sketch-object'
import {EllipseTool, STATE_RADIUS} from '../tools/ellipse'

import * as math from '../../math/math';

export class Ellipse extends SketchObject {

  constructor(ep1, ep2) {
    super();
    this.ep1 = ep1;
    this.ep2 = ep2;
    this.addChild(this.ep1);
    this.addChild(this.ep2);
    this.r = new Ref(0);
    this.r.value = this.radiusX * 0.5;
    this.r.obj = this;
  }

  get rotation() {
    return Math.atan2(this.ep2.y - this.ep1.y, this.ep2.x - this.ep1.x);
  }

  get radiusX() {
    return math.distance(this.ep1.x, this.ep1.y, this.ep2.x, this.ep2.y) * 0.5;
  }

  get radiusY() {
    return this.r.get();
  }

  get centerX() {
    return this.ep1.x + (this.ep2.x - this.ep1.x) * 0.5; 
  }

  get centerY() {
    return this.ep1.y + (this.ep2.y - this.ep1.y) * 0.5;
  }

  drawImpl(ctx, scale) {
    ctx.beginPath();
    ctx.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, this.rotation, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  toEllipseCoordinateSystem(point) {
    let x = point.x - this.centerX;
    let y = point.y - this.centerY;
    const angle = Math.atan2(y, x) - this.rotation;
    const radius = math.distance(0, 0, x, y);
    x = radius * Math.cos(angle);
    y = radius * Math.sin(angle);
    return {x, y, angle, radius};
  }
  
  normalDistance(aim) {
    const polarPoint = this.toEllipseCoordinateSystem(aim);
    const L = Math.sqrt(1/( sq(Math.cos(polarPoint.angle)/this.radiusX) + sq(Math.sin(polarPoint.angle)/this.radiusY)));
    return Math.abs(polarPoint.radius - L);
  }
  
  static findMinorRadius(majorRadius, pntRadius, pntAngle) {
    return Math.abs( Math.sin(pntAngle) /  Math.sqrt(1 / sq(pntRadius) - sq(Math.cos(pntAngle) / majorRadius)) );
  }

  getDefaultTool(viewer, alternative) {
    if (alternative) {
      return super.getDefaultTool(viewer, alternative);  
    } else {
      const editTool = new EllipseTool(viewer);
      editTool.ellipse = this;
      editTool.state = STATE_RADIUS;
      return editTool;
    }
  }
}
Ellipse.prototype._class = 'TCAD.TWO.Ellipse';

const sq = (a) => a * a;