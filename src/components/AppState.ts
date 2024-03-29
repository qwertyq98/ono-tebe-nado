import _ from "lodash";
import { IAppState, ILot, IOrder } from "../types";
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
}