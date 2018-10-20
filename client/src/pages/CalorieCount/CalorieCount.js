import React, { Component } from "react";
// import SomeComponent from "../../components/SomeComponent";
import API from "../../utils/API";
import './CalorieCount.css';
import {
    Jumbotron,
    Form
} from "reactstrap";

const jumbotronStyle = {
    // background: '#00c2ff',
    backgroundImage: `url("/images/newspaper.jpg")`,
    color: 'black',
    marginLeft: "20%", marginRight: "20%"
};


class CalorieCount extends Component {
    state = {
    };

    componentDidMount() {
        // this.loadsomething();
    }



    // handle the form search button to kick off the search to the NYT
    handleSearchSubmit = event => {
        event.preventDefault();
        // API.hitapi({
        // })
        //     .then(res => {
        //             return res
        //         })
        //     })
        //     .catch(err => console.log(err));
    }

    // Generic component state handler when the user types into the input field
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <div>
                <div className="mainDiv">
                    Hello World
    
                    <div className="modal fade" id="startSurveyModal" tabindex="-1" role="dialog" aria-labelledby="startSurveyModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title modal-text-color" id="startSurveyModalLabel">Tap the picture of your food item!</h5>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <br>
                                            <h6 className="modal-text-color">Tap the video stream to snap your picture!</h6>
                                            <div>
                                                <video id="screenshot-video" className="videostream img-fluid" autoPlay="true" preload="auto" muted="true" playsInline="true"></video>
                                                <img id="screenshot-img" source="">
                                            </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
                
export default CalorieCount;