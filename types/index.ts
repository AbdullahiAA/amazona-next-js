export interface IData {
  users: IUser[];
  products: IProduct[];
}

export interface IUser {
  name: string;
  email: string;
  password: any;
  isAdmin: boolean;
}

export interface IProduct {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  quantity?: number;
  description: string;
}

export interface IProductResponse extends IProduct {
  _id: string;
}

export interface ICartItem extends IProductResponse {
  quantity: number;
}
