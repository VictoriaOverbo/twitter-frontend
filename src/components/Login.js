import { getLoginToken } from "../services/tweets";
const { Component } = require("react");

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: null,
    };
  }

  handleInputFieldChange(field, event) {
    this.setState({
      [field]: event.target.value,
    });
  }

  async handleLoginAttempt() {
    const { username, password } = this.state;
    const { history } = this.props;

    try {
      // Make a request to create token
      const { token, error } = await getLoginToken(username, password);

      // Check if we got any errors from the server
      if (error) {
        throw new Error(error);
      }

      // Check if we actually got a token
      if (!token) {
        throw new Error("Something went wrong - got no token");
      }

      // Add token to local storage
      localStorage.setItem("TWITTER_TOKEN", token);

      // redirect to feed
      history.replace("/");
    } catch (error) {
      // log or add error to state to show to user
      this.setState({
        error,
      });
    }
  }

  render() {
    const { error, username, password } = this.state;

    return (
      <div className="background">
        <div className="main">
        <h1 className="h1login">
            <img className="timg" src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg" alt="Twitter Logo"/>
            Login
        </h1>
        <div>
          <label>
            <div className="loginup">
            Username:
            </div>
            <input
              type="text"
              className="logininput"
              onChange={(event) =>
                this.handleInputFieldChange("username", event)
              }
              value={username}
            />
          </label>
        </div>
        <div>
          <label>
            <div className="loginup">
            Password:
            </div>
            <input
              type="password"
              className="logininput"
              onChange={(event) =>
                this.handleInputFieldChange("password", event)
              }
              value={password}
            />
          </label>
        </div>
        <div>
          <button className="loginbtn" onClick={this.handleLoginAttempt.bind(this)}>Log in</button>
        </div>
        {error && <div>Error: {error.message}</div>}
        </div>
      </div>
    );
  }
}
export default Login;
