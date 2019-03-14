import React from "react";
import { BaseContainer, FormContainer, Form,
    InputField, Label, ButtonContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";


/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Register extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            name: null,
            username: null,
            birthday: null,
            password: null,
            confirm: null
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
     */
    register() {
        fetch(`${getDomain()}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                name: this.state.name,
                birthday: this.state.birthday,
                password: this.state.password
            })
        })
            .then(async response => {
                if (!response.ok) {
                    console.log(response);
                    response.headers.forEach(header => {
                        console.log(header);
                    });
                    console.log(response.headers.has("reason"));
                    const errorMsg = await response.text();
                    console.log(errorMsg);
                    const errorURL = "/error?code=" + response.status +
                      "&error=" + response.headers.get("Content-Type") +"&message=" + errorMsg;
                    this.props.history.push(errorURL);
                    return null;
                } else {
                    this.props.history.push("/login");
                }
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {}

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Name</Label>
                        <InputField
                            placeholder="Enter name here.."
                            onChange={e => {
                                this.handleInputChange("name", e.target.value);
                            }}
                        />
                        <Label>Username</Label>
                        <InputField
                            placeholder="Enter username here.."
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Birthday (YYYY-MM-DD)</Label>
                        <InputField
                            placeholder="YYYY-MM-DD"
                            onChange={e => {
                                this.handleInputChange("birthday", e.target.value);
                            }}
                        />
                        <Label>Password</Label>
                        <InputField
                            placeholder="Enter password here.."
                            type="password"
                            onChange={e => {
                                this.handleInputChange("password", e.target.value);
                            }}
                        />
                        <Label>Confirm password</Label>
                        <InputField
                            placeholder="Repeat password here.."
                            type="password"
                            onChange={e => {
                                this.handleInputChange("confirm", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username || !this.state.name || !this.state.password
                                ||(this.state.password !== this.state.confirm)}
                                width="50%"
                                onClick={() => {
                                    this.register();
                                }}
                            >
                                Register
                            </Button>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.props.history.push("/login")
                                }}

                            >
                                Login existing user
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Register);
