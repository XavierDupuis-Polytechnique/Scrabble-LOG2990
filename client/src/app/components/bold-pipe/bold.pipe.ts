import { Pipe, PipeTransform } from '@angular/core';

const BOLD_REGEX = /#(.+?)#/;

@Pipe({
    name: 'bold',
})
export class BoldPipe implements PipeTransform {
    transform(value: string): string {
        const sanitized = this.sanitize(value);
        const replace = this.replace(sanitized);
        return replace;
    }

    private replace(str: string): string {
        return str.replace(new RegExp(BOLD_REGEX, 'g'), '<b>$1</b>');
    }

    private sanitize(str: string): string {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
