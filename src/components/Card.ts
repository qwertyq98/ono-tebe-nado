import {Component} from "./base/Component";
import {LotStatus} from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";
import clsx from "clsx";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface IAuctionActions {
    onSubmit: (price: number) => void;
}

export type AuctionStatus = {
    status: string,
    time: string,
    label: string,
    nextBid: number,
    history: number[]
};

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

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
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

export class Auction extends Component<AuctionStatus> {
    protected _time: HTMLElement;
    protected _label: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _input: HTMLInputElement;
    protected _history: HTMLElement;
    protected _bids: HTMLElement
    protected _form: HTMLFormElement;

    constructor(container: HTMLElement, actions?: IAuctionActions) {
        super(container);

        this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
        this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
        this._button = ensureElement<HTMLButtonElement>(`.button`, container);
        this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
        this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
        this._history = ensureElement<HTMLElement>('.lot__history', container);
        this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            actions?.onSubmit?.(parseInt(this._input.value));
            return false;
        });
    }

    set time(value: string) {
        this.setText(this._time, value);
    }

    set label(value: string) {
        this.setText(this._label, value);
    }

    set nextBid(value: number) {
        this._input.value = String(value);
    }
    
    set history(value: number[]) {
        this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
            className: 'lot__history-item',
            textContent: formatNumber(item)
        })));
    }

    set status(value: LotStatus) {
        if (value !== 'active') {
            this.setHidden(this._history);
            this.setHidden(this._form);
        } else {
            this.setVisible(this._history);
            this.setVisible(this._form);
        }
    }

    focus() {
        this._input.focus();
    }
}
