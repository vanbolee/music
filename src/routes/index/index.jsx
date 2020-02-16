import React, { Component } from "react";
import { connect } from "dva";
import styles from "./index.less";
import { NavBar, Tabs } from "antd-mobile";
import MScroll from "../../components/mscroll";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: 0,
      inputVal: ""
    };
  }
  componentDidMount() {
    this.getPageOne();
  }
  getPageOne() {
    this.getRecommendSongSheet();
    this.getLatestMusic();
  }
  getPageTwo() {
    this.getHotTopList();
  }
  getPageThree() {}
  refresh() {
    if (this.state.initialPage === 0) {
      if (this.props.recommendSongSheet.length === 0) {
        this.getPageOne();
      }
    } else if (this.state.initialPage === 1) {
      if (this.props.hotTopList.length === 0) {
        this.getPageTwo();
      }
    } else if (this.state.initialPage === 2) {
    }
    const scrollRefs = ["recommendScroll", "hotScroll", "searchScroll"];
    if (this.refs[scrollRefs[this.state.initialPage]].state.scroll) {
      this.refs[scrollRefs[this.state.initialPage]].state.scroll.refresh();
    }
  }
  getRecommendSongSheet() {
    this.props.dispatch({
      type: "index/getRecommendSongSheet",
      limit: 6
    });
  }
  getLatestMusic() {
    this.props.dispatch({
      type: "index/getLatestMusic"
    });
  }
  getHotTopList() {
    this.props.dispatch({
      type: "index/getHotTopList"
    });
  }
  toPlay(id) {
    this.props.history.push({ pathname: "/play", search: "?id=" + id });
  }
  changeInput(e) {
    this.setState({
      inputVal: e.target.value
    });
  }
  render() {
    const tabs = [
      { title: "推荐音乐" },
      { title: "热歌榜" },
      { title: "搜索" }
    ];
    const { initialPage, inputVal } = this.state;
    const {
      recommendSongSheet,
      latestMusic,
      hotTopList,
      hotTopUpdateTime
    } = this.props;
    return (
      <div className={styles.index}>
        <NavBar mode="light">Music</NavBar>
        <Tabs
          tabs={tabs}
          initialPage={initialPage}
          onChange={(tab, index) => {
            this.setState({ initialPage: index }, () => {
              this.refresh();
            });
          }}
        >
          <div className={styles.recommend}>
            <MScroll ref="recommendScroll">
              <div>
                <div className={styles.recommendTitle}>推荐歌单</div>
                <div className={styles.card}>
                  {recommendSongSheet.map((item, index) => {
                    return (
                      <div className={styles.item} key={index}>
                        <div className={styles.img}>
                          <img alt="" src={item.pic} />
                          <div className={styles.float}>
                            <i className="iconfont icon-erji"></i>
                            <div>{item.playCount}</div>
                          </div>
                        </div>
                        <div className={styles.text}>{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className={styles.recommendTitle}>最新音乐</div>
                <div className={styles.list}>
                  {latestMusic.map((item, index) => {
                    return (
                      <div
                        className={styles.item + " borderbottom1px"}
                        key={index}
                        onClick={() => {
                          this.toPlay(item.id);
                        }}
                      >
                        <div className={styles.left}>
                          <div className={styles.title}>{item.title}</div>
                          <div className={styles.text}>{item.text}</div>
                        </div>
                        <div className={styles.right}>
                          <i className="iconfont icon-bofang"></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </MScroll>
          </div>
          <div className={styles.hot}>
            <MScroll ref="hotScroll">
              <div className={styles.banner}>
                <div className={styles.bannerMain}>
                  <div className={styles.bg}></div>
                  <div className={styles.text}>
                    更新日期：{hotTopUpdateTime}
                  </div>
                </div>
              </div>
              <div className={styles.list}>
                {hotTopList.map((item, index) => {
                  return (
                    <div
                      className={styles.item}
                      key={index}
                      onClick={() => {
                        this.toPlay(item.id);
                      }}
                    >
                      <div
                        className={styles.left}
                        style={{ color: index < 3 ? "#df3436" : "" }}
                      >
                        {("0" + (index + 1)).substr(
                          ("0" + (index + 1)).length - 2,
                          2
                        )}
                      </div>
                      <div className={styles.right + " borderbottom1px"}>
                        <div className={styles.font}>
                          <div className={styles.title}>{item.title}</div>
                          <div className={styles.text}>{item.text}</div>
                        </div>
                        <i className="iconfont icon-bofang"></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </MScroll>
          </div>
          <div className={styles.search}>
            <MScroll ref="searchScroll">
              <div className={styles.searchBox + " borderbottom1px"}>
                <div className={styles.main}>
                  <i className="iconfont icon-search"></i>
                  <input
                    value={inputVal}
                    placeholder="搜素歌手、歌曲、专辑"
                    onChange={e => {
                      this.changeInput(e);
                    }}
                  />
                  {inputVal && (
                    <i
                      className="iconfont icon-clear"
                      onClick={() => {
                        this.setState({ inputVal: "" });
                      }}
                    ></i>
                  )}
                </div>
              </div>
              <div className={styles.default}></div>
            </MScroll>
          </div>
        </Tabs>
      </div>
    );
  }
}

Index.propTypes = {};

function mapStateToProps(state) {
  return {
    recommendSongSheet: state.index.recommendSongSheet,
    latestMusic: state.index.latestMusic,
    hotTopList: state.index.hotTopList,
    hotTopUpdateTime: state.index.hotTopUpdateTime
  };
}

export default connect(mapStateToProps)(Index);
