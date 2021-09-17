import { TestBed } from '@angular/core/testing';
import { ActionCompilerService } from '@app/GameLogic/commands/commandTranslator/action-compiler.service';

describe('ActionCompilerServiceService', () => {
    let service: ActionCompilerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActionCompilerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
