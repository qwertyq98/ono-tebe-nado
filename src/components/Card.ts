import {Component} from "./base/Component";
import {LotStatus} from "../types";
import {bem, ensureElement} from "../utils/utils";
import clsx from "clsx";

export interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
    status: T;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }
}

export type CatalogItemStatus = {
    status: LotStatus,
    label: string
};

export class CatalogItem extends Card<CatalogItemStatus> {
    protected _status: HTMLElement;

    constructor(container: HTMLElement) {
        super('card', container);
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
