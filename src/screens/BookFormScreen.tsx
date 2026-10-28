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

  const existingBook = books.find(b => b.id === bookId);
  const isEditing = Boolean(existingBook);
  const currentBorrowed = existingBook ? existingBook.borrowed : 0;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<Category>('Giáo trình');
  const [year, setYear] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Tên sách *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Nhập tên sách..."
            value={title}
            onChangeText={setTitle}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <Text style={styles.label}>Tác giả *</Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            placeholder="Nhập tên tác giả..."
            value={author}
            onChangeText={setAuthor}
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}

          <Text style={styles.label}>Thể loại *</Text>
          <View style={styles.row}>
            {CATEGORIES.map(cat => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, active && styles.catBtnActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catText, active && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>
            Năm xuất bản (1900 - {new Date().getFullYear()}) *
          </Text>
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            placeholder="Ví dụ: 2024"
            keyboardType="numeric"
            maxLength={4}
            value={year}
            onChangeText={setYear}
          />
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}

          <Text style={styles.label}>
            Tổng số cuốn {currentBorrowed > 0 ? `(Đang mượn: ${currentBorrowed})` : ''} *
          </Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            placeholder="Ví dụ: 10"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          {errors.quantity && (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.catText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleSave}>
              <Text style={styles.btnText}>Lưu sách</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 14 },
  label: { fontWeight: 'bold', color: colors.text, marginTop: 10, marginBottom: 4 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text,
  },
  inputError: { borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catText: { color: colors.subText, fontWeight: 'bold' },
  catTextActive: { color: colors.surface },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  btn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: { color: colors.surface, fontWeight: 'bold' },
});
