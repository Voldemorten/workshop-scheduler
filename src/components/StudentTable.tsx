import * as React from 'react';
import {Table} from 'react-bootstrap';
import Student from './Student'

export default class StudentTable extends React.Component<any,any> {
    
    render() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Preferences</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.students.map((student, index) => {
                        return (
                            <Student
                                key = {index}
                                index = {index}
                                name = {student.name}
                                preferences = {student.preferences}
                            ></Student>
                        )
                    })}
                </tbody>
            </Table>
        );
    }
}