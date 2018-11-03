import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import API from "../../utils/API";


class VideoModal extends React.Component {
  constructor(props) {
    super(props);
    this.onResponseFromIR = this.onResponseFromIR.bind(this);
    this.state = {
      modal: false,
      constraints: {
        video: { deviceId: { exact: undefined } }
      },
      deviceNames: [],
      preferredDevice: null
    };

    this.initMedia()
    this.toggle = this.toggle.bind(this);
  }

  onResponseFromIR = response => {
    this.props.onResponseFromIR(response);
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

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} id="video-modal" toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Touch the image to Snap!</ModalHeader>
          <ModalBody>
            <video ref={video => { this.video = video }} onClick={this.videoOnClick} className="videoInsert img-fluid" playsInline autoPlay />
            <img ref={image => { this.image = image }} alt="food pic" className="d-none" />
            <canvas ref={canvas => { this.canvas = canvas }} className="d-none"/>
            {/* {this.start} */}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default VideoModal;