import React, { Component } from "react";
import { connect } from "dva";
import styles from "./play.less";
import MScroll from "../../components/mscroll";
import { urlSearchParam } from "../../utils/common";

class Play extends Component {
  constructor(props) {
    super(props);
    this.radioTimeupdate = this.radioTimeupdate.bind(this);
    this.radioEnded = this.radioEnded.bind(this);
    this.state = {
      music: "", //播放地址
      isPlayEnd: false, //播放完毕开关
      isPlay: false, //是否能播放开关
      lrcCurrent: 0, //当前播放进度的高亮歌词索引
      translateY: 0
    };
  }
  componentDidMount() {
    this.setState({
      translateY: (this.refs.lyric.parentNode.offsetHeight / 5) * 2 + "px"
    });
    this.getMusic();
    this.refs.audio.addEventListener("ended", this.radioEnded);
    this.refs.audio.addEventListener("timeupdate", this.radioTimeupdate);
    this.getMusicDetail();
    this.getLyric();
  }
  componentWillUnmount() {
    this.refs.audio.removeEventListener("ended", this.radioEnded);
    this.refs.audio.removeEventListener("timeupdate", this.radioTimeupdate);
  }
  getMusic() {
    this.setState({
      music: `https://music.163.com/song/media/outer/url?id=${urlSearchParam(
        this,
        "id"
      )}.mp3`
    });
  }
  getMusicDetail() {
    this.props.dispatch({
      type: "play/getMusicDetail",
      id: urlSearchParam(this, "id")
    });
  }
  getLyric() {
    this.props.dispatch({
      type: "play/getLyric",
      id: urlSearchParam(this, "id")
    });
  }
  toPlayControl() {
    if (!this.state.isPlay) {
      this.setState(
        {
          isPlay: true
        },
        () => {
          if (this.state.isPlayEnd) {
            this.setState({
              isPlayEnd: false
            });
            this.refs.audio.currentTime = 0;
          }
          try {
            this.refs.audio.play();
          } catch (error) {
            this.setState({
              isPlay: false
            });
          }
        }
      );
    } else {
      this.toSetRotateToParent(this.refs.turnParent, this.refs.turn);
      this.setState(
        {
          isPlay: false
        },
        () => {
          this.refs.audio.pause();
        }
      );
    }
  }
  toSetRotateToParent(parent, child) {
    //获取旋转的子元素的所有样式
    let st = window.getComputedStyle(child, null);
    //获取旋转的子元素的transform样式
    let tr =
      st.getPropertyValue("-webkit-transform") ||
      st.getPropertyValue("-moz-transform") ||
      st.getPropertyValue("-ms-transform") ||
      st.getPropertyValue("-o-transform") ||
      st.getPropertyValue("transform") ||
      "FAIL";
    //将获得的matrix值拆分
    let values = tr
      .split("(")[1]
      .split(")")[0]
      .split(",");
    let a = values[0];
    let b = values[1];
    //通过matrix值获取到角度
    let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    //如果父级存在transform rotate，将获取到的角度加上父级目前的旋转角度，得到最终角度
    if (parent.style.transform) {
      let old = parent.style.transform;
      old = old.split("(")[1].split("deg")[0];
      angle = parseFloat(old) + angle;
    }
    //如果最终的角度大于n个360度，则减去相应的n个360度(保持最终角度在360以内)
    if (angle >= 360) {
      angle = angle - 360 * parseInt(angle / 360, 10);
    }
    //将最终的角度赋值给父级
    parent.style.transform = `rotate(${angle}deg)`;
  }
  radioEnded() {
    this.setState({
      isPlay: false,
      isPlayEnd: true
    });
  }
  radioTimeupdate() {
    if (this.props.lrc && this.props.lrc.length > 0) {
      let time = this.refs.audio.currentTime;
      let arr = this.props.lrc.map(item => {
        return item.time;
      });
      arr.push(time);
      arr.sort((a, b) => {
        return a - b;
      });
      let index = arr.findIndex(_item => {
        return _item === time;
      });
      this.setState({
        lrcCurrent: index - 1,
        translateY:
          (this.refs.lyric.parentNode.offsetHeight / 5) * (2 - (index - 1)) +
          "px"
      });
    }
  }
  render() {
    const { music, isPlay, lrcCurrent, translateY } = this.state;
    const { name, artist, bg, lrc } = this.props;
    return (
      <div className={styles.play}>
        <div className={styles.content}>
          <MScroll>
            <div className={styles.box}>
              <div
                className={styles.main}
                onClick={() => {
                  this.toPlayControl();
                }}
              >
                <div className={styles.mainImg} ref="turnParent">
                  <div
                    className={
                      styles.mainImgChild + (isPlay ? " " + styles.turn : "")
                    }
                    style={{
                      background: `url(${bg}) no-repeat 100%/100%`
                    }}
                    ref="turn"
                  ></div>
                </div>
                <div
                  className={styles.playImg}
                  style={{ display: isPlay ? "none" : "" }}
                >
                  <i className="iconfont icon-bofangjiantou"></i>
                </div>
              </div>
            </div>
            <div className={styles.title}>
              <span>{name + " - "}</span>
              {artist}
            </div>
            <div className={styles.lyric}>
              <div
                className={styles.lyricMain}
                ref="lyric"
                style={{ transform: "translateY(" + translateY + ")" }}
              >
                {lrc &&
                  lrc.map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{ color: lrcCurrent === index ? "#fff" : "" }}
                      >
                        {item.value}
                      </div>
                    );
                  })}
              </div>
            </div>
          </MScroll>
        </div>
        <div
          className={styles.bg}
          style={{
            background: `url(${bg}) no-repeat center/cover`
          }}
        ></div>
        <audio src={music} ref="audio"></audio>
      </div>
    );
  }
}

Play.propTypes = {};

function mapStateToProps(state) {
  return {
    name: state.play.name,
    artist: state.play.artist,
    bg: state.play.bg,
    lrc: state.play.lrc
  };
}

export default connect(mapStateToProps)(Play);
