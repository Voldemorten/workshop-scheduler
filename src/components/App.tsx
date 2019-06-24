import {Container, Col, Row, Button, Card, Modal, Form} from 'react-bootstrap';

import * as React from "react";
import * as Greedy from "../logic/greedy";
import StudentTable from './StudentTable'
import UnassignedSchedule from './UnassignedSchedule';
import AssignedSchedule from './AssignedSchedule';
import { Student } from '../models/Student/Student';
import { Timeslot } from '../models/Timeslot/Timeslot';

export class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
          assigned: false,
          students:[],
          timeslots: [],
		  schedule: [],
		  addingStudent: false,
		  creatingSchedule: false,
		  generatingStudents: false,
		  totalPenalty: 0,
		  //the difference between total capacity and total assigned
		  diff: 0,
		};  
		this.toggleAssigned = this.toggleAssigned.bind(this);
	}
	
	componentDidMount(){
		document.addEventListener("keydown", (event) => {
			if(event.keyCode == 83) {
				console.log(this.state);
			}
		}, false);
	}
  
	toggleAssigned() {
		this.setState(state => ({
			assigned: !state.assigned
		}));
	}

	toggleAddingStudent = () => this.setState((state) => {
		return {addingStudent: !state.addingStudent}
	})

	toggleCreatingSchedule = () => this.setState((state) => {
		return {creatingSchedule: !state.creatingSchedule}
	})

	toggleGeneratingStudents = () => this.setState((state) => {
		return {generatingStudents: !state.generatingStudents}
	})

	handleAddingStudentSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
	
		//find preferences
		let preferences = [];
		let student_preferences_div = document.getElementById("student_preferences");
		let checkboxes = student_preferences_div.getElementsByTagName("input");
		let checkboxesArr = Array.prototype.slice.call( checkboxes )
		checkboxesArr = checkboxesArr.filter(c => c.checked);
		for(let i = 0; i<checkboxesArr.length; i++) {
			let checkboxValue = checkboxesArr[i].value;
			let timeslot = Greedy.search_timeslots(this.state.timeslots, checkboxValue[0], checkboxValue[2] );
			preferences.push(timeslot)
			//uncheck checkboxes
			checkboxesArr[i].checked = false;
		}

		let name = e.target.name.value;
		let student = new Student(name, preferences, []);
		student.sort_preferences();
		this.addStudent(student);
		// //clear fields. 
		e.target.name.value = "";
	}

	handleCreatingScheduleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		let days = parseInt(e.target.days.value);
		let timeslots_per_day = parseInt(e.target.timeslots.value);
		let capacity = parseInt(e.target.capacity.value);
		let timeslots = Greedy.generate_balanced_timeslots(days, timeslots_per_day, capacity);
		this.setState(() => {
			return {assigned: false, timeslots: timeslots }
		})
		this.generateSchedule(timeslots);
	}

	handleGeneratingStudentsSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		let no_of_students = e.target.students.value
		this.generateStudents(no_of_students);
	}

	addStudent = (student:Student) => {
		let schedule = Greedy.clear_schedule(this.state.schedule);
		this.setState((state) => {
			return {assigned: false, students: state.students.concat([student]), schedule: schedule}
		})
	}

	generateRandomData = () => {
		let input = Greedy.generate_random_data();
		this.setState(() => {
			return {students: input["students"], timeslots: input["timeslots"]}
		})
	}

	generateSchedule = (timeslots: Array<Timeslot>) => {
		let schedule = Greedy.map_timeslots_to_schedule(timeslots);
		this.setState(() => {
			return {assigned: false, schedule: schedule}
		})
	}

	generateStudents = (no_of_students) => {
		let schedule = Greedy.clear_schedule(this.state.schedule);
		this.setState(() => {
			return {assigned: false, students: Greedy.generate_students(this.state.timeslots, no_of_students), schedule: schedule}
		})
	}

	assignStudents() {
		let res = Greedy.assign_students(this.state.students, this.state.schedule);
		this.setState(() => {
			return {students: res["students"], schedule: res["schedule"], totalPenalty: Greedy.get_total_penalty(res["students"]), totalCapacity: Greedy.timeslots_get_total_capacity(this.state.timeslots), diff: Greedy.check_schedule(res["schedule"])}
		})
	}

    render() {
        return (
            <Container style={containerStyle}>
				{this.state.schedule.length > 0 ?
					<AddStudentModal
						show={this.state.addingStudent}
						onHide={this.toggleAddingStudent}
						onSubmit={this.handleAddingStudentSubmit}
						schedule={this.state.schedule}
					/> :
					null
				}
				
				<CreateScheduleModal
					show={this.state.creatingSchedule}
					onHide={this.toggleCreatingSchedule}
					onSubmit={this.handleCreatingScheduleSubmit}
				/>

				<GenerateStudentsModal
					show={this.state.generatingStudents}
					onHide={this.toggleGeneratingStudents}
					onSubmit={this.handleGeneratingStudentsSubmit}
				/>

                <Row>
                    <Col>
						{this.state.timeslots.length == 0 ?
						<Card>
							<Card.Img src="/images/schedule_demo.png" alt="Card image" />
							<Card.ImgOverlay style={cardImageOverlayStyle}
								onClick={() => {
									this.toggleCreatingSchedule();
								}}
							>
								<Card.Title>Click to generate a new schedule</Card.Title>
							</Card.ImgOverlay>
						</Card>
						:
						<UnassignedSchedule
                            schedule = {this.state.schedule}
                        ></UnassignedSchedule>
						}
						<div>
						<Button
							style={blockButtonStyle}
							variant="outline-primary"
							size="lg"
							block
							onClick={() => {
								this.toggleCreatingSchedule();
							}}
						>Create schedule
						</Button>

						</div>
                    </Col>

					{/* STUDENTS TABLE */}
					<Col>
                        {this.state.students.length == 0 ?
                            <Card>
								<Card.Img src="/images/students_table_demo.png" alt="Card image" />
								<Card.ImgOverlay style={cardImageOverlayStyle} className={this.state.schedule.length == 0 ? "not-allowed " : ""}
									onClick={() => {
										if(this.state.schedule.length > 0) {
											this.toggleAddingStudent();
										} else {
											alert("please create a schedule first");
										}
									}}
								>
									<Card.Title>{this.state.schedule.length > 0 ? "Click to add a student" : "Please generate a schedule first"}</Card.Title>
									<Card.Text>
										{this.state.schedule.length > 0 ? "- or generate random students below" : ""}
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
								style={blockButtonStyle}
								variant="outline-primary"
								size="lg"
								block
								onClick={() => {
									this.toggleAddingStudent();
								}}
								disabled = {this.state.schedule.length == 0}
								className = {this.state.schedule.length == 0 ? "not-allowed or-after-button" : "or-after-button"}
							>Add student
							</Button>
							<Button
								style={blockButtonStyle}
								variant="outline-primary"
								size="lg"
								block
								onClick={() => {
									this.toggleGeneratingStudents();
								}}
								disabled = {this.state.schedule.length == 0}
								className = {this.state.schedule.length == 0 ? "not-allowed or-after-button" : "or-after-button"}
							>Generate students
							</Button>
							<Button
								style={blockButtonStyle}
								variant="outline-primary"
								size="lg"
								block
								onClick={() => {
									let schedule = Greedy.clear_schedule(this.state.schedule);
									this.setState(() => {
										return { students: [], schedule: schedule};
									})
								}}
							>Clear students
							</Button>
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
								this.assignStudents();
								this.toggleAssigned();
							}}
						>Assign students! 
						</Button>
						:
						null
					}
                    
                </Row>
                <Row>
					{
						this.state.assigned ? 
						<AssignedSchedule
							isHidden = {!this.state.assigned}
							schedule = {this.state.schedule}
							students = {this.state.students}
							totalCapacity = {this.state.totalCapacity}
							totalPenalty = {this.state.totalPenalty}
							diff = {this.state.diff}
						></AssignedSchedule>
						:
						null
					}
                </Row>
            </Container>            
        );
    }
}

class AddStudentModal extends React.Component<any,any> {
	render() {
		let schedule_transposed = this.props.schedule[0].map((col, i) => this.props.schedule.map(row => row[i]));
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
				<div id="student_preferences">
					{schedule_transposed.map((row, row_index) => {
						return (
							<Row key={row_index}>
								{row.map((ts, column_index) => {
									return (
										<Col key={column_index}>
											<Form.Check
											key={column_index}
											>
												<Form.Check.Input
													type="checkbox"
													value={[column_index,row_index]}
												></Form.Check.Input>
												<Form.Check.Label>
													{ts.day},{ts.timeslot}
												</Form.Check.Label>
											</Form.Check>
										</Col>	
									)
								})}
							</Row>
						)
						
					})}
				</div>
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

  class CreateScheduleModal extends React.Component<any,any> {
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
			  Create schedule
			</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
		  <Form onSubmit={(e) => {
			  this.props.onSubmit(e);
			  this.props.onHide();
			}}
			>
			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label>Number of days</Form.Label>
						<Form.Control type="number" name="days" placeholder="Number of days" defaultValue="3"/>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Number of timeslots per days</Form.Label>
						<Form.Control type="number" name="timeslots" placeholder="Number of timeslots" defaultValue="3"/>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Capacity of each timeslot</Form.Label>
						<Form.Control type="number" name="capacity" placeholder="Capacity" defaultValue="2"/>
					</Form.Group>
				</Col>
			</Form.Row>
			<Button variant="primary" type="submit">Create schedule</Button>
			</Form>
		  </Modal.Body>
		  <Modal.Footer>
			<Button onClick={this.props.onHide}>Close</Button>
		  </Modal.Footer>
		</Modal>
	  );
	}
  }

  class GenerateStudentsModal extends React.Component<any,any> {
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
			  Generate students
			</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
		  <Form onSubmit={(e) => {
			  this.props.onSubmit(e);
			  this.props.onHide();
			}}
			>
			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label>Number of students</Form.Label>
						<Form.Control type="number" name="students" placeholder="Number of days" defaultValue="3"/>
					</Form.Group>
				</Col>
			</Form.Row>
			<Button variant="primary" type="submit">Generate students</Button>
			</Form>
		  </Modal.Body>
		  <Modal.Footer>
			<Button onClick={this.props.onHide}>Close</Button>
		  </Modal.Footer>
		</Modal>
	  );
	}
  }

  class PreferenceCheckbox extends React.Component {
	  state = {
		  checked: false
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