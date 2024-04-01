import _ from "lodash";
import { FormErrors, IAppState, ILot, IOrder, IOrderForm } from "../types";
import { LotItem } from "./LotItem";
import { Model } from "./base/Model";

export class AppState extends Model<IAppState> {
  catalog: LotItem[];
  basket: string[];
  preview: string | null;
  order: IOrder = {
    email: '',
    phone: '',
    items: []
  };
  formErrors: FormErrors = {};

  setCatalog(items: ILot[]) {
    this.catalog = items.map(item => new LotItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: LotItem) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  getActiveLots(): LotItem[] {
    return this.catalog
      .filter(item => item.status === 'active' && item.isParticipate);
  }

  getClosedLots(): LotItem[] {
    return this.catalog
      .filter(item => item.status === 'closed' && item.isMyBid)
  }

  toggleOrderedLot(id: string, isIncluded: boolean) {
    if (isIncluded) {
      this.order.items = _.uniq([...this.order.items, id]);
    } else {
      this.order.items = _.without(this.order.items, id);
    }
  }

  getTotal() {
    return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
  }

  clearBasket() {
    this.order.items.forEach(id => {
      this.toggleOrderedLot(id, false);
      this.catalog.find(it => it.id === id).clearBid();
    });
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
  } 
}