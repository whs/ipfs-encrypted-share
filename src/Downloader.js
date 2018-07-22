import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";
import { Button, Alert, Progress, Spin } from "antd";
import axios from "axios";
import sodium from "libsodium-wrappers";
import { decryptMetadata, decrypt } from "./lib/browserdecrypt";
import FileMetadata from "./components/FileMetadata";

const IPFS_HOST = "http://localhost:5002";
const STATE_DOWNLOAD_METADATA = 0;
const STATE_WAIT_USER = 1;
const STATE_DOWNLOAD_DATA = 2;
const STATE_READY_FOR_DOWNLOAD = 3;

const outer = css`
  padding-top: 100px;
`;
const inner = css`
  width: 80%;
  min-width: 100px;
  max-width: 500px;
  margin: auto;
`;
const progress = css`
  display: flex;
  justify-content: center;
  margin-top: 48px;
`;

export default class Downloader extends React.Component {
  state = {
    metadata: null,
    error: null,
    state: STATE_DOWNLOAD_METADATA,
    progress: 0,
    contentUrl: null
  };

  static propTypes = {
    hash: PropTypes.string.isRequired,
    encryptKey: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.fetchMetadata();
    sodium.ready.then(() => {
      this.setState({ sodiumReady: true });
    });
  }

  render() {
    return (
      <div className={outer}>
        <div className={inner}>{this.renderBody()}</div>
      </div>
    );
  }

  renderBody() {
    if (this.state.error) {
      return <Alert message={this.state.error} type="error" />;
    } else if (this.state.state === STATE_DOWNLOAD_METADATA) {
      return <Spin size="large" />;
    } else if (this.state.state === STATE_WAIT_USER) {
      return (
        <div>
          <FileMetadata metadata={this.state.metadata} />
          <Button
            type="primary"
            icon="download"
            size="large"
            onClick={this.startDownload}
          >
            Start downloading
          </Button>
        </div>
      );
    } else if (this.state.state === STATE_DOWNLOAD_DATA) {
      return (
        <div>
          <FileMetadata metadata={this.state.metadata} />
          <div className={progress}>
            <Progress
              type="circle"
              percent={this.state.progress}
              format={number => Math.floor(number) + "%"}
            />
          </div>
        </div>
      );
    } else if (this.state.state === STATE_READY_FOR_DOWNLOAD) {
      return (
        <div>
          <FileMetadata metadata={this.state.metadata} />
          <Button
            htmlType="a"
            type="primary"
            icon="save"
            size="large"
            href={this.state.contentUrl}
            download={this.state.metadata.filename}
          >
            Save
          </Button>
        </div>
      );
    }
  }

  fetchMetadata() {
    Promise.all([
      sodium.ready,
      axios.get(`${IPFS_HOST}/ipfs/${this.props.hash}/metadata.json`)
    ])
      .then(res => {
        this.setState({
          metadata: decryptMetadata(res[1].data, this.props.encryptKey),
          state: STATE_WAIT_USER
        });
      })
      .catch(err => {
        this.setState({
          error: "Unable to fetch metadata: " + err.toString()
        });
        console.error(err);
      });
  }

  startDownload = e => {
    e.preventDefault();
    this.setState({
      state: STATE_DOWNLOAD_DATA,
      progress: 0
    });

    axios
      .get(`${IPFS_HOST}/ipfs/${this.props.hash}/data`, {
        responseType: "arraybuffer",
        onDownloadProgress: progress => {
          this.setState({
            progress: Math.min((progress.loaded / progress.total) * 100, 100)
          });
        }
      })
      .then(res => {
        let buffer = new Uint8Array(res.data); // this copy the whole data
        let decrypted = decrypt(
          buffer,
          this.state.metadata,
          this.props.encryptKey
        );
        this.setState({
          state: STATE_READY_FOR_DOWNLOAD,
          progress: 100,
          contentUrl: window.URL.createObjectURL(new Blob([decrypted]))
        });
      })
      .catch(err => {
        this.setState({
          error: "Unable to fetch metadata: " + err.toString()
        });
        console.error(err);
      });
  };
}
