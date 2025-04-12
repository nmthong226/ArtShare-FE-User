export interface Category {
  id: number;
  name: string;
  cateName: string;
  url: string;
  createdAt: Date;
}

export interface RawCategory {
  id: number;
  name: string;
  cate_name: string;
  createdAt: Date;
  url: string;
};