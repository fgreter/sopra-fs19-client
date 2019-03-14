import React from "react";
import {BaseContainer, FormContainer, Form, Label, WhiteText, ButtonContainer} from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import {Button} from "../../views/design/Button";
import * as queryString from "query-string";


class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            error: "",
            message: ""
        };
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        this.setState({"code": values.code});
        this.setState({"message": values.message});
    }

    back() {
        this.props.history.goBack();
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
                        <ButtonContainer>
                        <Button
                            onClick={() => {
                                this.back();
                            }}
                        >Back</Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(ErrorPage);