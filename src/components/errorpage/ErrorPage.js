import React from "react";
import { BaseContainer, FormContainer, Form, Label, WhiteText } from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import queryString from "query-string";


class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            message: ""
        };
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        this.setState({"code":values.code});
        this.setState({"message": values.message});
    }

    render () {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Error Code:</Label>
                        <WhiteText>{this.state.code}</WhiteText>
                        <Label>Error Message:</Label>
                        <WhiteText>{this.state.message}</WhiteText>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(ErrorPage);