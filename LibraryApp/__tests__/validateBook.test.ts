import { validateBook } from '../src/utils/validateBook';

describe('Kiểm tra hàm validateBook (Câu 2)', () => {
  const currentYear = new Date().getFullYear();

  test('Từ chối tên sách và tác giả để trống hoặc chỉ có khoảng trắng', () => {
    const errors = validateBook({
      title: '   ',
      author: '',
      category: 'Giáo trình',
      year: '2023',
      quantity: '10',
    });

    expect(errors.title).toBe('Tên sách không được để trống');
    expect(errors.author).toBe('Tên tác giả không được để trống');
  });

  test('Từ chối năm xuất bản rỗng, chứa ký tự chữ, số thập phân, nhỏ hơn 1900 hoặc lớn hơn năm hiện tại', () => {
    // Rỗng
    expect(
      validateBook({
        title: 'Sách A',
        author: 'Tác giả A',
        category: 'Khoa học',
        year: '',
        quantity: '5',
      }).year,
    ).toBe('Năm xuất bản không được để trống');

    // Chứa chữ
    expect(
      validateBook({
        title: 'Sách A',
        author: 'Tác giả A',
        category: 'Khoa học',
        year: '202a',
        quantity: '5',
      }).year,
    ).toBe('Năm xuất bản phải là số nguyên hợp lệ');

    // Số thập phân (kể cả .0)
    expect(
      validateBook({
        title: 'Sách A',
        author: 'Tác giả A',
        category: 'Khoa học',
        year: '2020.0',
        quantity: '5',
      }).year,
    ).toBe('Năm xuất bản phải là số nguyên hợp lệ');

    // Nhỏ hơn 1900
    expect(
      validateBook({
        title: 'Sách A',
        author: 'Tác giả A',
        category: 'Khoa học',
        year: '1899',
        quantity: '5',
      }).year,
    ).toBe(`Năm xuất bản phải từ 1900 đến ${currentYear}`);

    // Lớn hơn năm hiện tại
    expect(
      validateBook({
        title: 'Sách A',
        author: 'Tác giả A',
        category: 'Khoa học',
        year: String(currentYear + 1),
        quantity: '5',
      }).year,
    ).toBe(`Năm xuất bản phải từ 1900 đến ${currentYear}`);
  });

  test('Từ chối số lượng rỗng, không phải số nguyên hoặc nhỏ hơn / bằng 0', () => {
    // Rỗng
    expect(
      validateBook({
        title: 'Sách B',
        author: 'Tác giả B',
        category: 'Tiểu thuyết',
        year: '2020',
        quantity: '',
      }).quantity,
    ).toBe('Số lượng sách không được để trống');

    // Bằng 0
    expect(
      validateBook({
        title: 'Sách B',
        author: 'Tác giả B',
        category: 'Tiểu thuyết',
        year: '2020',
        quantity: '0',
      }).quantity,
    ).toBe('Số lượng sách phải lớn hơn 0');

    // Số âm
    expect(
      validateBook({
        title: 'Sách B',
        author: 'Tác giả B',
        category: 'Tiểu thuyết',
        year: '2020',
        quantity: '-3',
      }).quantity,
    ).toBe('Số lượng sách phải lớn hơn 0');

    // Số thập phân
    expect(
      validateBook({
        title: 'Sách B',
        author: 'Tác giả B',
        category: 'Tiểu thuyết',
        year: '2020',
        quantity: '5.5',
      }).quantity,
    ).toBe('Số lượng sách phải là số nguyên hợp lệ');
  });

  test('Khi sửa sách: Không cho phép giảm quantity xuống dưới số cuốn đang mượn (borrowed)', () => {
    const currentBorrowed = 4;

    // Giảm xuống 3 (< 4)
    const errors = validateBook(
      {
        title: 'Sách Đang Mượn',
        author: 'Tác giả',
        category: 'Giáo trình',
        year: '2022',
        quantity: '3',
      },
      currentBorrowed,
    );

    expect(errors.quantity).toBe(
      `Số lượng không được nhỏ hơn số cuốn đang mượn (${currentBorrowed} cuốn)`,
    );

    // Bằng 4 (hợp lệ)
    const validErrors = validateBook(
      {
        title: 'Sách Đang Mượn',
        author: 'Tác giả',
        category: 'Giáo trình',
        year: '2022',
        quantity: '4',
      },
      currentBorrowed,
    );

    expect(validErrors.quantity).toBeUndefined();
  });

  test('Dữ liệu hợp lệ trả về object lỗi rỗng', () => {
    const errors = validateBook({
      title: 'Lập trình di động React Native',
      author: 'Nguyễn Văn A',
      category: 'Giáo trình',
      year: '2023',
      quantity: '10',
    });

    expect(Object.keys(errors).length).toBe(0);
  });
});
