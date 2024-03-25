import dayjs from "dayjs";
import { IAppState, ILot, LotStatus } from "../types";
import { Model } from "./base/Model";

export class LotItem extends Model<ILot> {
  about: string;
  datetime: string;
  id: string;
  image: string;
  minPrice: number;
  price: number;
  status: LotStatus;
  title: string;
  description: string;
  history: number[];

  get statusLabel(): string {
    switch (this.status) {
      case "active":
        return `Открыто до ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
      case "closed":
        return `Закрыто ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
      case "wait":
        return `Откроется ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
      default:
        return this.status;
    }
  }
}

export class AppState extends Model<IAppState> {
  catalog: LotItem[];
  preview: string | null;

  setCatalog(items: ILot[]) {
    this.catalog = items.map(item => new LotItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: LotItem) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }
}