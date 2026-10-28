// Phát trailer Youtube ngay trong app (bản web dùng <iframe>)

import { WebView } from "react-native-webview";
import { SITE_URL } from "@/lib/config";

// Youtube chặn video nhúng không có trang nguồn (lỗi 153), nên baseUrl phải là web Cineflexx
export default function TrailerPlayer({ youtubeId }: { youtubeId: string }) {
  const html = `
    <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style="margin:0;background:#000">
        <iframe
          src="https://www.youtube.com/embed/${youtubeId}?playsinline=1"
          style="border:0;width:100%;height:100%;position:absolute;inset:0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </body>
    </html>`;

  return (
    <WebView
      source={{ html, baseUrl: SITE_URL }}
      className="aspect-video w-full bg-black"
      allowsFullscreenVideo
      allowsInlineMediaPlayback
    />
  );
}
