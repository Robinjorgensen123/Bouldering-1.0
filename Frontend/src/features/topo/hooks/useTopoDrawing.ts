import { useRef, useState, useEffect, useCallback } from "react";
import { type ILinePoint } from "../../boulders/types/boulder.types";

export function useTopoDrawing(onSavedPoints: (points: ILinePoint[]) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointsRef = useRef<ILinePoint[]>([]);
  const [points, setPoints] = useState<ILinePoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const syncCanvasSizeToImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    const width = Math.round(image.clientWidth);
    const height = Math.round(image.clientHeight);
    if (!width || !height) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }, []);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent): ILinePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
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
    onSavedPoints(pointsRef.current);
  };

  const handleUndo = () => {
    setPoints((prev) => {
      const nextPoints = prev.slice(0, -1);
      onSavedPoints(nextPoints);
      return nextPoints;
    });
  };

  const handleReset = () => {
    setPoints([]);
    onSavedPoints([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (points.length < 2) return;
    ctx.strokeStyle = "#39FF14";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }, [points]);

  return {
    canvasRef,
    imageRef,
    points,
    isDrawing,
    handleStart,
    handleMove,
    handleEnd,
    handleUndo,
    handleReset,
    syncCanvasSizeToImage,
  };
}
