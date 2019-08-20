import React from "react";
import axios from "axios";
import Sound from "react-sound";

import Search from "../components/search.component";
import Details from "../components/details.component";
import Player from "../components/player.component";
import Progress from "../components/progress.component";
import Footer from "../components/footer.component";

interface ITrack {
  stream_url: string;
  title: string;
  artwork_url: string;
}

interface IProps {}
interface IState {
  client_id: string;
  tracks: ITrack[];
  track: ITrack;
  playStatus: any;
  elapsed: string;
  total: string;
  position: number;
  playFromPosition: number;
  autoCompleteValue: string;
}

class AppContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      client_id: "oI1jw6w665Mw1avFTlCjuDarEZhRNupf",
      tracks: [],
      track: { stream_url: "", title: "", artwork_url: "" },
      playStatus: (Sound as any).status.STOPPED,
      elapsed: "00.00",
      total: "00.00",
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: ""
    };
  }

  componentDidMount = () => {
    this.randomTrack();
    console.log(this.state.track);
  };

  randomTrack = () => {
    let _this = this;

    axios
      .get(
        `https://api.soundcloud.com/playlists/209262931?client_id=${
          this.state.client_id
        }`
      )
      .then(response => {
        const trackLength = response.data.tracks.length;
        const randomNumber = Math.floor(Math.random() * trackLength + 1);
        _this.setState({ track: response.data.tracks[randomNumber] });
      })
      .catch(err => {
        console.error(err);
      });
  };

  prepareUrl = (url: string) => {
    return `${url}?client_id=${this.state.client_id}`;
  };

  handleSongPlaying = (audio: any) => {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration,
      playFromPosition: audio.position
    });
  };

  formatMilliseconds = (milliseconds: number) => {
    // Format hours
    var hours = Math.floor(milliseconds / 3600000);

    // Format minutes
    var minutes = Math.floor((milliseconds % 3600000) / 60000);

    // Format seconds
    var seconds = Math.floor(((milliseconds % 3600000) % 60000) / 1000);

    // Return as string
    return (
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds
    );
  };

  handleSongFinished = () => {
    this.randomTrack();
  };

  handleSelect = (value: string, item: ITrack) => {
    this.setState({ autoCompleteValue: value, track: item });
  };

  handleChange = (event: any, value: string) => {
    this.setState({ autoCompleteValue: event.target.value });
    let _this = this;

    axios
      .get(
        `https://api.soundcloud.com/tracks?client_id=${
          this.state.client_id
        }&q=${value}`
      )
      .then(response => _this.setState({ tracks: response.data }))
      .catch(err => console.error(err));
  };

  togglePlay = () => {
    if (this.state.playStatus === (Sound as any).status.PLAYING) {
      this.setState({ playStatus: (Sound as any).status.PAUSED });
    } else {
      this.setState({ playStatus: (Sound as any).status.PLAYING });
    }
  };

  stop = () => {
    this.setState({ playStatus: (Sound as any).status.STOPPED });
  };

  forward = () => {
    let { playFromPosition } = this.state;
    this.setState({
      playFromPosition: playFromPosition += 1000 * 10
    });
  };

  backward = () => {
    let { playFromPosition } = this.state;
    this.setState({
      playFromPosition: playFromPosition -= 1000 * 10
    });
  };

  xlArtwork = (url: string) => {
    if (url != null) {
      return url.replace(/large/, "t500x500");
    }
  };

  render() {
    const scotchStyle = {
      width: "500px",
      height: "500px",
      backgroundImage: `linear-gradient(
        rgba(0,0,0, 0.7),
         rgba(0, 0, 0, 0.7)
         ), url(${this.xlArtwork(this.state.track.artwork_url)})`
    };
    return (
      <div className="scotch_music" style={scotchStyle}>
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect}
          handleChange={this.handleChange}
        />

        <Details title={this.state.track.title} />
        <Player
          togglePlay={this.togglePlay}
          stop={this.stop}
          playStatus={this.state.playStatus}
          forward={this.forward}
          backward={this.backward}
          random={this.randomTrack}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}
        />
        <Footer />

        <Sound
          url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished}
        />
      </div>
    );
  }
}

export default AppContainer;
