import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import API from "../../utils/API";
import ReactDOM from 'react-dom'
import io from "socket.io-client";


// TODO - detect if pal is logged in, if not persist for later viewing
// TODO - put up a badge icon when a message comes in

class CalPalModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleChatSend = this.handleChatSend.bind(this);
        this.handleChatMessageReceived = this.handleChatMessageReceived.bind(this);
        this.state = {
            handle: "",
            message: "",
            output: ""
        };
        this.toggle = this.toggle.bind(this);
        this.socket = io.connect("http://localhost:4000")
        this.handleChatMessageReceived()
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    // Generic component state handler when the user types into the input field
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleChatMessageReceived = () => {
        console.log(`*** should now be prepared to receive a socket.io message`)
        this.socket.on('calpal', (data => {
            console.log(`*** now received a socket.io message: ${JSON.stringify(data)}`)
            let newoutput = this.state.output
            newoutput += `[${data.handle}]: ${data.message}<br>`
            this.setState({output: newoutput})
        }))
    }

    // handles search button on modal
    handleChatSend = (event) => {
        // this.setState({  })
        console.log("this was submitted: " + this.state.message)
        // this.toggle();
        event.preventDefault();
        this.socket.emit('calpal', {
            message: this.state.message,
            handle: this.state.handle
        })
        // API.nutritionixInstantSearch(this.state.searchedFood).then(response => {
        //     console.log(`the response back from the search is: ${JSON.stringify(response.data)}`)

        //     this.onResponseFromSearch(response.data)
        //     // const { item_name, nf_calories } = response.data.hits[0].fields
        //     // console.log({ item_name, nf_calories } = response.data.hits[0].fields) 
        //     this.setState({ firstDisplay: "d-none" })


        // })
    }

    // selects item from results
    selectItem = (event) => {
        event.preventDefault();
        console.log("this was selected: ")
    }

    render() {
        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Communication with your CalPal!</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <div id="calpal-chat">
                                    <div id="chatWindow">
                                        <div id="output" dangerouslySetInnerHTML={{__html: this.state.output}}></div>
                                    </div>
                                    <Input id="handle" name="handle" value={this.state.handle} onChange={this.handleInputChange} placeholder="Handle"></Input>
                                    
                                    <Input id="message" name="message" value={this.state.message} onChange={this.handleInputChange} placeholder="Message"></Input>
                                </div>
                            </FormGroup>
                            <Button color="primary" onClick={this.handleChatSend} className="foodSearch">Send</Button>
                        </Form>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default CalPalModal;