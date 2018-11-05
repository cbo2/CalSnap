import React from 'react';
import { Button, Modal, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import API from "../../utils/API";
import "./BarcodeModal.css";
import Quagga from 'quagga';


class BarcodeModal extends React.Component {
    constructor(props) {
        super(props);
        this.onResponseFromBarcode = this.onResponseFromBarcode.bind(this);
        this.checkCapabilities = this.checkCapabilities.bind(this);
        this.searchBarcode = this.searchBarcode.bind(this);
        this.state = {
            modal: false,
            constraints: {
                video: { deviceId: { exact: undefined } }
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
        window.stream = stream; // make stream available to console
        console.log(`=== now setting the window stream to: ${JSON.stringify(stream)}`)
        this.video.srcObject = stream;
        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }

    start = () => {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop();
            });
        }
        if (this.state.preferredDevice) {
            console.log(`the preferred Device id is: ${this.state.preferredDevice.deviceId}`)
        }
        console.log(`the constraints is: ${JSON.stringify(this.state.constraints)}`)
        navigator.mediaDevices.getUserMedia(this.state.constraints).then(this.gotStream).then(this.gotDevices).then(this.searchBarcode).catch(this.handleError)
    }


    searchBarcode = (target) => {

        console.log(`====================== setting callback for quagga onDetected =========================`)
        Quagga.onDetected(detected => {
            console.log(`*** we got this barcode detected:  ${detected.codeResult.code}`)
        })

        Quagga.onProcessed(result => {
            // console.log(`========> inside onProcessed with result: ${result} <============`)
            let drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                // console.log(`========> inside onProcessed with result.boxes: ${result.boxes} <============`)
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        console.log(`========> inside onProcessed return box != result.box <============`)
                        return box !== result.box;
                    }).forEach(function (box) {
                        console.log(`========> inside onProcessed should be drawing green box now!!!!! <============`)
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        })

        console.log(`====================== init'ng quagga  =========================`)
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: this.canvas    // Or '#yourElement' (optional)
            },
            decoder: {
                readers: ["ean_reader", "code_128_reader"]
            }
        }, function (err) {
            if (err) {
                console.log(`**** Quagga Error: ${err}`);
                return
            }
            console.log("Initialization finished. Ready to start");
            let track = Quagga.CameraAccess.getActiveTrack();
            let capabilities = {};
            if (typeof track.getCapabilities === 'function') {
                capabilities = track.getCapabilities();
            }
            Quagga.start();
        });
    }

    checkCapabilities = () => {
        let track = Quagga.CameraAccess.getActiveTrack();
        let capabilities = {};
        if (typeof track.getCapabilities === 'function') {
            capabilities = track.getCapabilities();
        }
        this.applySettingsVisibility('zoom', capabilities.zoom);
        this.applySettingsVisibility('torch', capabilities.torch);
    }


    applySettingsVisibility = (setting, capability) => {
        // depending on type of capability
        if (typeof capability === 'boolean') {
            let node = document.querySelector('input[name="settings_' + setting + '"]');
            if (node) {
                node.parentNode.style.display = capability ? 'block' : 'none';
            }
            return;
        }
        if (window.MediaSettingsRange && capability instanceof window.MediaSettingsRange) {
            let node = document.querySelector('select[name="settings_' + setting + '"]');
            if (node) {
                this.updateOptionsForMediaRange(node, capability);
                node.parentNode.style.display = 'block';
            }
            return;
        }
    }

    handleError = (error) => {
        console.log('navigator.getUserMedia error: ', error);
    }

    toggle() {
        let new_modal_state = !this.state.modal
        this.setState({
            modal: new_modal_state
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
        API.createUser({
            username: this.props.username
        })
            .then(res => console.log("User created: ", res.data))
            .catch(err => console.log(err));
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
            // .then(res => console.log("Food created: ", res.data))
            .then(this.onResponseFromSearch)
            .catch(err => console.log(err));
    }

    onResponseFromSearch = () => {
        this.props.onResponseFromSearch();  // callback to our parent so it can reload state from Mongo
    }

    render() {
        return (
            <div>
                <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} id="video-modal" toggle={this.toggle} className={this.props.className}>
                    <ModalHeader className={this.state.firstDisplay} toggle={this.toggle}>Touch image to snap barcode!</ModalHeader>
                    <ModalHeader className={this.state.secondDisplay} toggle={this.toggle}>Enter number of servings to eat:</ModalHeader>
                    <ModalBody>
                        <div className={this.state.firstDisplay}>
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