import { Category } from '../types/book';

export interface BookFormInput {
  title: string;
  author: string;
  category: Category;
  year: string;
  quantity: string;
}

export interface ValidationErrors {
  title?: string;
  author?: string;
  year?: string;
  quantity?: string;
}

// Kiểm tra dữ liệu nhập khi Thêm / Sửa sách (Câu 2)
export const validateBook = (
  input: BookFormInput,
  currentBorrowed: number = 0,
): ValidationErrors => {
  const errors: ValidationErrors = {};
  const currentYear = new Date().getFullYear();

  // 1. Kiểm tra tên sách và tác giả: cắt khoảng trắng 2 đầu, không được để trống
  if (input.title.trim() === '') {
    errors.title = 'Tên sách không được để trống';
  }
  if (input.author.trim() === '') {
    errors.author = 'Tên tác giả không được để trống';
  }

  // 2. Kiểm tra năm xuất bản: kiểm tra rỗng trước khi đổi sang số
  const yearText = input.year.trim();
  const yearNumber = Number(yearText);

  if (yearText === '') {
    errors.year = 'Năm xuất bản không được để trống';
  } else if (!Number.isInteger(yearNumber) || yearText.includes('.')) {
    errors.year = 'Năm xuất bản phải là số nguyên hợp lệ';
  } else if (yearNumber < 1900 || yearNumber > currentYear) {
    errors.year = `Năm xuất bản phải từ 1900 đến ${currentYear}`;
  }

  // 3. Kiểm tra tổng số lượng: kiểm tra rỗng trước, số nguyên > 0 và >= số đang mượn
  const quantityText = input.quantity.trim();
  const quantityNumber = Number(quantityText);

  if (quantityText === '') {
    errors.quantity = 'Số lượng sách không được để trống';
  } else if (!Number.isInteger(quantityNumber) || quantityText.includes('.')) {
    errors.quantity = 'Số lượng sách phải là số nguyên hợp lệ';
  } else if (quantityNumber <= 0) {
    errors.quantity = 'Số lượng sách phải lớn hơn 0';
  } else if (quantityNumber < currentBorrowed) {
    errors.quantity = `Số lượng không được nhỏ hơn số cuốn đang mượn (${currentBorrowed} cuốn)`;
  }

  return errors;
};
