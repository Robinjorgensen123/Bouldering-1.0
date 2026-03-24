import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { type ILinePoint } from "../types/boulder.types";

interface TopoCanvasProp {
  imageSrc: string;
  onSavedPoints: (points: ILinePoint[]) => void;
}

const TopoCanvas: React.FC<TopoCanvasProp> = ({ imageSrc, onSavedPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointsRef = useRef<ILinePoint[]>([]);
  const [points, setPoints] = useState<ILinePoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const syncCanvasSizeToImage = () => {
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
  };

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    syncCanvasSizeToImage();

    const handleResize = () => {
      syncCanvasSizeToImage();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imageSrc]);

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

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Topo Editor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Draw directly on the wall image to mark the route path.
          </Typography>
        </Box>
        <Chip
          color={points.length > 0 ? "success" : "default"}
          label={
            points.length > 0
              ? `${points.length} points captured`
              : "No line drawn yet"
          }
          size="small"
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.950",
        }}
      >
        <Box
          component="img"
          ref={imageRef}
          src={imageSrc}
          alt="preview"
          onLoad={syncCanvasSizeToImage}
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
            userSelect: "none",
          }}
        />
        <Box
          component="canvas"
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
          onMouseLeave={handleEnd}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            cursor: "crosshair",
            zIndex: 1,
          }}
        />
      </Paper>

      {points.length > 0 && (
        <Stack direction="row" spacing={1.5}>
          <Button
            type="button"
            onClick={handleUndo}
            variant="outlined"
            startIcon={<UndoRoundedIcon />}
            disabled={points.length === 0}
          >
            Undo Last Point
          </Button>
          <Button
            type="button"
            className="reset-btn"
            onClick={handleReset}
            variant="outlined"
            color="error"
            startIcon={<RestartAltRoundedIcon />}
          >
            Reset Line
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default TopoCanvas;
