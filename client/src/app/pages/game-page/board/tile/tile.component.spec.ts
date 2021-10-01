/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Tile } from '@app/GameLogic/game/board/tile';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
    let component: TileComponent;
    let fixture: ComponentFixture<TileComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [TileComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('class should change base on letter multiplicator', () => {
        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        component.tile = new Tile(2);
        fixture.detectChanges();
        expect(component.class).toBe('letterX2');
    });

    it('class should change base on word multiplicator', () => {
        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        component.tile = new Tile(1, 2);
        fixture.detectChanges();
        expect(component.class).toBe('wordX2');
    });
});
