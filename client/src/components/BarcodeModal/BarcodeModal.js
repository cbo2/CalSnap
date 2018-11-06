import React from 'react';
import { Button, Modal, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import API from "../../utils/API";
import "./BarcodeModal.css";

class BarcodeModal extends React.Component {
    constructor(props) {
        super(props);
        this.onResponseFromBarcode = this.onResponseFromBarcode.bind(this);
        this.state = {
            modal: false,
            constraints: {
                video: { deviceId: { exact: undefined } },
                advanced: [{torch: true}]
            },
            deviceNames: [],
            preferredDevice: null,
            searchedFood: "",
            firstDisplay: "reveal",
            secondDisplay: "d-none",
            results: [],
            selectedItem: [],
            quantity: 1
        };

        this.initMedia()
        this.toggle = this.toggle.bind(this);
    }

    onResponseFromBarcode = response => {
        // this.props.onResponseFromBarcode(response);
        console.log("this is the responseFromIR: ", response.data)
        this.setState({ secondDisplay: "reveal" })
        if (response.code != "000") {
            alert(`Image is not identifyable!`)
            this.resetModal();
        } else {
            this.setState({ results: response.data })
            console.log("this is from nutritionix: ", this.state.results)
            this.setState({ firstDisplay: "d-none" })
        }
    }

    resetModal = () => {
        this.toggle();
        this.setState({ firstDisplay: "reveal" });
        this.setState({ secondDisplay: "d-none" });
        this.toggle();
    }

    initMedia = () => {
        console.log(`********* initMedia *******`)

        navigator.mediaDevices.enumerateDevices().then(devices => {
            this.gotDevices(devices)
            this.setState({ constraints: { video: { deviceId: { exact: this.state.preferredDevice.deviceId } } } })
            console.log(`*** the preferred deviceid now set to: ${this.state.constraints.video.deviceId.exact}`)
            return devices;
        }).then(stream => {
        }).catch(this.handleError);

    }

    gotDevices = (deviceInfos) => {
        // Handles being called several times to update labels. Preserve values.
        console.log(`"===> the device infoS are: ${JSON.stringify(deviceInfos)}`)

        let device_names = this.state.deviceNames
        let preferred_device = null
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i]
            console.log(`"===> the device info is: ${JSON.stringify(deviceInfo)}`)
            const option = document.createElement('option')
            option.value = deviceInfo.deviceId
            if (deviceInfo.kind === 'videoinput') {
                console.log("==> now appending the vidoeselection of: " + deviceInfo.label)

                device_names.push(deviceInfo.label);
                if (!this.state.preferredDevice) {
                    console.log(`now setting the preffered device to: ${JSON.stringify(deviceInfo)}`)
                    console.log(`\n\n supported tracks are: ${JSON.stringify(navigator.mediaDevices.getSupportedConstraints())}`)
                    preferred_device = deviceInfo    // take a camera of some kind
                } else {
                    // if (deviceInfo.label === "Back Camera") {
                    if (deviceInfo.label.match('[Bb]ack')) {     // regex to match for back/Back camera
                        console.log(`now setting the preffered device to back camera: ${JSON.stringify(deviceInfo)}`)
                        preferred_device = deviceInfo   // prefer the back camera!
                    }
                }
            }
            this.setState({ deviceNames: device_names, preferredDevice: preferred_device })
        }
    }

    gotStream = (stream) => {
        this.experiment()
        window.stream = stream; // make stream available to console
        console.log(`=== now setting the window stream to: ${JSON.stringify(stream)}`)
        console.log(`=== now getting the stream tracks: ${JSON.stringify(stream.getVideoTracks())}`)
        this.video.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }

    experiment = () => {
        console.log(`-------- starting experiment`)
        navigator.mediaDevices.enumerateDevices().then(devices => {

            const cameras = devices.filter((device) => device.kind === 'videoinput');

            if (cameras.length === 0) {
                throw 'No camera found on this device.';
            }
            const camera = cameras[cameras.length - 1];

            // Create stream and get video track
            navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: camera.deviceId,
                    facingMode: ['user', 'environment'],
                    height: { ideal: 1080 },
                    width: { ideal: 1920 }
                }
            }).then(stream => {
                const track = stream.getVideoTracks()[0];

                //Create image capture object and get camera capabilities
                const imageCapture = new ImageCapture(track)
                imageCapture.getPhotoCapabilities().then(() => {

                    //todo: check if camera has a torch

                    //let there be light!
                    console.log(`-------- adding light in experiment now! ------`)
                    track.applyConstraints({
                        advanced: [{ torch: true }]
                    });
                });
            });
        });
        console.log(`-------- finishing experiment`)

    }

    start = () => {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop();
            });
            console.log(`************* [now trying to turn on the flashlight/torch] **************`)
            window.stream.getVideoTracks()[0].applyConstraints({
                advanced: [{ torch: true }]
            });
        }
        if (this.state.preferredDevice) {
            console.log(`the preferred Device id is: ${this.state.preferredDevice.deviceId}`)
        }
        console.log(`the constraints is: ${JSON.stringify(this.state.constraints)}`)
        navigator.mediaDevices.getUserMedia(this.state.constraints).then(this.gotStream).then(this.gotDevices).catch(this.handleError)
    
        navigator.mediaDevices.getUserMedia(this.state.constraints).then(localMediaStream => {
            console.log(localMediaStream)
            let track = localMediaStream.getVideoTracks()[0]
            track.applyConstraints({
                advanced: [{torch: true}]
              });
        })
    }

    handleError = (error) => {
        console.log('navigator.getUserMedia error: ', error);
    }

    toggle() {
        let new_modal_state = !this.state.modal
        this.setState({
            modal: new_modal_state,
            firstDisplay: "reveal",
            secondDisplay: "d-none",
            quantity: 1
        });
        if (new_modal_state) {
            this.start()
        }
    }

    videoOnClick = () => {
        let snap = this.takeSnapshot();
        // Show image. 
        this.image.setAttribute('src', snap);
        this.image.classList.add("visible");
        console.log(`going to hit the watson backend route now.....`)
        // console.log(`about to send image.src of: ${this.image.src}`)
        API.callScanBarcode(this.image.src).then(response => {
            console.log(`the response back from the image recognition is: ${JSON.stringify(response.data)}`)
            this.onResponseFromBarcode(response.data)
        })
        this.video.pause();
    }

    takeSnapshot = () => {

        let context = this.canvas.getContext('2d');

        let width = 300,
            height = 200;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            this.canvas.width = width;
            this.canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(this.video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return this.canvas.toDataURL('image/jpeg', 1.0);
        }
    }

    // selects item from results
    selectItem = (index, event) => {
        // event.preventDefault();
        console.log(this.state.results[index])
        this.setState({ selectedItem: this.state.results[index] })
        console.log(this.state.selectedItem)
        // this.setState ({ firstDisplay: "reveal"})
        // this.toggle()
        this.setState({ secondDisplay: "d-none" })
        this.selectQuantity();
    }

    handleQuantity = (event) => {
        event.preventDefault();
        console.log("quantity: " + this.state.quantity)
        this.toggle()
        this.setState({ firstDisplay: "reveal" })
        // TO DO: clear out forms after quantity entered
        this.toggle()
        this.setState({ secondDisplay: "d-none" })
        API.createFood({
            item_name: this.state.results.food_name,
            quantity: this.state.quantity,
            nf_calories: this.state.results.nf_calories * this.state.quantity,
            nf_protein: this.state.results.nf_protein * this.state.quantity,
            nf_serving_size_unit: this.state.results.serving_qty,
            nf_total_carbohydrate: this.state.results.nf_total_carbohydrate * this.state.quantity,
            username: this.props.username,
            date: new Date()
        })
            .then(this.onResponseFromSearch)
            .catch(err => console.log(err));
    }

    onResponseFromSearch = () => {
        this.props.onResponseFromSearch();  // callback to our parent so it can reload state from Mongo
    }

    render() {
        return (
            <div>
                <Button color="danger" className="snap-button" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} id="video-modal" toggle={this.toggle} className={this.props.className}>
                    <ModalHeader className={this.state.firstDisplay} toggle={this.toggle}>Touch image to snap barcode!</ModalHeader>
                    <ModalHeader className={this.state.secondDisplay} toggle={this.toggle}>Enter number of servings to eat:</ModalHeader>
                    <ModalBody>
                        <div id="videoimage" className={this.state.firstDisplay}>
                            <video ref={video => { this.video = video }} onClick={this.videoOnClick} className="videoInsert img-fluid" playsInline autoPlay />
                            <img ref={image => { this.image = image }} alt="food pic" className="d-none" />
                            <canvas ref={canvas => { this.canvas = canvas }} className="d-none" />
                        </div>
                        <div className={this.state.secondDisplay}>
                            <div>
                                <Row>
                                    <Col>
                                        {this.state.results.food_name} | Calories: {this.state.results.nf_calories}
                                        <hr></hr>
                                    </Col>
                                </Row>
                                <Form>
                                    <FormGroup>
                                        <Input type="textarea" name="text" id="quantityText" value={this.state.quantity} onChange={e => this.setState({ quantity: e.target.value })} />
                                    </FormGroup>
                                    <Button color="primary" onClick={this.handleQuantity} className="select-quantity">Enter</Button>
                                </Form>
                            </div>
                        </div>


                    </ModalBody>
                </Modal>
            </div>
        );
    }

}

export default BarcodeModal;