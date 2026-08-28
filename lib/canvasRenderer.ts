/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
import {
  Layer,
  BrushStroke,
  TextProperties,
  ShapeProperties,
  Adjustments,
  Point,
  RetouchMode,
  ToneCurvesState,
  ColorWheelsState,
  HslColorState,
  OpticalVfxState,
  SplitCompareState,
  LayerStyleEffects,
} from "@/types/editor";
import {
  applyCanvasAdjustments,
  getCssFilterString,
  applyToneCurves,
  applyColorWheels,
  applyHslAdjustment,
  applyOpticalVfx,
} from "./filters";

export class CanvasRenderer {
  /**
   * Render all layers onto the main context
   */
  static renderScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    layers: Layer[],
    globalAdjustments: Adjustments,
    currentVideoTime?: number,
    options?: {
      renderSelectionOutline?: boolean;
      selectedLayerId?: string | null;
      toneCurves?: ToneCurvesState;
      colorWheels?: ColorWheelsState;
      hslState?: HslColorState;
      opticalVfx?: OpticalVfxState;
      splitCompare?: SplitCompareState;
    }
  ) {
    ctx.clearRect(0, 0, width, height);

    // If Split Compare mode is active, render unadjusted original to an offscreen canvas
    let rawCanvas: HTMLCanvasElement | null = null;
    if (options?.splitCompare?.active) {
      rawCanvas = document.createElement('canvas');
      rawCanvas.width = width;
      rawCanvas.height = height;
      const rawCtx = rawCanvas.getContext('2d');
      if (rawCtx) {
        rawCtx.fillStyle = '#14171d';
        rawCtx.fillRect(0, 0, width, height);
        for (const layer of layers) {
          if (!layer.visible) continue;
          rawCtx.save();
          rawCtx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
          rawCtx.globalCompositeOperation = layer.blendMode || 'source-over';
          const cx = layer.x + layer.width / 2;
          const cy = layer.y + layer.height / 2;
          rawCtx.translate(cx, cy);
          if (layer.rotation) rawCtx.rotate((layer.rotation * Math.PI) / 180);
          rawCtx.scale(layer.scaleX || 1, layer.scaleY || 1);
          rawCtx.translate(-layer.width / 2, -layer.height / 2);
          if (layer.type === 'image' && layer.imageElement) {
            rawCtx.drawImage(layer.imageElement, 0, 0, layer.width, layer.height);
          } else if (layer.type === 'video' && layer.videoElement) {
            try {
              rawCtx.drawImage(layer.videoElement, 0, 0, layer.width, layer.height);
            } catch {}
          } else if (layer.type === 'text') {
            this.renderTextLayer(rawCtx, layer, currentVideoTime);
          } else if (layer.type === 'shape') {
            this.renderShapeLayer(rawCtx, layer);
          } else if (layer.type === 'drawing') {
            this.renderDrawingLayer(rawCtx, layer);
          }
          rawCtx.restore();
        }
      }
    }

    // 1. Draw background checkerboard / dark canvas base
    ctx.fillStyle = '#14171d';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw each visible layer in order from bottom to top
    for (const layer of layers) {
      if (!layer.visible) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
      ctx.globalCompositeOperation = layer.blendMode || 'source-over';

      // Setup layer transform matrix
      const cx = layer.x + layer.width / 2;
      const cy = layer.y + layer.height / 2;

      ctx.translate(cx, cy);
      if (layer.rotation) {
        ctx.rotate((layer.rotation * Math.PI) / 180);
      }
      ctx.scale(layer.scaleX || 1, layer.scaleY || 1);
      ctx.translate(-layer.width / 2, -layer.height / 2);

      // Apply Layer Styles (Drop Shadow, Outer Glow)
      this.applyLayerStylesBefore(ctx, layer.styles);

      // Render specific layer type
      switch (layer.type) {
        case 'image':
          this.renderImageLayer(ctx, layer);
          break;
        case 'video':
          this.renderVideoLayer(ctx, layer, currentVideoTime);
          break;
        case 'text':
          this.renderTextLayer(ctx, layer, currentVideoTime);
          break;
        case 'shape':
          this.renderShapeLayer(ctx, layer);
          break;
        case 'drawing':
          this.renderDrawingLayer(ctx, layer);
          break;
      }

      // Apply Outline Stroke layer style
      this.applyLayerStylesAfter(ctx, layer);

      ctx.restore();
    }

    // 3. Apply Global Color Grading & Adjustments Pipeline
    applyCanvasAdjustments(ctx, width, height, globalAdjustments);

    // 4. Apply Tone Curves LUT (Spline RGBA)
    if (options?.toneCurves?.enabled) {
      applyToneCurves(ctx, width, height, options.toneCurves);
    }

    // 5. Apply 3-Way Color Wheels (Lift / Gamma / Gain)
    if (options?.colorWheels?.enabled) {
      applyColorWheels(ctx, width, height, options.colorWheels);
    }

    // 6. Apply 8-Channel Selective HSL Color Adjustment
    if (options?.hslState?.enabled) {
      applyHslAdjustment(ctx, width, height, options.hslState);
    }

    // 7. Apply Optical VFX / Flares / Scanlines
    if (options?.opticalVfx?.enabled) {
      applyOpticalVfx(ctx, width, height, options.opticalVfx);
    }

    // 8. Split-Screen Before / After Comparison Wipe
    if (options?.splitCompare?.active && rawCanvas) {
      const splitX = Math.round(width * Math.max(0.01, Math.min(0.99, options.splitCompare.position)));
      
      ctx.save();
      // Clip left half to show original raw unedited image
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      ctx.drawImage(rawCanvas, 0, 0);
      ctx.restore();

      // Draw high-contrast divider bar and badge
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();

      // Divider Handle Circle
      ctx.beginPath();
      ctx.arc(splitX, height / 2, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Split labels
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(splitX - 65, 16, 55, 22);
      ctx.fillRect(splitX + 10, 16, 55, 22);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('BEFORE', splitX - 37, 32);
      ctx.fillText('AFTER', splitX + 37, 32);
      ctx.restore();
    }

    // 9. Draw transform bounding box for selected layer
    if (options?.renderSelectionOutline && options.selectedLayerId) {
      const selected = layers.find(l => l.id === options.selectedLayerId && l.visible);
      if (selected) {
        this.renderTransformHandles(ctx, selected);
      }
    }
  }

  /**
   * Apply Layer Style Drop Shadow & Outer Glow
   */
  private static applyLayerStylesBefore(ctx: CanvasRenderingContext2D, styles?: LayerStyleEffects) {
    if (!styles) return;

    if (styles.dropShadow?.enabled) {
      ctx.shadowColor = styles.dropShadow.color || 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = styles.dropShadow.blur || 12;
      ctx.shadowOffsetX = styles.dropShadow.offsetX || 4;
      ctx.shadowOffsetY = styles.dropShadow.offsetY || 6;
    } else if (styles.outerGlow?.enabled) {
      ctx.shadowColor = styles.outerGlow.color || '#38bdf8';
      ctx.shadowBlur = styles.outerGlow.blur || 18;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }

  /**
   * Apply Layer Style Outline Stroke
   */
  private static applyLayerStylesAfter(ctx: CanvasRenderingContext2D, layer: Layer) {
    const styles = layer.styles;
    if (!styles?.strokeOutline?.enabled || !styles.strokeOutline.width) return;

    ctx.save();
    ctx.strokeStyle = styles.strokeOutline.color || '#ffffff';
    ctx.lineWidth = styles.strokeOutline.width;
    ctx.strokeRect(0, 0, layer.width, layer.height);
    ctx.restore();
  }

  /**
   * Render Image Layer
   */
  static renderImageLayer(ctx: CanvasRenderingContext2D, layer: Layer) {
    if (!layer.imageElement) {
      if (layer.imageUrl) {
        // Fallback fill
        ctx.fillStyle = '#2a2e39';
        ctx.fillRect(0, 0, layer.width, layer.height);
      }
      return;
    }

    if (layer.adjustments) {
      ctx.filter = getCssFilterString(layer.adjustments);
    }

    ctx.drawImage(layer.imageElement, 0, 0, layer.width, layer.height);
    ctx.filter = 'none';

    if (layer.adjustments) {
      applyCanvasAdjustments(ctx, layer.width, layer.height, layer.adjustments);
    }
  }

  /**
   * Render Video Layer
   */
  static renderVideoLayer(
    ctx: CanvasRenderingContext2D,
    layer: Layer,
    currentVideoTime?: number
  ) {
    if (!layer.videoElement) {
      ctx.fillStyle = '#1e222b';
      ctx.fillRect(0, 0, layer.width, layer.height);
      return;
    }

    if (layer.adjustments) {
      ctx.filter = getCssFilterString(layer.adjustments);
    }

    try {
      ctx.drawImage(layer.videoElement, 0, 0, layer.width, layer.height);
    } catch {
      // Catch cross-origin / video readyState errors gracefully
    }
    ctx.filter = 'none';

    if (layer.adjustments) {
      applyCanvasAdjustments(ctx, layer.width, layer.height, layer.adjustments);
    }
  }

  /**
   * Render Text Layer with advanced styling, shadows, arc, background pill
   */
  static renderTextLayer(
    ctx: CanvasRenderingContext2D,
    layer: Layer,
    currentTime?: number
  ) {
    const props = layer.textProps;
    if (!props || !props.text) return;

    // Check video timing visibility if specified
    if (
      currentTime !== undefined &&
      props.startTime !== undefined &&
      props.endTime !== undefined
    ) {
      if (currentTime < props.startTime || currentTime > props.endTime) {
        return; // out of time range for this subtitle/overlay
      }
    }

    ctx.save();

    let displayText = props.text;
    if (props.textTransform === 'uppercase') {
      displayText = displayText.toUpperCase();
    } else if (props.textTransform === 'lowercase') {
      displayText = displayText.toLowerCase();
    }

    const fontStyle = props.fontStyle || 'normal';
    const fontWeight = props.fontWeight || '700';
    const fontSize = props.fontSize || 48;
    const fontFamily = props.fontFamily || 'Inter, sans-serif';

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = props.textAlign || 'center';
    ctx.textBaseline = 'middle';

    const cx = layer.width / 2;
    const cy = layer.height / 2;

    // Background capsule / pill
    if (props.backgroundPill) {
      ctx.save();
      const metrics = ctx.measureText(displayText);
      const padH = props.backgroundPadding || 24;
      const padV = (props.backgroundPadding || 24) * 0.55;
      const pillW = metrics.width + padH * 2;
      const pillH = fontSize + padV * 2;
      const pillX = cx - pillW / 2;
      const pillY = cy - pillH / 2;

      ctx.fillStyle = props.backgroundColor || 'rgba(0,0,0,0.75)';
      ctx.beginPath();
      const rad = Math.min(pillH / 2, 16);
      ctx.roundRect(pillX, pillY, pillW, pillH, rad);
      ctx.fill();
      ctx.restore();
    }

    // Shadow
    if (props.shadowBlur > 0 || props.shadowOffsetX !== 0 || props.shadowOffsetY !== 0) {
      ctx.shadowColor = props.shadowColor || 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = props.shadowBlur || 8;
      ctx.shadowOffsetX = props.shadowOffsetX || 2;
      ctx.shadowOffsetY = props.shadowOffsetY || 4;
    }

    // Arc / Curved text support
    if (props.arcAngle && Math.abs(props.arcAngle) > 2) {
      const radius = (layer.width * 180) / (Math.PI * Math.abs(props.arcAngle));
      const charAngle = (props.arcAngle * (Math.PI / 180)) / Math.max(1, displayText.length);
      const startAngle = -(props.arcAngle * (Math.PI / 180)) / 2;

      ctx.save();
      ctx.translate(cx, cy + (props.arcAngle > 0 ? radius : -radius));
      for (let i = 0; i < displayText.length; i++) {
        const char = displayText[i];
        const angle = startAngle + i * charAngle;
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, props.arcAngle > 0 ? -radius : radius);

        if (props.strokeWidth > 0) {
          ctx.strokeStyle = props.strokeColor;
          ctx.lineWidth = props.strokeWidth;
          ctx.strokeText(char, 0, 0);
        }

        ctx.fillStyle = props.fillColor || '#ffffff';
        ctx.fillText(char, 0, 0);
        ctx.restore();
      }
      ctx.restore();
    } else {
      // Normal multi-line or single-line text
      const lines = displayText.split('\n');
      const lineH = fontSize * (props.lineHeight || 1.25);
      const startY = cy - ((lines.length - 1) * lineH) / 2;

      lines.forEach((line, idx) => {
        const y = startY + idx * lineH;

        if (props.strokeWidth > 0) {
          ctx.strokeStyle = props.strokeColor || '#000000';
          ctx.lineWidth = props.strokeWidth;
          ctx.strokeText(line, cx, y);
        }

        ctx.fillStyle = props.fillColor || '#ffffff';
        ctx.fillText(line, cx, y);
      });
    }

    ctx.restore();
  }

  /**
   * Render Vector Shape Layer
   */
  static renderShapeLayer(ctx: CanvasRenderingContext2D, layer: Layer) {
    const props = layer.shapeProps;
    if (!props) return;

    ctx.save();

    if (props.shadowBlur > 0) {
      ctx.shadowColor = props.shadowColor || 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = props.shadowBlur;
      ctx.shadowOffsetY = 4;
    }

    ctx.fillStyle = props.fillColor || '#3b82f6';
    ctx.strokeStyle = props.strokeColor || '#ffffff';
    ctx.lineWidth = props.strokeWidth || 0;

    const w = layer.width;
    const h = layer.height;

    ctx.beginPath();

    switch (props.shapeType) {
      case 'rectangle':
        ctx.rect(0, 0, w, h);
        break;

      case 'rounded-rect':
        ctx.roundRect(0, 0, w, h, props.cornerRadius || 16);
        break;

      case 'circle':
        ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        break;

      case 'triangle':
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        break;

      case 'star': {
        const spikes = props.points || 5;
        const outerRad = Math.min(w, h) / 2;
        const innerRad = outerRad * 0.45;
        const cx = w / 2;
        const cy = h / 2;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRad);
        for (let i = 0; i < spikes; i++) {
          let x = cx + Math.cos(rot) * outerRad;
          let y = cy + Math.sin(rot) * outerRad;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRad;
          y = cy + Math.sin(rot) * innerRad;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRad);
        ctx.closePath();
        break;
      }

      case 'arrow': {
        const arrowHeadW = Math.min(w * 0.4, 40);
        const shaftH = h * 0.35;
        const shaftY = (h - shaftH) / 2;

        ctx.moveTo(0, shaftY);
        ctx.lineTo(w - arrowHeadW, shaftY);
        ctx.lineTo(w - arrowHeadW, 0);
        ctx.lineTo(w, h / 2);
        ctx.lineTo(w - arrowHeadW, h);
        ctx.lineTo(w - arrowHeadW, shaftY + shaftH);
        ctx.lineTo(0, shaftY + shaftH);
        ctx.closePath();
        break;
      }

      case 'line':
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        break;

      case 'heart': {
        const topCurveHeight = h * 0.3;
        ctx.moveTo(w / 2, h / 5);
        ctx.bezierCurveTo(w / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.bezierCurveTo(0, (h + topCurveHeight) / 2, w / 2, (h + topCurveHeight) / 2, w / 2, h);
        ctx.bezierCurveTo(w / 2, (h + topCurveHeight) / 2, w, (h + topCurveHeight) / 2, w, topCurveHeight);
        ctx.bezierCurveTo(w, 0, w / 2, 0, w / 2, h / 5);
        ctx.closePath();
        break;
      }

      case 'callout': {
        const tailW = Math.min(30, w * 0.2);
        const tailH = Math.min(25, h * 0.25);
        const bodyH = h - tailH;
        const rad = props.cornerRadius || 12;

        ctx.roundRect(0, 0, w, bodyH, rad);
        ctx.moveTo(w * 0.2, bodyH);
        ctx.lineTo(w * 0.25, h);
        ctx.lineTo(w * 0.2 + tailW, bodyH);
        break;
      }
    }

    if (props.fillColor && props.fillColor !== 'transparent') {
      ctx.fill();
    }
    if (props.strokeWidth > 0 && props.strokeColor && props.strokeColor !== 'transparent') {
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Render Freehand Drawing / Brush Stroke Layer
   */
  static renderDrawingLayer(ctx: CanvasRenderingContext2D, layer: Layer) {
    const strokes = layer.drawingStrokes;
    if (!strokes || strokes.length === 0) return;

    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = stroke.size;
      ctx.globalAlpha = stroke.opacity;

      switch (stroke.brushMode) {
        case 'neon':
          // Multi-pass neon glow
          ctx.strokeStyle = '#ffffff';
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = stroke.size * 1.5;
          ctx.lineWidth = stroke.size * 0.4;
          this.drawSmoothPath(ctx, stroke.points);
          ctx.stroke();

          ctx.shadowBlur = stroke.size * 3;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.size;
          this.drawSmoothPath(ctx, stroke.points);
          ctx.stroke();
          break;

        case 'highlighter':
          ctx.globalCompositeOperation = 'multiply';
          ctx.strokeStyle = stroke.color;
          ctx.globalAlpha = stroke.opacity * 0.45;
          ctx.lineWidth = stroke.size;
          this.drawSmoothPath(ctx, stroke.points);
          ctx.stroke();
          break;

        case 'calligraphy':
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.size;
          for (let i = 1; i < stroke.points.length; i++) {
            const p1 = stroke.points[i - 1];
            const p2 = stroke.points[i];
            ctx.beginPath();
            ctx.moveTo(p1.x - stroke.size * 0.3, p1.y - stroke.size * 0.3);
            ctx.lineTo(p2.x + stroke.size * 0.3, p2.y + stroke.size * 0.3);
            ctx.stroke();
          }
          break;

        case 'airbrush':
          ctx.strokeStyle = stroke.color;
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = stroke.size * 0.8;
          ctx.globalAlpha = stroke.opacity * 0.3;
          this.drawSmoothPath(ctx, stroke.points);
          ctx.stroke();
          break;

        default:
          ctx.strokeStyle = stroke.color;
          this.drawSmoothPath(ctx, stroke.points);
          ctx.stroke();
          break;
      }

      ctx.restore();
    }
  }

  /**
   * Draw smooth bezier curve through points
   */
  private static drawSmoothPath(ctx: CanvasRenderingContext2D, points: Point[]) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
      return;
    }

    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  }

  /**
   * Apply Retouch / Healing / Dodge & Burn locally onto a canvas area
   */
  static applyRetouch(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    mode: RetouchMode,
    strength: number = 0.5
  ) {
    const startX = Math.max(0, Math.floor(x - radius));
    const startY = Math.max(0, Math.floor(y - radius));
    const size = Math.ceil(radius * 2);

    try {
      const imgData = ctx.getImageData(startX, startY, size, size);
      const data = imgData.data;
      const r2 = radius * radius;

      for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
          const dx = px - radius;
          const dy = py - radius;
          const dist2 = dx * dx + dy * dy;

          if (dist2 <= r2) {
            const factor = Math.max(0, 1 - Math.sqrt(dist2) / radius) * strength;
            const idx = (py * size + px) * 4;

            if (mode === 'dodge') {
              // Lighten
              data[idx] = Math.min(255, data[idx] + 40 * factor);
              data[idx + 1] = Math.min(255, data[idx + 1] + 40 * factor);
              data[idx + 2] = Math.min(255, data[idx + 2] + 40 * factor);
            } else if (mode === 'burn') {
              // Darken
              data[idx] = Math.max(0, data[idx] - 40 * factor);
              data[idx + 1] = Math.max(0, data[idx + 1] - 40 * factor);
              data[idx + 2] = Math.max(0, data[idx + 2] - 40 * factor);
            } else if (mode === 'smooth' || mode === 'heal') {
              // Local Gaussian soft blur / blend
              const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
              data[idx] = data[idx] * (1 - factor * 0.3) + avg * (factor * 0.3);
              data[idx + 1] = data[idx + 1] * (1 - factor * 0.3) + avg * (factor * 0.3);
              data[idx + 2] = data[idx + 2] * (1 - factor * 0.3) + avg * (factor * 0.3);
            }
          }
        }
      }

      ctx.putImageData(imgData, startX, startY);
    } catch {
      // Cross-origin fallback
    }
  }

  /**
   * Render Photoshop-like bounding box with 8 transform handles and rotation pin
   */
  static renderTransformHandles(ctx: CanvasRenderingContext2D, layer: Layer) {
    ctx.save();

    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;

    ctx.translate(cx, cy);
    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }
    ctx.translate(-layer.width / 2, -layer.height / 2);

    // Bounding Box Rectangle
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(0, 0, layer.width, layer.height);
    ctx.setLineDash([]);

    // 8 Corner & Midpoint Handles
    const handleSize = 8;
    const handles = [
      { x: 0, y: 0 },
      { x: layer.width / 2, y: 0 },
      { x: layer.width, y: 0 },
      { x: layer.width, y: layer.height / 2 },
      { x: layer.width, y: layer.height },
      { x: layer.width / 2, y: layer.height },
      { x: 0, y: layer.height },
      { x: 0, y: layer.height / 2 },
    ];

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;

    for (const h of handles) {
      ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
    }

    // Rotation Handle Pin above top center
    const rotPinY = -24;
    ctx.beginPath();
    ctx.moveTo(layer.width / 2, 0);
    ctx.lineTo(layer.width / 2, rotPinY);
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(layer.width / 2, rotPinY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.restore();
  }
}
