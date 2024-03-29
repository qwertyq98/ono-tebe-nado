import { ensureElement, formatNumber } from "../utils/utils";
import { Card, ICardActions } from "./Card";

export interface BidStatus {
    amount: number;
    status: boolean;
}

export class BidItem extends Card<BidStatus> {
    protected _amount: HTMLElement;
    protected _status: HTMLElement;
    protected _selector: HTMLInputElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('bid', container, actions);
        this._amount = ensureElement<HTMLElement>(`.bid__amount`, container);
        this._status = ensureElement<HTMLElement>(`.bid__status`, container);
        this._selector = container.querySelector(`.bid__selector-input`);

        if (!this._button && this._selector) {
            this._selector.addEventListener('change', (event: MouseEvent) => {
                actions?.onClick?.(event);
            })
        }
    }

    set status({ amount, status }: BidStatus) {
        this.setText(this._amount, formatNumber(amount));

        if (status) this.setVisible(this._status);
        else this.setHidden(this._status);
    }
}