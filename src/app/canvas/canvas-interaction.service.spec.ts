import { CanvasInteractionService } from './canvas-interaction.service';
import { TestBed } from '@angular/core/testing';
import { ViewportCoord, CanvasCoord } from './utils/coord';

describe('CanvasInteractionService', () => {
  let cs: CanvasInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasInteractionService
      ]
    });

    cs = TestBed.get(CanvasInteractionService);
  });

  it('should properly convert ViewportCoord to CanvasCoord', () => {
    cs.zoomScale = 1;
    cs.originOffset = new CanvasCoord(0, 0);
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(0, 0))).toEqual(new CanvasCoord(0, 0));
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(400, 400))).toEqual(new CanvasCoord(400, 400));

    cs.zoomScale = 1;
    cs.originOffset = new CanvasCoord(50, 50);
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(-50, -50))).toEqual(new CanvasCoord(0, 0));
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(0, 0))).toEqual(new CanvasCoord(50, 50));
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(400, 400))).toEqual(new CanvasCoord(450, 450));

    cs.zoomScale = 2;
    cs.originOffset = new CanvasCoord(0, 0);
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(0, 0))).toEqual(new CanvasCoord(0, 0));
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(400, 400))).toEqual(new CanvasCoord(200, 200));

    cs.zoomScale = 2;
    cs.originOffset = new CanvasCoord(50, 50);
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(-50, -50))).toEqual(new CanvasCoord(25, 25));
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(0, 0))).toEqual(new CanvasCoord(50, 50));
    expect(cs.viewportCoordToCanvasCoord(new ViewportCoord(400, 400))).toEqual(new CanvasCoord(250, 250));
  });

  it('should properly convert CanvasCoord to ViewportCoord', () => {
    cs.zoomScale = 1;
    cs.originOffset = new CanvasCoord(0, 0);
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(0, 0))).toEqual(new ViewportCoord(0, 0));
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(400, 400))).toEqual(new ViewportCoord(400, 400));

    cs.zoomScale = 1;
    cs.originOffset = new CanvasCoord(50, 50);
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(0, 0))).toEqual(new ViewportCoord(-50, -50));
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(50, 50))).toEqual(new ViewportCoord(0, 0));
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(450, 450))).toEqual(new ViewportCoord(400, 400));

    cs.zoomScale = 2;
    cs.originOffset = new CanvasCoord(0, 0);
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(0, 0))).toEqual(new ViewportCoord(0, 0));
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(200, 200))).toEqual(new ViewportCoord(400, 400));

    cs.zoomScale = 2;
    cs.originOffset = new CanvasCoord(50, 50);
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(25, 25))).toEqual(new ViewportCoord(-50, -50));
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(50, 50))).toEqual(new ViewportCoord(0, 0));
    expect(cs.canvasCoordToViewportCoord(new CanvasCoord(250, 250))).toEqual(new ViewportCoord(400, 400));
  });
});
