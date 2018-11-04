import React from 'react';
import { Button, Modal, Row, Col, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import API from "../../utils/API";
import "./VideoModal.css";


class VideoModal extends React.Component {
  constructor(props) {
    super(props);
    this.onResponseFromIR = this.onResponseFromIR.bind(this);
    this.onResponseFromSearch = this.onResponseFromSearch.bind(this);
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
      thirdDisplay: "d-none",
      results: [],
      selectedItem: [],
      quantity: 1
    };

    this.initMedia()
    this.toggle = this.toggle.bind(this);
  }


  onResponseFromIR = response => {
    // this.props.onResponseFromIR(response);
    console.log("this is the responseFromIR: ", response.data.hits)
    this.setState({ secondDisplay: "reveal" })
    if (response.code != "000") {
      alert(`Image is not identifyable!`)
    } else {
      this.setState({ results: response.data.hits })
      console.log("this is from nutritionix: ", this.state.results)
      this.setState({ firstDisplay: "d-none" })
    }
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
    navigator.mediaDevices.getUserMedia(this.state.constraints).then(this.gotStream).then(this.gotDevices).catch(this.handleError)
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
    API.callImageRecognition(this.image.src).then(response => {
      console.log(`the response back from the image recognition is: ${JSON.stringify(response.data)}`)
      this.onResponseFromIR(response.data)
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
  selectQuantity = (index, event) => {
    this.setState({ thirdDisplay: "reveal" })
  }

  handleQuantity = (event) => {
    event.preventDefault();
    console.log("quantity: " + this.state.quantity)
    this.toggle()
    this.setState({ thirdDisplay: "d-none" })
    console.log(this)
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
      item_name: this.state.selectedItem.fields.item_name,
      quantity: this.state.quantity,
      nf_calories: this.state.selectedItem.fields.nf_calories * this.state.quantity,
      nf_protein: this.state.selectedItem.fields.nf_protein * this.state.quantity,
      nf_serving_size_unit: this.state.selectedItem.fields.nf_serving_size_unit,
      nf_total_carbohydrate: this.state.selectedItem.fields.nf_total_carbohydrate * this.state.quantity,
      username: this.props.username,
      date: new Date()
    })
      // .then(res => console.log("Food created: ", res.data))
      .then(this.onResponseFromSearch())
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
          <ModalHeader className={this.state.firstDisplay} toggle={this.toggle}>Touch the image to Snap!</ModalHeader>
          <ModalHeader className={this.state.secondDisplay} toggle={this.toggle}>Choose an Item to Eat:</ModalHeader>
          <ModalHeader className={this.state.thirdDisplay} toggle={this.toggle}>Enter a Quantity:</ModalHeader>
          <ModalBody>
            <div className={this.state.firstDisplay}>
              <video ref={video => { this.video = video }} onClick={this.videoOnClick} className="videoInsert img-fluid" playsInline autoPlay />
              <img ref={image => { this.image = image }} alt="food pic" className="d-none" />
              <canvas ref={canvas => { this.canvas = canvas }} className="d-none" />
              {/* {this.start} */}
            </div>
            <div className={this.state.secondDisplay}>
              <div>
                {this.state.results.map((oneitem, index) => (
                  <Row key={index + 1000}>
                    <Col>
                      {oneitem.fields.item_name} | Calories: {oneitem.fields.nf_calories}
                      <button onClick={this.selectItem.bind(this, index)} className="results-button" key={index}>Select</button>
                      <hr></hr>
                    </Col>
                  </Row>
                ))}
              </div>
            </div>
            <Form className={this.state.thirdDisplay}>
              <FormGroup>
                <Input type="textarea" name="text" id="quantityText" value={this.state.quantity} onChange={e => this.setState({ quantity: e.target.value })} />
              </FormGroup>
              <Button color="primary" onClick={this.handleQuantity} className="select-quantity">Enter</Button>
            </Form>

          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default VideoModal;