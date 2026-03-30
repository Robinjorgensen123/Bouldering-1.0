import React, { useEffect } from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { type ILinePoint } from "../../boulders/types/boulder.types";
import { useTopoDrawing } from "../hooks/useTopoDrawing";
import { toRelativePoints } from "../utils/topoLine";

interface TopoCanvasProp {
  imageSrc: string;
  onSavedPoints: (points: ILinePoint[]) => void;
}

const TopoCanvas: React.FC<TopoCanvasProp> = ({ imageSrc, onSavedPoints }) => {
  const {
    canvasRef,
    imageRef,
    points,
    handleStart,
    handleMove,
    handleEnd,
    handleUndo,
    handleReset,
    syncCanvasSizeToImage,
  } = useTopoDrawing((pts) => {
    const img = imageRef.current;
    if (img && img.width && img.height) {
      onSavedPoints(toRelativePoints(pts, img.width, img.height));
    } else {
      onSavedPoints([]);
    }
  });

  useEffect(() => {
    syncCanvasSizeToImage();

    window.addEventListener("resize", syncCanvasSizeToImage);
    return () => {
      window.removeEventListener("resize", syncCanvasSizeToImage);
    };
  }, [imageSrc, syncCanvasSizeToImage]);

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
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
