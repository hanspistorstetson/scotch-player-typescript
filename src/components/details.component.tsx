import React from "react";

interface IProps {
  title: string;
}

class Details extends React.Component<IProps> {
  render() {
    return (
      <div className="details">
        <h3>{this.props.title}</h3>
      </div>
    );
  }
}

export default Details;
