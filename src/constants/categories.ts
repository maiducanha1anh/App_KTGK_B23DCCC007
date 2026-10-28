import { Category } from '../types/book';

// Danh sách 4 thể loại sách theo đề bài
export const CATEGORIES: Category[] = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
];

// Danh sách bộ lọc màn hình chính (có thêm "Tất cả")
export type FilterCategory = 'Tất cả' | Category;

export const FILTER_CATEGORIES: FilterCategory[] = ['Tất cả', ...CATEGORIES];
