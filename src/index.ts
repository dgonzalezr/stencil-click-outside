import { getElement } from "@stencil/core";
import { ComponentInstance } from "@stencil/core/dist/declarations";

declare type ClickOutsideDecorator = (target: ComponentInstance, propertyKey: string) => void

/**
 * Call this function as soon as the click outside of annotated method's host is done.
 * @example
```
@ClickOutside()
callback() {
  // this will run when click outside of element (host component) is done.
}
```
 */
export function ClickOutside(): ClickOutsideDecorator {
  return (proto: ComponentInstance, methodName: string) => {
    const { render } = proto;
    proto.render = function() {
      const renderResult = render.call(this);
      const host = getElement(this);
      const method = this[methodName];
      registerClickOutside(host, method);
      return renderResult;
    };
  };
}

/**
 * Register callback function for HTMLElement to be executed when user clicks outside of element.
 * @example
```
<span 
    ref={spanEl => registerClickOutside(spanEl, () => this.test())}>
      Hello, World!
</span>;
```
 */
export function registerClickOutside(element: HTMLElement, callback: () => void): void {
  window.addEventListener(
    "click",
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (!element.contains(target)) {
        callback.call(this);
      }
    },
    false
  );
}