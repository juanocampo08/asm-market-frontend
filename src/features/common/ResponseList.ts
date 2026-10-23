export const DEFAULT_PAGINATION: Required<Pagination> = {
  totalPages: 1,
  total: 0,
  currentPage: 1,
  page: 1,
  limit: 6,
};

export interface Pagination {
  totalPages?: number;
  total?: number;
  currentPage?: number;
  page?: number;
  limit?: number;
}

export interface ResponseList<T> {
  pagination?: Pagination;
  meta?: Pagination;
  data: T[];
}