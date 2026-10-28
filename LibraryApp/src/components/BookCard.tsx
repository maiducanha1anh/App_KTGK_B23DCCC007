import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types/book';
import { colors } from '../theme/colors';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

export const BookCard = ({ book, onPress, onLongPress }: BookCardProps) => {
  // Tính số cuốn còn lại (Câu 1)
  const remaining = book.quantity - book.borrowed;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{book.category}</Text>
        </View>
      </View>

      <Text style={styles.author}>Tác giả: {book.author}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.subInfo}>
          Năm: {book.year} | Đang mượn: {book.borrowed}/{book.quantity}
        </Text>

        {/* Còn lại = 0 thì hiện nhãn "Hết sách" màu đỏ (Câu 1) */}
        {remaining === 0 ? (
          <Text style={styles.outOfStock}>Hết sách</Text>
        ) : (
          <Text style={styles.remaining}>Còn lại: {remaining}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subInfo: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  remaining: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  outOfStock: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
});
