import React, { Component } from "react";
import CalPalModal from "../../components/CalPalModal";

// TODO - put up a badge icon when a message comes in

class CalPal extends Component {
    state = {
        isCalPalModalOpen: false
    }

    toggleModal = () => {
        this.setState({
            isCalPalModalOpen: !this.state.isCalPalModalOpen
        });
    }

    render(props) {
        const loggedIn = this.props.auth.isAuthenticated();
        if (loggedIn) {
            return (
                <CalPalModal isOpen={this.state.isCalPalModalOpen}
                    onClose={this.toggleModal} buttonLabel="CalPal">
                </CalPalModal>
            )
        } else {
            return (<button  className="btn btn-primary" disabled={true}>!CalPal</button>)
        }
    }
}

export default CalPal;