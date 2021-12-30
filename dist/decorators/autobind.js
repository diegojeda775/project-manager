export function autobind(_, _2, descriptor) {
    const ogMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = ogMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
