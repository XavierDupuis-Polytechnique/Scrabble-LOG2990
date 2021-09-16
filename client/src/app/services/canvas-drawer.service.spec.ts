/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CanvasDrawerService } from './canvas-drawer.service';

describe('Service: CanvasDrawer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CanvasDrawerService],
        });
    });

    it('should ...', inject([CanvasDrawerService], (service: CanvasDrawerService) => {
        expect(service).toBeTruthy();
    }));
});
