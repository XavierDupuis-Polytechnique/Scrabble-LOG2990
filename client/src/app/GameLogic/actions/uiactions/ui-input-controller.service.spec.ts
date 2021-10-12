import { TestBed } from '@angular/core/testing';
import { UIExchange } from '@app/GameLogic/actions/uiactions/ui-exchange';
import { UIMove } from '@app/GameLogic/actions/uiactions/ui-move';
import { UIPlace } from '@app/GameLogic/actions/uiactions/ui-place';
import { InputComponent, InputType, UIInput } from '@app/GameLogic/interface/ui-input';
import { UIInputControllerService } from './ui-input-controller.service';

describe('UIInputControllerService', () => {
    let service: UIInputControllerService;

    beforeEach(() => {
        // let cSpy = spyOn(UIPlace, 'create');
        TestBed.configureTestingModule({});
        service = TestBed.inject(UIInputControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /// processInputComponent TESTS ///
    it('should update activeComponent with the correct default component when "from" is not provided', () => {
        const input: UIInput = { type: InputType.LeftClick };
        service.processInputComponent(input);
        expect(service.activeComponent).toBe(UIInputControllerService.defaultComponent);
    });

    it('should update activeComponent with the provided InputComponent.Board parameter', () => {
        const component = InputComponent.Board;
        const input: UIInput = { from: component, type: InputType.LeftClick };
        service.processInputComponent(input);
        expect(service.activeComponent).toBe(component);
    });

    it('should update activeComponent with the provided InputComponent.Horse parameter', () => {
        const component = InputComponent.Horse;
        const input: UIInput = { from: component, type: InputType.LeftClick };
        service.processInputComponent(input);
        expect(service.activeComponent).toBe(component);
    });

    it('should update activeComponent with the provided InputComponent.Outside parameter', () => {
        const component = InputComponent.Outside;
        const input: UIInput = { from: component, type: InputType.LeftClick };
        service.processInputComponent(input);
        expect(service.activeComponent).toBe(component);
    });
    /// ///////////////////////////

    /// updateActiveAction TESTS ///
    it('should create a new UIPlace action if the activeAction is null', () => {
        service.activeComponent = InputComponent.Board;
        const wasActionCreated = service.updateActiveAction(InputType.LeftClick);
        expect(wasActionCreated).toBeTruthy();
        expect(service.activeAction instanceof UIPlace).toBeTruthy();
    });

    it('should create a new UIExchange action if the activeAction is null', () => {
        service.activeComponent = InputComponent.Horse;
        const wasActionCreated = service.updateActiveAction(InputType.RightClick);
        expect(wasActionCreated).toBeTruthy();
        expect(service.activeAction instanceof UIExchange).toBeTruthy();
    });

    it('should create a new UIMove action if the activeAction is null (with click)', () => {
        service.activeComponent = InputComponent.Horse;
        const wasActionCreated = service.updateActiveAction(InputType.LeftClick);
        expect(wasActionCreated).toBeTruthy();
        expect(service.activeAction instanceof UIMove).toBeTruthy();
    });

    it('should create a new UIMove action if the activeAction is null (with keypress)', () => {
        service.activeComponent = InputComponent.Horse;
        const wasActionCreated = service.updateActiveAction(InputType.KeyPress);
        expect(wasActionCreated).toBeTruthy();
        expect(service.activeAction instanceof UIMove).toBeTruthy();
    });

    it('should set the activeAction null if the InputComponent was "Outside"', () => {
        service.activeAction = new UIExchange();
        service.activeComponent = InputComponent.Outside;
        const wasActionCreated = service.updateActiveAction(InputType.LeftClick);
        expect(wasActionCreated).toBeTruthy();
        expect(service.activeAction).toBeNull();
    });

    it('should not create a new UIPlace action if the activeAction is already a UIPlace', () => {
        service.activeComponent = InputComponent.Board;
        let wasActionCreated = service.updateActiveAction(InputType.LeftClick);
        expect(wasActionCreated).toBeTruthy();
        expect(service.activeAction instanceof UIPlace).toBeTruthy();

        service.activeComponent = InputComponent.Board;
        wasActionCreated = service.updateActiveAction(InputType.LeftClick);
        expect(wasActionCreated).toBeFalsy();
        expect(service.activeAction instanceof UIPlace).toBeTruthy();
    });
    /// ///////////////////////////
});
