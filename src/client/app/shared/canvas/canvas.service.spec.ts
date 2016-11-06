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
      cs.zoomScale = 1;
      cs.originOffset = {x:0, y:0};
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:0, y:0});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:400, y:400});

      cs.zoomScale = 1;
      cs.originOffset = {x:50, y:50};
      expect(cs.viewportCoordToCanvasCoord({x:-50, y:-50})).toEqual({x:0, y:0});
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:50, y:50});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:450, y:450});

      cs.zoomScale = 2;
      cs.originOffset = {x:0, y:0};
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:0, y:0});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:200, y:200});

      cs.zoomScale = 2;
      cs.originOffset = {x:50, y:50};
      expect(cs.viewportCoordToCanvasCoord({x:-50, y:-50})).toEqual({x:25, y:25});
      expect(cs.viewportCoordToCanvasCoord({x:0, y:0})).toEqual({x:50, y:50});
      expect(cs.viewportCoordToCanvasCoord({x:400, y:400})).toEqual({x:250, y:250});
    });

    it('should properly convert CanvasCoord to ViewportCoord', () => {
      cs.zoomScale = 1;
      cs.originOffset = {x:0, y:0};
      expect(cs.canvasCoordToViewportCoord({x:0, y:0})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:400, y:400})).toEqual({x:400, y:400});

      cs.zoomScale = 1;
      cs.originOffset = {x:50, y:50};
      expect(cs.canvasCoordToViewportCoord({x:0, y:0})).toEqual({x:-50, y:-50});
      expect(cs.canvasCoordToViewportCoord({x:50, y:50})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:450, y:450})).toEqual({x:400, y:400});

      cs.zoomScale = 2;
      cs.originOffset = {x:0, y:0};
      expect(cs.canvasCoordToViewportCoord({x:0, y:0})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:200, y:200})).toEqual({x:400, y:400});

      cs.zoomScale = 2;
      cs.originOffset = {x:50, y:50};
      expect(cs.canvasCoordToViewportCoord({x:25, y:25})).toEqual({x:-50, y:-50});
      expect(cs.canvasCoordToViewportCoord({x:50, y:50})).toEqual({x:0, y:0});
      expect(cs.canvasCoordToViewportCoord({x:250, y:250})).toEqual({x:400, y:400});
    });
  });
}
