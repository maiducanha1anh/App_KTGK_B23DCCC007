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

// Kiểm tra dữ liệu đọc từ AsyncStorage có hợp lệ không
const isValidBookList = (data: unknown): data is Book[] => {
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldSave, setShouldSave] = useState(false);

  // Đọc dữ liệu từ AsyncStorage khi mở ứng dụng
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedJson = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedJson === null) {
          setBooks(SAMPLE_BOOKS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_BOOKS));
        } else {
          const parsedData = JSON.parse(storedJson);
          if (isValidBookList(parsedData)) {
            setBooks(parsedData);
          } else {
            Alert.alert('Lỗi dữ liệu', 'Dữ liệu trong bộ nhớ không hợp lệ!');
            setBooks([]);
          }
        }
      } catch {
        Alert.alert('Lỗi', 'Không thể đọc dữ liệu từ thiết bị!');
        setBooks([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadBooks();
  }, []);

  // Tự động lưu vào AsyncStorage mỗi khi danh sách sách thay đổi
  useEffect(() => {
    if (!isLoaded || !shouldSave) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch(() => {
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu vào thiết bị!');
    });
  }, [books, isLoaded, shouldSave]);

  const addBook = (data: BookInput) => {
    if (!isLoaded) return;
    const newBook: Book = {
      id: String(Date.now()),
      ...data,
      borrowed: 0,
    };
    setBooks(prev => [newBook, ...prev]);
    setShouldSave(true);
  };

  const updateBook = (id: string, data: BookInput) => {
    if (!isLoaded) return;
    setBooks(prev =>
      prev.map(book =>
        book.id === id && data.quantity >= book.borrowed
          ? { ...book, ...data }
          : book,
      ),
    );
    setShouldSave(true);
  };

  const deleteBook = (id: string) => {
    if (!isLoaded) return;
    setBooks(prev => prev.filter(book => book.id !== id || book.borrowed > 0));
    setShouldSave(true);
  };

  const borrowBook = (id: string) => {
    if (!isLoaded) return;
    setBooks(prev =>
      prev.map(book =>
        book.id === id && book.borrowed < book.quantity
          ? { ...book, borrowed: book.borrowed + 1 }
          : book,
      ),
    );
    setShouldSave(true);
  };

  const returnBook = (id: string) => {
    if (!isLoaded) return;
    setBooks(prev =>
      prev.map(book =>
        book.id === id && book.borrowed > 0
          ? { ...book, borrowed: book.borrowed - 1 }
          : book,
      ),
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
