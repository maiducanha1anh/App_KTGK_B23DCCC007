import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/book';
import { BookContext } from '../context/BookContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen = ({ route, navigation }: Props) => {
  const { bookId } = route.params;
  const { books, borrowBook, returnBook } = useContext(BookContext);

  // Tìm sách từ Context theo bookId để luôn hiển thị dữ liệu mới nhất (Câu 4)
  const book = books.find(item => item.id === bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.notFoundText}>Không tìm thấy thông tin sách.</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.editBtnText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining <= 0;
  const isNoBorrowed = book.borrowed <= 0;

  // Xử lý cho mượn sách: kiểm tra điều kiện trong hàm xử lý (Câu 4)
  const handleBorrow = () => {
    if (remaining <= 0) {
      Alert.alert('Thông báo', 'Sách đã hết, không thể cho mượn thêm!');
      return;
    }
    borrowBook(book.id);
  };

  // Xử lý nhận trả sách: kiểm tra điều kiện trong hàm xử lý (Câu 4)
  const handleReturn = () => {
    if (book.borrowed <= 0) {
      Alert.alert('Thông báo', 'Hiện không có cuốn nào đang được mượn!');
      return;
    }
    returnBook(book.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Thẻ thông tin sách */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={styles.categoryBadge}>{book.category}</Text>
            {isOutOfStock ? (
              <Text style={styles.outOfStockBadge}>Hết sách</Text>
            ) : (
              <Text style={styles.inStockBadge}>Còn sách</Text>
            )}
          </View>

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.infoText}>Tác giả: {book.author}</Text>
          <Text style={styles.infoText}>Năm xuất bản: {book.year}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{book.quantity}</Text>
              <Text style={styles.statLabel}>Tổng số</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {book.borrowed}
              </Text>
              <Text style={styles.statLabel}>Đang mượn</Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  { color: isOutOfStock ? colors.error : colors.success },
                ]}
              >
                {remaining}
              </Text>
              <Text style={styles.statLabel}>Còn lại</Text>
            </View>
          </View>
        </View>

        {/* Nút Cho mượn và Nhận trả */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.borrowBtn,
              isOutOfStock && styles.disabledBtn,
            ]}
            onPress={handleBorrow}
            disabled={isOutOfStock}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.actionBtnText,
                isOutOfStock && styles.disabledBtnText,
              ]}
            >
              Cho mượn (+1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.returnBtn,
              isNoBorrowed && styles.disabledBtn,
            ]}
            onPress={handleReturn}
            disabled={isNoBorrowed}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.actionBtnText,
                isNoBorrowed && styles.disabledBtnText,
              ]}
            >
              Nhận trả (-1)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nút mở màn hình Sửa sách */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('BookForm', { bookId: book.id })}
          activeOpacity={0.7}
        >
          <Text style={styles.editBtnText}>Sửa thông tin sách</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  outOfStockBadge: {
    backgroundColor: colors.errorLight,
    color: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  inStockBadge: {
    backgroundColor: colors.successLight,
    color: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  borrowBtn: {
    backgroundColor: colors.primaryLight,
  },
  returnBtn: {
    backgroundColor: colors.secondary,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: colors.disabled,
  },
  disabledBtnText: {
    color: colors.disabledText,
  },
  editBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
