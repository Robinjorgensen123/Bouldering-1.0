import React, { useRef, useState, useEffect } from "react";
import "./TopoCanvas.scss";
import { Point } from "../../types/Boulder.types";

interface TopoCanvasProp {
  imageSrc: string;
  onSavedPoints: (points: Point[]) => void;
}

const TopoCanvas: React.FC<TopoCanvasProp> = ({ imageSrc, onSavedPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCoords = (e: any): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDrawing(true);
    const startPoint = getCoords(e);
    setPoints([startPoint]);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    const nextPoint = getCoords(e);
    setPoints((prev) => [...prev, nextPoint]);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    onSavedPoints(points);
  };

  const handleReset = () => {
    setPoints([]);
    onSavedPoints([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || points.length < 2) return;

    ctx.strokeStyle = "#39FF14";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.stroke();
  }, [points]);

  return (
    <div className="topo-canvas-container">
      {/**Uploaded img */}
      <img src={imageSrc} alt="preview" />
      <canvas
        ref={canvasRef}
        aria-label="topo-canvas"
        width={500}
        height={500}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseMove={handleMove}
      />

      {points.length > 0 && (
        <button type="button" className="reset-btn" onClick={handleReset}>
          Reset Line
        </button>
      )}
    </div>
  );
};

export default TopoCanvas;
