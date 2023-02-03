import { Component } from "react";
import { getTweet, createTweet } from "../services/tweets";
import ErrorMessage from "./ErrorMessage";
import Tweet from "./Tweet";
import jwtDecode from 'jwt-decode';
import { Link } from "react-router-dom";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tweets: [],
      isLoading: true,
      error: null,
      newTweetText: '',
      user: {},
    }
  }

  handleChangeNewTweet(event) {
    this.setState({
        newTweetText: event.target.value
    });
  }

  async handleSubmitNewTweet() {
    const { newTweetText } = this.state;
    // POST / create new tweet through API
    await createTweet(newTweetText);

      // Clear text area
      this.setState({ newTweetText: '' });
    
      // Refetch tweets
      this.handlePopulateTweets();
    }

    async componentDidMount() {
      const { history } = this.props;
      // Check if we have a token in local storage
      const token = localStorage.getItem('TWITTER_TOKEN');

      // If not - redirect to /login
      if(!token) {
        history.replace('/login');
        return;
      }

      // Else - get info from token and show in UI
      const payload = jwtDecode(token);
      this.setState({
        user: payload
      });

      // Fetch tweets from server
      await this.handlePopulateTweets();
    }

  async handlePopulateTweets() {
    this.setState({
      isLoading: true,
      error: null,
    });

    try {
      const tweets = await getTweet();

      this.setState({
        tweets,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: error,
      })
    }
  }

  render() {
    const { error, isLoading, tweets, newTweetText, user } = this.state;

    if (error) {
      return (
        <ErrorMessage
        message={error.message}
        onRetry={this.handlePopulateTweets.bind(this)}/>
        );
      }


    if (isLoading) {
      return (
      <div>Loading tweets...</div>
      )
    }

    const tweetElement = tweets
    .map((tweet) => {
      return <Tweet tweetInfo={tweet} />;
    });

    return (
      <div>

        <h1 className="h1feed">Welcome {user.name}!</h1>
        <Link to="/logout" className="feedlogout">Log out</Link>
        <div className="feedinput">
            <label>
              <p className="feedp">
            Write a new tweet:
              </p>
            <div>
            <textarea 
            rows="3" 
            value={newTweetText} 
            onChange={this.handleChangeNewTweet.bind(this)}/>
            </div>
            </label>
            <button className="submit" onClick={this.handleSubmitNewTweet.bind(this)}>
                Submit Tweet</button>
        </div>
        <div>{tweetElement}</div>
      </div>
    );
  }
}

export default Feed;
