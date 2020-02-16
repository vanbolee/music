import request from "../utils/request";

export async function getMusicDetail(id) {
  return request("/api/song/detail?ids=" + id, {
    method: "get"
  });
}
export async function getLyric(id) {
  return request("/api/lyric?id=" + id, {
    method: "get"
  });
}
