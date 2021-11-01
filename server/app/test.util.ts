import * as sinon from 'sinon';
import { createStubInstance } from 'sinon';

export type StubbedClass<T> = sinon.SinonStubbedInstance<T> & T;

export const createSinonStubInstance = <T>(
    constructor: sinon.StubbableType<T>,
    overrides?: { [K in keyof T]?: sinon.SinonStubbedMember<T[K]> },
): StubbedClass<T> => {
    const stub = createStubInstance<T>(constructor, overrides);
    return stub as unknown as StubbedClass<T>;
};
