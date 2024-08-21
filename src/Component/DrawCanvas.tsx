import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasInstance = new fabric.Canvas(canvasRef.current);
      setCanvas(canvasInstance);

      // Enable free drawing mode
      canvasInstance.isDrawingMode = true;
      canvasInstance.freeDrawingBrush.color = 'black'; // Set default color
      canvasInstance.freeDrawingBrush.width = 5; // Set default brush width

      return () => {
        // Clean up the canvas when the component is unmounted
        canvasInstance.dispose();
      };
    }
  }, []);

  const changeColor = (color: string) => {
    if (canvas) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  const changeBrushSize = (size: number) => {
    if (canvas) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  return (
    <div>
      <div>
        <label>Color:</label>
        <input
          type='color'
          onChange={(e) => changeColor(e.target.value)}
          defaultValue='#000000'
        />
        <label>Brush Size:</label>
        <input
          type='range'
          min='1'
          max='100'
          onChange={(e) => changeBrushSize(parseInt(e.target.value))}
          defaultValue='5'
        />
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000' }}
      />
    </div>
  );
};
