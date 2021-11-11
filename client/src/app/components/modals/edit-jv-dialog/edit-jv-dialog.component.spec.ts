import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJvDialogComponent } from './edit-jv-dialog.component';

describe('EditJvDialogComponent', () => {
  let component: EditJvDialogComponent;
  let fixture: ComponentFixture<EditJvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditJvDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
