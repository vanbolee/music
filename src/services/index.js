import request from "../utils/request";

export async function getRecommendSongSheet(limit) {
  return request("/api/personalized?limit=" + (limit || 6), {
    method: "get"
  });
}
export async function getLatestMusic() {
  return request("/api/personalized/newsong", {
    method: "get"
  });
}
export async function getHotTopList() {
  return request("/api/playlist/detail?id=3778678", {
    method: "get"
  });
}
