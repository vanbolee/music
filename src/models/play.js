import { getMusicDetail, getLyric } from "../services/play";

export default {
  namespace: "play",
  state: {
    name: "",
    artist: "",
    bg: ""
  },
  effects: {
    *getMusicDetail({ id }, { put, call }) {
      const data = yield call(getMusicDetail, id);
      yield put({ type: "changeMusicDetail", payload: data });
    },
    *getLyric({ id }, { put, call }) {
      const data = yield call(getLyric, id);
      yield put({ type: "changeLyric", payload: data });
    }
  },
  reducers: {
    changeMusicDetail(state, { payload: { data } }) {
      let name = "";
      let artist = "";
      let bg = "";
      if (data.songs) {
        let song = data.songs[0];
        let _artist = [];
        if (song.ar && song.ar.length > 0) {
          for (let i = 0; i < song.ar.length; i++) {
            _artist.push(song.ar[i].name);
          }
        }
        name = song.name;
        artist = _artist.join("/");
        const width =
          (document.body.clientWidth / 10) * 4.8 * window.devicePixelRatio;
        bg =
          song.al.picUrl.replace("http://", "https://") +
          "?imageView=1&thumbnail=" +
          width +
          "x" +
          width;
      }
      state.name = name;
      state.artist = artist;
      state.bg = bg;
      return { ...state };
    },
    changeLyric(state, { payload: { data } }) {
      let lrc = [];
      if (data.lrc) {
        let lyrics = data.lrc.lyric.split("\n");
        for (let i = 0; i < lyrics.length; i++) {
          let lyric = decodeURIComponent(lyrics[i]);
          let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          let timeRegExpArr = lyric.match(timeReg);
          let time = null;
          if (!timeRegExpArr) continue;
          let clause = lyric.replace(timeReg, "");
          for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
            let t = timeRegExpArr[k];
            let min = Number(String(t.match(/\[\d*/i)).slice(1)),
              sec = Number(String(t.match(/\:\d*/i)).slice(1)),
              misrc = Number(String(t.match(/\.\d*/i)).slice(1));
            time = parseFloat(min * 60 + sec + "." + misrc);
            lrc.push({
              time: time,
              value: clause
            });
          }
        }
      }
      state.lrc = lrc;
      return { ...state };
    }
  }
};
