import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Category } from '../types/book';
import { BookContext } from '../context/BookContext';
import { CATEGORIES } from '../constants/categories';
import { validateBook, ValidationErrors } from '../utils/validateBook';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

export const BookFormScreen = ({ route, navigation }: Props) => {
  const { bookId } = route.params || {};
  const { books, addBook, updateBook } = useContext(BookContext);

  // Tìm sách hiện tại nếu đang ở chế độ Sửa (Câu 2)
  const existingBook = books.find(b => b.id === bookId);
  const isEditing = Boolean(existingBook);
  const currentBorrowed = existingBook ? existingBook.borrowed : 0;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<Category>('Giáo trình');
  const [year, setYear] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Điền sẵn dữ liệu cũ khi sửa sách và cập nhật tiêu đề màn hình
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Sửa sách' : 'Thêm sách mới',
    });

    if (existingBook) {
      setTitle(existingBook.title);
      setAuthor(existingBook.author);
      setCategory(existingBook.category);
      setYear(String(existingBook.year));
      setQuantity(String(existingBook.quantity));
    }
  }, [existingBook, isEditing, navigation]);

  // Xử lý kiểm tra dữ liệu và lưu sách (Câu 2)
  const handleSave = () => {
    const validationErrors = validateBook(
      { title, author, category, year, quantity },
      currentBorrowed,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      category,
      year: Number(year.trim()),
      quantity: Number(quantity.trim()),
    };

    if (isEditing && bookId) {
      updateBook(bookId, bookData);
    } else {
      addBook(bookData);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tên sách */}
          <Text style={styles.label}>Tên sách *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Nhập tên sách..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          {/* Tác giả */}
          <Text style={styles.label}>Tác giả *</Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            placeholder="Nhập tên tác giả..."
            placeholderTextColor={colors.textMuted}
            value={author}
            onChangeText={setAuthor}
          />
          {errors.author && (
            <Text style={styles.errorText}>{errors.author}</Text>
          )}

          {/* Thể loại */}
          <Text style={styles.label}>Thể loại *</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map(cat => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    isSelected && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Năm xuất bản */}
          <Text style={styles.label}>
            Năm xuất bản (1900 - {new Date().getFullYear()}) *
          </Text>
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            placeholder="Ví dụ: 2024"
            placeholderTextColor={colors.textMuted}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}

          {/* Tổng số lượng */}
          <Text style={styles.label}>
            Tổng số cuốn {currentBorrowed > 0 ? `(Đang mượn: ${currentBorrowed})` : ''} *
          </Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            placeholder="Ví dụ: 10"
            placeholderTextColor={colors.textMuted}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          {errors.quantity && (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          )}

          {/* Nút Hủy và Lưu */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.saveBtnText}>Lưu sách</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
