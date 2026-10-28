import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types/book';
import { colors } from '../theme/colors';

interface Props {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

export const BookCard = ({ book, onPress, onLongPress }: Props) => {
  const remaining = book.quantity - book.borrowed;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.info}>
        Tác giả: {book.author} | Thể loại: {book.category}
      </Text>
      <View style={styles.row}>
        <Text style={styles.info}>
          Năm: {book.year} | Đang mượn: {book.borrowed}/{book.quantity}
        </Text>
        <Text style={remaining === 0 ? styles.outText : styles.okText}>
          {remaining === 0 ? 'Hết sách' : `Còn lại: ${remaining}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  info: { fontSize: 13, color: colors.subText, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  okText: { fontSize: 13, fontWeight: 'bold', color: colors.success },
  outText: { fontSize: 13, fontWeight: 'bold', color: colors.error },
});
