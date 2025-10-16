export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
export interface ICatalogResult {
  total: number;
  items: IProduct[];
}
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
export interface IOrderRequest extends IBuyer{
  total: number;
  items: string[];
}
export interface IOrderResult {
  id: string;
  total: number;
}
export interface IBasketRemoveActions {
    onRemove?: (event: MouseEvent) => void;
}
export interface IBasketOrderActions {
    onBuy?: (event: MouseEvent) => void;
}
export interface IFormActions {
    onSubmit?: (event: SubmitEvent) => void;
}
export interface IContactsActions {
  onEmailInput?: (email: string) => void;
  onPhoneInput?: (phone: string) => void;
}
export interface IOrderActions {
    onPaymentSelect?: (payment: TPayment) => void;
    onAddressInput?: (address: string) => void;
};

export interface ISuccessActions {
  onOrdered?: () => void; 
}
