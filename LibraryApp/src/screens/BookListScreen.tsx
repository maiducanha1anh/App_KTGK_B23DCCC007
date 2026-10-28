import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Book } from '../types/book';
import { BookContext } from '../context/BookContext';
import { BookCard } from '../components/BookCard';
import { FILTER_CATEGORIES, FilterCategory } from '../constants/categories';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;

export const BookListScreen = ({ navigation }: Props) => {
  const { books, isLoading, deleteBook } = useContext(BookContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>('Tất cả');

  // Thống kê toàn bộ thư viện - không đổi theo tìm kiếm/bộ lọc (Câu 1)
  const totalTitles = books.length;
  const totalBorrowed = books.reduce((sum, book) => sum + book.borrowed, 0);

  // Tìm kiếm theo tên sách HOẶC tác giả kết hợp lọc thể loại đồng thời (Câu 5)
  const keyword = searchQuery.trim().toLowerCase();
  const filteredBooks = books.filter(book => {
    const matchKeyword =
      keyword === '' ||
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword);

    const matchCategory =
      selectedCategory === 'Tất cả' || book.category === selectedCategory;

    return matchKeyword && matchCategory;
  });

  // Xử lý nhấn giữ để xóa sách (Câu 3)
  const handleDeleteBook = (book: Book) => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xóa',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn được mượn, không thể xóa!`,
      );
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa sách "${book.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => deleteBook(book.id),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header & Thống kê */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Quản Lý Thư Viện</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('BookForm', {})}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+ Thêm sách</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalTitles}</Text>
            <Text style={styles.statLabel}>Tổng đầu sách</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>
              {totalBorrowed}
            </Text>
            <Text style={styles.statLabel}>Cuốn đang mượn</Text>
          </View>
        </View>
      </View>

      {/* Tìm kiếm và lọc thể loại */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên sách hoặc tác giả..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {FILTER_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Danh sách sách */}
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() =>
              navigation.navigate('BookDetail', { bookId: item.id })
            }
            onLongPress={() => handleDeleteBook(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centerBox}>
            <Text style={styles.emptyText}>
              {books.length === 0
                ? 'Thư viện hiện chưa có sách nào.'
                : 'Không tìm thấy sách phù hợp.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterSection: {
    backgroundColor: colors.surface,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textPrimary,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
