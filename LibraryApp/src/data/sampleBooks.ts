import { Book } from '../types/book';

// Dữ liệu mẫu khởi tạo lần đầu cho thư viện (ít nhất 5 sách, đủ 4 thể loại và đủ 3 trạng thái)
export const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Lập trình Di động với React Native',
    author: 'TS. Nguyễn Văn An',
    category: 'Giáo trình',
    year: 2023,
    quantity: 10,
    borrowed: 3, // Trạng thái: Đang mượn (còn 7 cuốn)
  },
  {
    id: '2',
    title: 'Cấu trúc Dữ liệu và Giải thuật',
    author: 'PGS. Trần Đình Quế',
    category: 'Giáo trình',
    year: 2021,
    quantity: 5,
    borrowed: 5, // Trạng thái: Hết sách (còn 0 cuốn)
  },
  {
    id: '3',
    title: 'Số Đỏ',
    author: 'Vũ Trọng Phụng',
    category: 'Tiểu thuyết',
    year: 1936,
    quantity: 8,
    borrowed: 0, // Trạng thái: Chưa mượn cuốn nào (còn 8 cuốn)
  },
  {
    id: '4',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2001,
    quantity: 6,
    borrowed: 2, // Trạng thái: Đang mượn (còn 4 cuốn)
  },
  {
    id: '5',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 1941,
    quantity: 12,
    borrowed: 4, // Trạng thái: Đang mượn (còn 8 cuốn)
  },
  {
    id: '6',
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    category: 'Thiếu nhi',
    year: 1943,
    quantity: 3,
    borrowed: 3, // Trạng thái: Hết sách (còn 0 cuốn)
  },
];

