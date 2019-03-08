import React from "react";
import { BaseContainer, InputField } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { Spinner } from "../../views/design/Spinner";
import styled from "styled-components";

const Container = styled(BaseContainer)`
  display: flex;
  color: white;
  text-align: center;
  justify-content: center;
`;

const InvisTable = styled.table`
  display: flex;
  flex-direction: column;
  border: none;
  color: inherit;
  text-align: left;
  background-color: inherit;
`;

const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 30px;
  border: none;
  border-radius: 2px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(16, 89, 255);
  margin: 1%;
  transition: all 0.3s ease;
`;

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      id: null,
      newUsername: null,
      newBirthday: null,
      showChangeUsername: false,
      showChangeBirthday: false
    };
  }

  async componentDidMount() {
    this.loadData();
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  changeInfo() {
    const changes = JSON.stringify({
      id: this.state.id,
      username: this.state.newUsername,
      birthday: this.state.newBirthday
    });
    console.log(changes);
    fetch(`${getDomain()}/users/${this.state.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: changes
    })
      .then(async response => {
        if (!response.ok) {
          const errorMsg = await response.json();
          console.log(errorMsg);
          const errorURL =
            "/error?code=" +
            response.status +
            "&error=" +
            errorMsg.error +
            "&message=" +
            errorMsg.message;
          this.props.history.push(errorURL);
          return null;
        } else {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      })
      .catch(err => {
        if (err.message.match(/Failed to fetch/)) {
          alert("The server cannot be reached. Did you start it?");
        } else {
          alert(
            `Something went wrong while trying to update user: ${err.message}`
          );
        }
      });
    this.setState({
      newUsername: "default",
      newBirthday: "1900-1-1"
    });
    this.setState({user: null});
    this.loadData();
  }

  async loadData() {
    const values = queryString.parse(this.props.location.search);
    await this.setState({ id: values.id });
    fetch(`${getDomain()}/users/${this.state.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async response => {
        if (!response.ok) {
          const errorMsg = await response.json();
          console.log(errorMsg);
          const errorURL =
            "/error?code=" +
            response.status +
            "&error=" +
            errorMsg.error +
            "&message=" +
            errorMsg.message;
          this.props.history.push(errorURL);
          return null;
        } else {
          return response.json();
        }
      })
      .then(async user => {
        // delays continuous execution of an async operation for 0.8 seconds.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log(user);
        await this.setState({ user: user });
        await this.setState({ newUsername: user.username });
        await this.setState({ newBirthday: user.birthday });
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong fetching the user: " + err);
      });
  }

  render() {
    return (
      <Container>
        {!this.state.user ? (
          <Spinner />
        ) : (
          <div>
            <InvisTable>
              <tbody>
                <tr>
                  <td>Username:</td>
                  <td>{this.state.user.username}</td>
                  <td>
                    {localStorage.getItem("token") === this.state.user.token &&
                    !this.state.showChangeUsername ? (
                      <Button
                        onClick={() => {
                          this.setState({ showChangeUsername: true });
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div>
                        <InputField
                          placeholder="New username..."
                          onChange={e => {
                            this.handleInputChange(
                              "newUsername",
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{this.state.user.status}</td>
                </tr>
                <tr>
                  <td>Registration Date:</td>
                  <td>{this.state.user.registrationDate}</td>
                </tr>
                <tr>
                  <td>Birthday:</td>
                  <td>{this.state.user.birthday}</td>
                  <td>
                    {localStorage.getItem("token") === this.state.user.token &&
                    !this.state.showChangeBirthday ? (
                      <Button
                        onClick={() => {
                          this.setState({ showChangeBirthday: true });
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div>
                        <InputField
                          placeholder="YYYY-MM-DD"
                          onChange={e => {
                            this.handleInputChange(
                              "newBirthday",
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </InvisTable>
            {this.state.showChangeBirthday || this.state.showChangeUsername ? (
              <Button
                onClick={() => {
                  this.changeInfo();
                  this.setState({
                    showChangeBirthday: false,
                    showChangeUsername: false
                  });
                }}
              >
                Submit Changes
              </Button>
            ) : null}
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(UserProfile);
