import * as React from 'react';
import {Table, Badge, Card} from 'react-bootstrap';

export default class UnassignedSchedule extends React.Component<any,any> {
    
    render() {
        //transpose schedule for eassier ui
        let schedule_transposed = this.props.schedule[0].map((col, i) => this.props.schedule.map(row => row[i]));
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {this.props.schedule.map((day, index) => {
                            return (
                                <th key={index}>Day {index}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {schedule_transposed.map((day, index) => {
                       return (
                           <tr key={index}>
                               {day.map((ts, index) => {
                                   return (
                                       <td style={tdStyle} key = {index}>
                                            <Card className="text-center">
                                                <Card.Header><Badge pill variant="primary" key={index}>[{ts.day},{ts.timeslot}]</Badge></Card.Header>
                                                <Card.Body>
                                                    <Card.Text>
                                                        capacity: {ts.capacity}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                       </td>
                                   )
                               })}
                           </tr>
                       ) 
                    })}
                </tbody>
            </Table>
        );
    }
}

const tdStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: "5px"
  }