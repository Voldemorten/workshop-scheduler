import {Container, Col, Row, Button, Card, Modal, Form} from 'react-bootstrap';

import * as React from "react";

import * as Flow from "../logic/flow";
import * as Greedy from "../logic/greedy";
import StudentTable from './StudentTable'
import UnassignedSchedule from './UnassignedSchedule';
import { transform } from '@babel/core';
import AssignedSchedule from './AssignedSchedule';

export class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        // let input = Greedy.generate_random_data();
        // console.log(input);
        this.state = {
          assigned: false,
          students: [],
          timeslots: [],
		  schedule: [],
		  addingStudent: false,
          //move everything to state
        };
  
		this.toggleAssigned = this.toggleAssigned.bind(this);
	}
  
	toggleAssigned() {
		this.setState(state => ({
			assigned: !state.assigned
		}));
	}

	toggleAddingStudent = () => this.setState((state) => {
		return {addingStudent: !state.addingStudent}
	})

	handleAddingStudentSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		let name = e.target.name.value;
		//assuming preferences is in this format [0,0] [0,2] … 
		let preferences = e.target.preferences.value.split(" ").map(el => [parseInt(el[1]),parseInt(el[3])])
		this.addStudent({name: name, preferences: preferences});
		e.target.name.value = "";
		e.target.preferences.value = "";
	}

	addStudent = (student) => {
		this.setState((state) => {
			return {students: state.students.concat([student])}
		})
	}


     
    render() {
        return (
            <Container style={containerStyle}>
				
				<AddStudentModal
					show={this.state.addingStudent}
					onHide={this.toggleAddingStudent}
					onSubmit={this.handleAddingStudentSubmit}
				/>

                <Row>
                    <Col>
                        {this.state.students.length == 0 ?
                            <Card>
								<Card.Img src="/images/students_table_demo.png" alt="Card image" />
								<Card.ImgOverlay style={cardImageOverlayStyle}
									onClick={() => {
										this.toggleAddingStudent();
									}}
								>
									<Card.Title>Click to add new student</Card.Title>
									<Card.Text>
										- or generate random students below
									</Card.Text>
								</Card.ImgOverlay>
                            </Card>
                            :
                            <StudentTable
                                students = {this.state.students}
                            ></StudentTable>
						}
						<div>
							<Button
								className="or-after-button" 
								style={blockButtonStyle}
								variant="outline-primary"
								size="lg"
								block
								onClick={() => {
									this.toggleAddingStudent();
								}}
							>Add student
							</Button>
							<Button 
								style={blockButtonStyle}
								variant="outline-primary"
								size="lg"
								block
								onClick={() => {
									console.log("demo");
								}}
							>Generate random students
							</Button>
						</div>

                    </Col>
                    <Col>
						{this.state.timeslots.length == 0 ?
						<Card>
							<Card.Img src="/images/schedule_demo.png" alt="Card image" />
							<Card.ImgOverlay style={cardImageOverlayStyle}>
								<Card.Title>Click to add new timeslot</Card.Title>
								<Card.Text>
									- or generate random students below
								</Card.Text>
							</Card.ImgOverlay>
						</Card>
						:
						<UnassignedSchedule
                            schedule = {this.state.schedule}
                        ></UnassignedSchedule>
						}
						<div>

						</div>
                    </Col>
                </Row>
                <Row>
					{
						this.state.students.length > 0 && this.state.schedule.length > 0 ?
						<Button 
							style={blockButtonStyle}
							variant="primary"
							size="lg"
							block
							onClick={() => {
								Greedy.assign_students(this.state.students, this.state.schedule)
								this.toggleAssigned();
							}}
						>Assign students! 
						</Button>
						:
						null
					}
                    
                </Row>
                <Row>
                    {/* <AssignedSchedule
                        isHidden = {!this.state.assigned}
                        schedule = {this.state.schedule}
                        students = {this.state.students}
                    ></AssignedSchedule> */}
                </Row>
            </Container>            
        );
    }
}

class AddStudentModal extends React.Component<any,any> {
	render() {
	  return (
		<Modal
		  {...this.props}
		  size="lg"
		  aria-labelledby="contained-modal-title-vcenter"
		  centered
		>
		  <Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
			  Add new student
			</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
		  <Form onSubmit={this.props.onSubmit}>
			<Form.Group>
				<Form.Label>Name</Form.Label>
				<Form.Control type="text" name="name" placeholder="Enter name"/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Preferences</Form.Label>
				<Form.Control as="textarea" rows="3" name="preferences" placeholder="[0,1],[0,2],[3,2]"/>
				<Form.Text className="text-muted">
					Please enter preferences in the form: [day, timeslot] [day, timeslot]
				</Form.Text>
			</Form.Group>
			<Button variant="primary" type="submit">Add student</Button>
			</Form>
		  </Modal.Body>
		  <Modal.Footer>
			<Button onClick={this.props.onHide}>Close</Button>
		  </Modal.Footer>
		</Modal>
	  );
	}
  }

const blockButtonStyle: React.CSSProperties = {
    width: "50%",
	margin: "25px auto",
	position: "relative"
}

const containerStyle = {
    margin: "50px auto"
}

const cardImageOverlayStyle: React.CSSProperties = {
	background: "rgba(255,255,255,0.9)",
	border: "6px dashed rgba(0,0,0,0.5)",
	transform: "scale(1.01)",
	borderRadius: "0.7em",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center"
}

// let input = Greedy.generate_random_data()
// let students = input["students"];
// let timeslots = input["timeslots"];
// let total_capacity = input["total_capacity"];
// let total_preferences = input["total_preferences"];
// let schedule = Greedy.construct_schedule(students, timeslots);