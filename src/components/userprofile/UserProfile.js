import React from "react";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import * as queryString from "query-string";
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

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      id: 1
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    this.setState({ id: values.id });
    fetch(`${getDomain()}/users/${this.state.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async user => {
        // delays continuous execution of an async operation for 0.8 seconds.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log(user);
        this.setState({ user: user });
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong fetching the users: " + err);
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
              <tr>
                <td>Username:</td>
                <td>{this.state.user.username}</td>
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
              </tr>
            </InvisTable>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(UserProfile);
