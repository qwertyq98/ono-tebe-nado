import { ensureElement } from "../utils/utils";
import { Card, ICardActions } from "./Card";

export class AuctionItem extends Card<HTMLElement> {
    protected _status: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('lot', container, actions);
        this._status = ensureElement<HTMLElement>(`.lot__status`, container);
    }

    set status(content: HTMLElement) {
        this._status.replaceWith(content);
    }
}