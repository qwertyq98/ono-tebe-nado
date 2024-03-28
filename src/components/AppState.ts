import { IAppState, ILot } from "../types";
import { LotItem } from "./LotItem";
import { Model } from "./base/Model";

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