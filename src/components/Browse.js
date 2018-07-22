import React from "react";
import { Button } from "antd";
import propTypes from "prop-types";

export default class Browse extends React.PureComponent {
  uploadRef = React.createRef();

  static propTypes = {
    multiple: propTypes.bool,
    disabled: propTypes.bool,
    onChange: propTypes.func.isRequired
  };

  static defaultProps = {
    multiple: false,
    disabled: false
  };

  render() {
    return (
      <div>
        <Button
          type="primary"
          size="large"
          icon="folder-open"
          onClick={this.onClick}
          multiple={this.props.multiple}
          disabled={this.props.disabled}
        >
          Browse
        </Button>
        <input
          type="file"
          style={{ display: "none" }}
          ref={this.uploadRef}
          onChange={this.onChange}
        />
      </div>
    );
  }

  onClick = e => {
    e.preventDefault();
    this.uploadRef.current.click();
  };

  onChange = e => {
    e.preventDefault();
    let files = [];

    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files.item(i));
    }

    e.target.value = null;

    this.props.onChange(files);
  };
}
