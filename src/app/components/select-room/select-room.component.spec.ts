import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRoomComponent } from './select-room.component';

describe('SelectRoomComponent', () => {
  let component: SelectRoomComponent;
  let fixture: ComponentFixture<SelectRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
