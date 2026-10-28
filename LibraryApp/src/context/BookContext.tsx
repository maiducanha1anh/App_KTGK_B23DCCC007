import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookInput } from '../types/book';
import { CATEGORIES } from '../constants/categories';
import { SAMPLE_BOOKS } from '../data/sampleBooks';

const STORAGE_KEY = '@library_books_list_v1';

interface BookContextType {
  books: Book[];
  isLoading: boolean;
  addBook: (data: BookInput) => void;
  updateBook: (id: string, data: BookInput) => void;
  deleteBook: (id: string) => void;
  borrowBook: (id: string) => void;
  returnBook: (id: string) => void;
}

export const BookContext = createContext<BookContextType>({
  books: [],
  isLoading: true,
  addBook: () => {},
  updateBook: () => {},
  deleteBook: () => {},
  borrowBook: () => {},
  returnBook: () => {},
});

// Kiểm tra dữ liệu đọc từ AsyncStorage có phải danh sách sách hợp lệ cơ bản không
const isValidBookList = (data: Book[]): boolean => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    item =>
      item !== null &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.author === 'string' &&
      CATEGORIES.includes(item.category) &&
      typeof item.year === 'number' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      typeof item.borrowed === 'number' &&
      item.borrowed >= 0 &&
      item.borrowed <= item.quantity,
  );
};

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  // isLoaded chặn việc lưu trước khi đọc xong dữ liệu ban đầu (Câu 6)
  const [isLoaded, setIsLoaded] = useState(false);
  // shouldSave chỉ bật khi người dùng thực hiện thêm/sửa/xóa/mượn/trả, tránh âm thầm ghi đè khi vừa mở app
  const [shouldSave, setShouldSave] = useState(false);

  // 1. Đọc dữ liệu ban đầu từ AsyncStorage khi mở ứng dụng (Câu 6)
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedJson = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedJson === null) {
          // Chưa có dữ liệu lưu (lần chạy đầu tiên) -> khởi tạo ít nhất 5 sách mẫu
          setBooks(SAMPLE_BOOKS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_BOOKS));
        } else {
          // Đã có dữ liệu lưu (nếu là [] do đã xóa hết sách thì giữ nguyên [])
          const parsedData = JSON.parse(storedJson);
          if (isValidBookList(parsedData)) {
            setBooks(parsedData);
          } else {
            Alert.alert(
              'Lỗi dữ liệu',
              'Dữ liệu trong bộ nhớ không hợp lệ. Ứng dụng tạm thời hiển thị danh sách rỗng để tránh ghi đè dữ liệu cũ.',
            );
            setBooks([]);
          }
        }
      } catch (error) {
        Alert.alert(
          'Lỗi đọc dữ liệu',
          'Không thể đọc dữ liệu từ bộ nhớ thiết bị!',
        );
        setBooks([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadBooks();
  }, []);

  // 2. Lưu danh sách sách vào AsyncStorage khi có thay đổi từ người dùng (Câu 6)
  useEffect(() => {
    if (!isLoaded || !shouldSave) {
      return;
    }

    const saveBooks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      } catch (error) {
        Alert.alert(
          'Lỗi lưu dữ liệu',
          'Không thể lưu thay đổi vào bộ nhớ thiết bị!',
        );
      }
    };

    saveBooks();
  }, [books, isLoaded, shouldSave]);

  // Thêm sách mới: tự sinh id không trùng, mặc định borrowed = 0 (Câu 2)
  const addBook = (data: BookInput) => {
    if (!isLoaded) {
      return;
    }

    const newBook: Book = {
      id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      author: data.author,
      category: data.category,
      year: data.year,
      quantity: data.quantity,
      borrowed: 0,
    };

    setBooks(prevBooks => [newBook, ...prevBooks]);
    setShouldSave(true);
  };

  // Sửa sách: giữ nguyên id và borrowed hiện có (Câu 2)
  const updateBook = (id: string, data: BookInput) => {
    if (!isLoaded) {
      return;
    }

    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === id) {
          // Đảm bảo quantity mới không nhỏ hơn số đang mượn
          if (data.quantity < book.borrowed) {
            return book;
          }
          return {
            ...book,
            title: data.title,
            author: data.author,
            category: data.category,
            year: data.year,
            quantity: data.quantity,
          };
        }
        return book;
      }),
    );
    setShouldSave(true);
  };

  // Xóa sách: chỉ xóa khi borrowed === 0 (Câu 3)
  const deleteBook = (id: string) => {
    if (!isLoaded) {
      return;
    }

    setBooks(prevBooks =>
      prevBooks.filter(book => {
        if (book.id === id && book.borrowed === 0) {
          return false;
        }
        return true;
      }),
    );
    setShouldSave(true);
  };

  // Cho mượn sách: tăng borrowed thêm 1 nếu còn sách (borrowed < quantity) (Câu 4)
  const borrowBook = (id: string) => {
    if (!isLoaded) {
      return;
    }

    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === id && book.borrowed < book.quantity) {
          return { ...book, borrowed: book.borrowed + 1 };
        }
        return book;
      }),
    );
    setShouldSave(true);
  };

  // Nhận trả sách: giảm borrowed đi 1 nếu đang mượn (borrowed > 0) (Câu 4)
  const returnBook = (id: string) => {
    if (!isLoaded) {
      return;
    }

    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === id && book.borrowed > 0) {
          return { ...book, borrowed: book.borrowed - 1 };
        }
        return book;
      }),
    );
    setShouldSave(true);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        isLoading: !isLoaded,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
