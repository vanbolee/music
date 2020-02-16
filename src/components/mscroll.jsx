import React, { Component } from "react";
import BScroll from "better-scroll";

class MScroll extends Component {
  constructor(props) {
    super(props);
    const random = Math.floor(Math.random() * 10000).toString(16);
    this.state = {
      scroll: "",
      random
    };
  }
  componentDidMount() {
    this.setState({
      scroll: new BScroll(this.refs["mScroll-" + this.state.random], {
        click: true
      })
    });
  }
  render() {
    const { random } = this.state;
    return (
      <div
        className="mScroll"
        style={{ height: "100%" }}
        ref={"mScroll-" + random}
      >
        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default MScroll;
