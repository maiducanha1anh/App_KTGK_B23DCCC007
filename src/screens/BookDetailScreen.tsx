import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/book';
import { BookContext } from '../context/BookContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen = ({ route, navigation }: Props) => {
  const { bookId } = route.params;
  const { books, borrowBook, returnBook } = useContext(BookContext);

  const book = books.find(item => item.id === bookId);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Không tìm thấy thông tin sách.</Text>
      </View>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining <= 0;
  const isNoBorrowed = book.borrowed <= 0;

  const handleBorrow = () => {
    if (remaining <= 0) {
      Alert.alert('Thông báo', 'Sách đã hết, không thể cho mượn thêm!');
      return;
    }
    borrowBook(book.id);
  };

  const handleReturn = () => {
    if (book.borrowed <= 0) {
      Alert.alert('Thông báo', 'Hiện không có cuốn nào đang được mượn!');
      return;
    }
    returnBook(book.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.card}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.info}>Tác giả: {book.author}</Text>
        <Text style={styles.info}>Thể loại: {book.category}</Text>
        <Text style={styles.info}>Năm xuất bản: {book.year}</Text>
        <Text style={styles.info}>Tổng số lượng: {book.quantity} cuốn</Text>
        <Text style={styles.info}>Số đang mượn: {book.borrowed} cuốn</Text>
        <Text style={isOutOfStock ? styles.outText : styles.okText}>
          {isOutOfStock ? 'Trạng thái: Hết sách' : `Còn lại: ${remaining} cuốn`}
        </Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, isOutOfStock && styles.disabledBtn]}
          onPress={handleBorrow}
          disabled={isOutOfStock}
        >
          <Text style={styles.btnText}>Cho mượn (+1)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: colors.secondary },
            isNoBorrowed && styles.disabledBtn,
          ]}
          onPress={handleReturn}
          disabled={isNoBorrowed}
        >
          <Text style={styles.btnText}>Nhận trả (-1)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('BookForm', { bookId: book.id })}
      >
        <Text style={styles.editText}>Sửa thông tin sách</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 14 },
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  info: { fontSize: 15, color: colors.subText, marginTop: 4 },
  okText: { fontSize: 15, fontWeight: 'bold', color: colors.success, marginTop: 8 },
  outText: { fontSize: 15, fontWeight: 'bold', color: colors.error, marginTop: 8 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  btn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: colors.disabled },
  btnText: { color: colors.surface, fontWeight: 'bold' },
  editBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  editText: { color: colors.primary, fontWeight: 'bold' },
});
