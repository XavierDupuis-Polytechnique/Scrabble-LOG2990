import { Pipe, PipeTransform } from '@angular/core';

const NEWLINE_REGEX = /\\n/;

@Pipe({
    name: 'newlinePipe',
})
export class NewlinePipe implements PipeTransform {
    transform(value: string): string {
        const replace = this.replace(value);
        return replace;
    }

    private replace(str: string): string {
        return str.replace(new RegExp(NEWLINE_REGEX, 'gm'), '<br>');
    }
}
