import React from "react";

interface IProps {
  elapsed: string;
  total: string;
  position: number;
}

class Progress extends React.Component<IProps> {
  render() {
    return (
      <div className="progress">
        <span className="player__time-elapsed">{this.props.elapsed}</span>
        <progress value={this.props.position} max="1" />
        <span className="player__time-total">{this.props.total}</span>
      </div>
    );
  }
}

export default Progress;
