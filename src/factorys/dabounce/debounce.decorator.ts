import * as _ from 'lodash';

export function debounce(delay: number = 300): MethodDecorator {
  return function (descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = _.debounce(original, delay);
    return descriptor;
  }
}