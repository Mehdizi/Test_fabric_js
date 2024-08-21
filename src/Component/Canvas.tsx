import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastPosXRef = useRef<number>(0);
  const lastPosYRef = useRef<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        const zoomFactor = 0.1;
        let newZoom =
          canvas.getZoom() * (1 + (e.deltaY > 0 ? -zoomFactor : zoomFactor));
        newZoom = Math.max(0.1, Math.min(newZoom, 5));

        const pointer = canvas.getPointer(e);
        const zoomPoint = new fabric.Point(pointer.x, pointer.y);

        canvas.zoomToPoint(zoomPoint, newZoom);
        canvas.renderAll();
      }
    };

    const handleDoubleClick = (options: fabric.TEvent<MouseEvent>) => {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        const pointer = canvas.getPointer(options.e);
        const textbox = new fabric.Textbox('Post-it', {
          left: pointer.x,
          top: pointer.y,
          width: 150,
          height: 150,
          backgroundColor: '#ffeb3b',
          padding: 10,
          editable: true,
          borderColor: 'black',
          cornerColor: 'black',
          cornerStyle: 'circle',
          cornerSize: 10,
        });
        canvas.add(textbox);
        canvas.renderAll();
      }
    };

    const handleMouseDown = (options: fabric.TEvent<MouseEvent>) => {
      if (options.e.button === 0) {
        isDraggingRef.current = true;
        lastPosXRef.current = options.e.clientX;
        lastPosYRef.current = options.e.clientY;
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          canvas.setCursor('grab');
          canvas.selection = false;
        }
      }
    };

    const handleMouseMove = (options: fabric.TEvent<MouseEvent>) => {
      if (!isDraggingRef.current) return;

      const canvas = fabricCanvasRef.current;
      if (canvas) {
        const deltaMove = new fabric.Point(
          options.e.clientX - lastPosXRef.current,
          options.e.clientY - lastPosYRef.current
        );

        lastPosXRef.current = options.e.clientX;
        lastPosYRef.current = options.e.clientY;

        canvas.relativePan(deltaMove);
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.setCursor('default');
        canvas.selection = true;
      }
    };

    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: 'red',
        allowTouchScrolling: true,
      });
      fabricCanvasRef.current = canvas;

      const resizeCanvas = () => {
        if (canvasRef.current) {
          canvas.setWidth(window.innerWidth);
          canvas.setHeight(window.innerHeight);
          canvas.renderAll();
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      canvas.on('mouse:dblclick', (options) =>
        handleDoubleClick(options as fabric.TEvent<MouseEvent>)
      );
      canvas.on('mouse:down', (options) =>
        handleMouseDown(options as fabric.TEvent<MouseEvent>)
      );
      canvas.on('mouse:move', (options) =>
        handleMouseMove(options as fabric.TEvent<MouseEvent>)
      );
      canvas.on('mouse:up', handleMouseUp);

      window.addEventListener('wheel', handleWheel);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('wheel', handleWheel);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }
  }, []);

  const addPostIt = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const textbox = new fabric.Textbox('Post-it', {
        left: 100,
        top: 100,
        width: 150,
        height: 150,
        backgroundColor: '#ffeb3b',
        padding: 10,
        editable: true,
        borderColor: 'black',
        cornerColor: 'black',
        cornerStyle: 'circle',
        cornerSize: 10,
      });
      canvas.add(textbox);
      canvas.renderAll();
    }
  };

  return (
    <div className='canvas-container'>
      <button onClick={addPostIt} style={{ marginBottom: '10px' }}>
        Ajouter un Post-it
      </button>
      <div className='canvas-wrapper'>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
