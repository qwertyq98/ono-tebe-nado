import { IOrderForm } from "../types";
import { EventEmitter } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}