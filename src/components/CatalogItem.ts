import clsx from "clsx";
import { LotStatus } from "../types";
import { bem, ensureElement } from "../utils/utils";
import { Card, ICardActions } from "./Card";

export type CatalogItemStatus = {
    status: LotStatus,
    label: string
};

export class CatalogItem extends Card<CatalogItemStatus> {
    protected _status: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._status = ensureElement<HTMLElement>(`.card__status`, container);
    }

    set status({ status, label }: CatalogItemStatus) {
        this.setText(this._status, label);
        this._status.className = clsx('card__status', {
            [bem(this.blockName, 'status', 'active').name]: status === 'active',
            [bem(this.blockName, 'status', 'closed').name]: status === 'closed'
        });
    }
}