import {
  getRecommendSongSheet,
  getLatestMusic,
  getHotTopList
} from "../services/index";

export default {
  namespace: "index",
  state: {
    recommendSongSheet: [],
    latestMusic: [],
    hotTopList: [],
    hotTopUpdateTime: ""
  },
  effects: {
    *getRecommendSongSheet({ limit }, { put, call }) {
      const data = yield call(getRecommendSongSheet, limit);
      yield put({ type: "changeRecommendSongSheet", payload: data });
    },
    *getLatestMusic({ payload }, { put, call }) {
      const data = yield call(getLatestMusic, payload);
      yield put({ type: "changeLatestMusic", payload: data });
    },
    *getHotTopList({ payload }, { put, call }) {
      const data = yield call(getHotTopList, payload);
      yield put({ type: "changeHotTopList", payload: data });
    }
  },
  reducers: {
    changeRecommendSongSheet(state, { payload: { data } }) {
      let recommendSongSheet = [];
      function numChange(num) {
        if (1e4 > num) {
          return num;
        } else if (1e8 > num) {
          return parseFloat((num / 1e4).toFixed(1)) + "万";
        } else {
          return parseFloat((num / 1e8).toFixed(1)) + "亿";
        }
      }
      if (data.result && data.result.length > 0) {
        for (let i = 0; i < data.result.length; i++) {
          recommendSongSheet.push({
            id: data.result[i].id,
            pic: data.result[i].picUrl.replace("http://", "https://"),
            title: data.result[i].name,
            playCount: numChange(data.result[i].playCount)
          });
        }
      }
      state.recommendSongSheet = recommendSongSheet;
      return { ...state };
    },
    changeLatestMusic(state, { payload: { data } }) {
      let latestMusic = [];
      if (data.result && data.result.length > 0) {
        for (let i = 0; i < data.result.length; i++) {
          let text = "";
          if (data.result[i].song) {
            let song = data.result[i].song;
            if (song.artists && song.artists.length > 0) {
              let artists = [];
              for (let j = 0; j < song.artists.length; j++) {
                artists.push(song.artists[j].name);
              }
              text += artists.join(" / ") + " - ";
            }
            text += song.album.name;
          }
          latestMusic.push({
            id: data.result[i].id,
            title: data.result[i].name,
            text: text
          });
        }
      }
      state.latestMusic = latestMusic;
      return { ...state };
    },
    changeHotTopList(state, { payload: { data } }) {
      let hotTopList = [];
      let hotTopUpdateTime = "";
      if (data.playlist && data.playlist.updateTime) {
        let updateTime = new Date(data.playlist.updateTime);
        let month = updateTime.getMonth() + 1;
        let day = updateTime.getDate();
        month = "0" + month;
        month = month.substr(month.length - 2, 2);
        day = "0" + day;
        day = day.substr(day.length - 2, 2);
        hotTopUpdateTime = month + "月" + day + "日";
      }
      if (
        data.playlist &&
        data.playlist.tracks &&
        data.playlist.tracks.length > 0
      ) {
        let tracks = data.playlist.tracks;
        for (let i = 0; i < 50; i++) {
          let text = "";
          if (tracks[i].ar && tracks[i].ar.length > 0) {
            let artists = [];
            for (let j = 0; j < tracks[i].ar.length; j++) {
              artists.push(tracks[i].ar[j].name);
            }
            text += artists.join(" / ") + " - ";
          }
          text += tracks[i].al.name;
          hotTopList.push({
            id: tracks[i].id,
            title: tracks[i].name,
            text: text
          });
        }
      }
      state.hotTopList = hotTopList;
      state.hotTopUpdateTime = hotTopUpdateTime;
      return { ...state };
    }
  }
};
