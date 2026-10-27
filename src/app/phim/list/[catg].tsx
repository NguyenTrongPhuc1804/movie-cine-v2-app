// Danh sách phim theo slug: phim-le, phim-bo... (danh sách) hoặc hanh-dong, kinh-di... (thể loại)

import { Stack, useLocalSearchParams } from "expo-router";
import FilmListPage from "@/components/FilmListPage";
import { useApi } from "@/hooks/useApi";
import { getFilmsByCategory, getListFilm } from "@/lib/api";
import { listSupportsFilter } from "@/lib/apiPath";
import { getListTitle, LIST_TITLES } from "@/lib/lists";
import { getParam } from "@/lib/utils";

export default function FilmListScreen() {
  const params = useLocalSearchParams<{ catg: string }>();
  const slug = getParam(params.catg);
  const isList = Boolean(LIST_TITLES[slug]);
  // API /danh-sach/* bỏ qua năm & trạng thái nên chỉ hiện bộ lọc khi API hỗ trợ
  const filterable = !isList || listSupportsFilter(slug);

  const { data: title } = useApi(() => getListTitle(slug), [slug]);
  const screenTitle = title || LIST_TITLES[slug] || "Danh sách phim";

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <FilmListPage
        listKey={slug}
        title={screenTitle}
        filterable={filterable}
        load={(page, year, status) =>
          isList ? getListFilm(slug, page, year, status) : getFilmsByCategory(slug, page, year, status)
        }
      />
    </>
  );
}
