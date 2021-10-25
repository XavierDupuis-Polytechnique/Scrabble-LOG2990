import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbar } from '@angular/material/toolbar';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { HeaderBarComponent } from './header-bar.component';

describe('HeaderBarComponent', () => {
    let component: HeaderBarComponent;
    let fixture: ComponentFixture<HeaderBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppRoutingModule],
            declarations: [HeaderBarComponent, MatToolbar],
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
