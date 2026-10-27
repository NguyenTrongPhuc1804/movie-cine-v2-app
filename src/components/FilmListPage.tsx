// Giao diện chung cho các màn danh sách: thể loại, quốc gia, tìm kiếm, phim lẻ, phim bộ...
// Trang, năm, trạng thái nằm trên tham số màn hình (?page=2&year=2024&status=completed), giống URL bên web

import { useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ErrorView from "./ErrorView";
import FilmCard from "./FilmCard";
import FilmFilters from "./FilmFilters";
import Pagination from "./Pagination";
import SectionTitle from "./SectionTitle";
import { GridSkeleton } from "./Skeletons";
import { useApi } from "@/hooks/useApi";
import { getFilmStatus, getFilmYear, getPageNumber } from "@/lib/utils";
import type { Film, FilmList } from "@/types/movie";

interface FilmListPageProps {
  // Đổi listKey thì tải lại danh sách, VD slug thể loại "hanh-dong" hoặc từ khoá tìm kiếm
  listKey: string;
  title: string;
  // Hàm lấy dữ liệu, VD: (page, year, status) => getFilmsByCategory("hanh-dong", page, year, status)
  load: (page: number, year: string, status: string) => Promise<FilmList>;
  // Phần hiện phía trên tiêu đề, VD ô tìm kiếm
  header?: React.ReactNode;
  filterable?: boolean;
}

export default function FilmListPage({ listKey, title, load, header, filterable = false }: FilmListPageProps) {
  const params = useLocalSearchParams<{ page?: string; year?: string; status?: string }>();
  const page = getPageNumber(params.page);
  const year = filterable ? getFilmYear(params.year) : "";
  const status = filterable ? getFilmStatus(params.status) : "";

  const { data, loading, error, reload } = useApi(() => load(page, year, status), [listKey, page, year, status]);
  const listRef = useRef<FlatList<Film>>(null);

  const changePage = (nextPage: number) => {
    router.setParams({ page: String(nextPage) });
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Đổi bộ lọc thì quay về trang 1
  const changeFilters = (nextYear: string, nextStatus: string) => {
    router.setParams({ year: nextYear || undefined, status: nextStatus || undefined, page: undefined });
  };

  const listHeader = (
    <View>
      {header}
      <SectionTitle title={title} />
      {filterable && <FilmFilters year={year} status={status} onChange={changeFilters} />}
      {loading && data && <ActivityIndicator color="#b91c1c" className="mb-3" />}
      {!data && loading && <GridSkeleton />}
      {data && data.items.length === 0 && <Text className="font-display text-xl text-white">Không tìm thấy phim ....</Text>}
    </View>
  );

  if (error && !data) {
    return <ErrorView message={error} onRetry={reload} />;
  }

  return (
    <FlatList
      ref={listRef}
      className="flex-1 bg-page"
      contentContainerClassName="px-4 pb-28"
      columnWrapperClassName="justify-between"
      contentContainerStyle={{ gap: 12 }}
      data={data?.items || []}
      numColumns={2}
      keyExtractor={(film) => film.slug}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={listHeader}
      renderItem={({ item }) => <FilmCard film={item} className="w-[48.5%]" />}
      ListFooterComponent={
        data ? (
          <Pagination currentPage={data.pagination.currentPage} totalPages={data.pagination.totalPages} onChange={changePage} />
        ) : null
      }
    />
  );
}
