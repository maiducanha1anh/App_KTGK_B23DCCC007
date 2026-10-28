// 4 thể loại sách theo quy định đề bài
export type Category = 'Giáo trình' | 'Tiểu thuyết' | 'Khoa học' | 'Thiếu nhi';

// Mô hình dữ liệu một cuốn sách
export interface Book {
  id: string; // Tự sinh, không trùng
  title: string; // Tên sách, bắt buộc
  author: string; // Tác giả, bắt buộc
  category: Category; // Thể loại
  year: number; // Năm xuất bản (1900 -> năm hiện tại)
  quantity: number; // Tổng số cuốn (> 0)
  borrowed: number; // Số cuốn đang mượn (0 <= borrowed <= quantity)
}

// Dữ liệu truyền vào khi thêm hoặc sửa sách (không sửa trực tiếp id và borrowed)
export interface BookInput {
  title: string;
  author: string;
  category: Category;
  year: number;
  quantity: number;
}

// Tham số truyền giữa các màn hình trong Stack Navigation
export type RootStackParamList = {
  BookList: undefined;
  BookDetail: { bookId: string };
  BookForm: { bookId?: string };
};
