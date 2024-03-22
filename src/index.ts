import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { AppState } from './components/LotItem';
import { CatalogChangeEvent } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CatalogItem } from './components/Card';
import { Page } from './components/Page';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card');


// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate));
        return card.render({
            title: item.title,
            image: item.image,
            description: item.about,
            status: {
                status: item.status,
                label: item.statusLabel
            },
        });
    });
    // page.counter = appData.getClosedLots().length;
});


// Получаем лоты с сервера
api.getLotList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


