import { ReflectiveInjector } from '@angular/core';
import { CanvasService } from '../canvas/canvas.service';

export function main() {
  describe('Canvas service', () => {
    let cs: CanvasService;

    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([CanvasService]);
      cs = injector.get(CanvasService);
    });

    it('should properly convert ViewportCoord to CanvasCoord', () => {
      cs.centerOffset = {x:0, y:0};
      cs.zoomScale = 1;
      cs.viewportSize = {w:400, h:400};
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:-200, y:-200});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:200, y:200});

      cs.zoomScale = 2;
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:-100, y:-100});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:100, y:100});

      cs.centerOffset = {x:50, y:50};
      cs.zoomScale = 1;
      expect(cs.viewportCoordToCanvasCoord({x:-50, y:-50})).toEqual({x:-200, y:-200});
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:-150, y:-150});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:250, y:250});

      cs.zoomScale = 2;
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:-50, y:-50});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:150, y:150});
    });

    it('should properly convert CanvasCoord to ViewportCoord', () => {
      cs.centerOffset = {x:0, y:0};
      cs.zoomScale = 1;
      cs.viewportSize = {w:400, h:400};
      expect(cs.canvasCoordToViewportCoord({x:-200, y:-200})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:200, y:200})).toEqual({x:400, y:400});

      cs.zoomScale = 2;
      expect(cs.canvasCoordToViewportCoord({x:-100, y:-100})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:100, y:100})).toEqual({x:400, y:400});

      cs.centerOffset = {x:50, y:50};
      cs.zoomScale = 1;
      expect(cs.canvasCoordToViewportCoord({x:-200, y:-200})).toEqual({x:-50, y:-50});
      expect(cs.canvasCoordToViewportCoord({x:-150, y:-150})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:250, y:250})).toEqual({x:400, y:400});

      cs.zoomScale = 2;
      expect(cs.canvasCoordToViewportCoord({x:-50, y:-50})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:150, y:150})).toEqual({x:400, y:400});
    });
  });
}
