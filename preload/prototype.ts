import { assertElement } from "@/error.js";

Document.prototype.queryAndAssert = function(selector: string): Element {
    const element = this.querySelector(selector);
    assertElement(element, selector);
    return element;
};

Document.prototype.queryAsArray = function(selector: string): Element[] {
    const elements = this.querySelectorAll(selector);
    return Array.from(elements);
};

Element.prototype.queryAndAssert = function(selector: string): Element {
    const element = this.querySelector(selector);
    assertElement(element, selector);
    return element;
};

Element.prototype.queryAsArray = function(selector: string): Element[] {
    const elements = this.querySelectorAll(selector);
    return Array.from(elements);
};