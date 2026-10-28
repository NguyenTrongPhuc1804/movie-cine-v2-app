// Tìm kiếm: ô gõ có gợi ý, bấm Tìm thì hiện toàn bộ kết quả có phân trang
// Từ khoá nằm trên tham số màn hình ?q= (bên web là /phim/search/[search])

import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import FilmListPage from "@/components/FilmListPage";
import SearchBox from "@/components/SearchBox";
import { searchFilms } from "@/lib/api";
import { getParam } from "@/lib/utils";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const keyword = getParam(params.q);

  const searchBox = (
    <View className="pb-2 pt-4">
      <SearchBox
        key={keyword}
        initialKeyword={keyword}
        onSubmit={(text) => router.setParams({ q: text, page: undefined })}
      />
    </View>
  );

  if (!keyword) {
    return (
      <View className="flex-1 px-4">
        {searchBox}
        <Text className="mt-6 text-center text-gray-400">Nhập tên phim tiếng Việt hoặc tên gốc để tìm kiếm.</Text>
      </View>
    );
  }

  return (
    <FilmListPage
      listKey={keyword}
      title={`Kết quả tìm kiếm: ${keyword}`}
      header={searchBox}
      load={(page) => searchFilms(keyword, page)}
    />
  );
}
