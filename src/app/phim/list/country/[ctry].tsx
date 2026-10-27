// Danh sách phim theo quốc gia, VD: han-quoc, au-my

import { Stack, useLocalSearchParams } from "expo-router";
import FilmListPage from "@/components/FilmListPage";
import { useApi } from "@/hooks/useApi";
import { getFilmsByCountry } from "@/lib/api";
import { getCountryTitle } from "@/lib/lists";
import { getParam } from "@/lib/utils";

export default function CountryListScreen() {
  const params = useLocalSearchParams<{ ctry: string }>();
  const slug = getParam(params.ctry);

  const { data: title } = useApi(() => getCountryTitle(slug), [slug]);
  const screenTitle = title || "Danh sách phim";

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <FilmListPage
        listKey={slug}
        title={screenTitle}
        filterable
        load={(page, year, status) => getFilmsByCountry(slug, page, year, status)}
      />
    </>
  );
}
