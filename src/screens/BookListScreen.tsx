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

  // Thống kê toàn thư viện (không đổi khi lọc/tìm kiếm)
  const totalTitles = books.length;
  const totalBorrowed = books.reduce((sum, book) => sum + book.borrowed, 0);

  // Tìm kiếm theo tên/tác giả kết hợp lọc thể loại
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

  // Nhấn giữ để xóa sách
  const handleDeleteBook = (book: Book) => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xóa',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn được mượn!`,
      );
      return;
    }

    Alert.alert('Xác nhận xóa', `Bạn muốn xóa sách "${book.title}"?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteBook(book.id) },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.topBox}>
        <View style={styles.topRow}>
          <Text style={styles.statsText}>
            Đầu sách: {totalTitles} | Đang mượn: {totalBorrowed}
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('BookForm', {})}
          >
            <Text style={styles.addBtnText}>+ Thêm sách</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên sách hoặc tác giả..."
          placeholderTextColor={colors.subText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterRow}>
          {FILTER_CATEGORIES.map(cat => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {books.length === 0
              ? 'Thư viện hiện chưa có sách nào.'
              : 'Không tìm thấy sách phù hợp.'}
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsText: { fontSize: 15, fontWeight: 'bold', color: colors.text },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: { color: colors.surface, fontWeight: 'bold' },
  searchInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 38,
    color: colors.text,
    marginBottom: 8,
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.subText },
  chipTextActive: { color: colors.surface, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 32, color: colors.subText },
});
