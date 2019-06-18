import * as React from 'react';
import {Table, Badge, Card} from 'react-bootstrap';

export default class AssignedSchedule extends React.Component<any,any> {

    render() {
        //transpose schedule for eassier ui
        let schedule_transposed = this.props.schedule[0].map((col, i) => this.props.schedule.map(row => row[i]));
        console.log(this.props);
        return (
            <Table striped bordered hover className={this.props.isHidden ? "hidden" : ""}>
                <thead >
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
                                   let remainingCapacity = ts.capacity - ts.assigned.length;
                                   let style;
                                   if(remainingCapacity == ts.capacity) style = "danger";
                                   else if(remainingCapacity > 0) style = "warning";
                                   else style = "success"
                                   return (
                                    <td style={tdStyle} key = {index}>
                                        <Card className="text-center">
                                            <Card.Header><Badge pill variant="primary" key={index}>[{ts.day},{ts.timeslot}]</Badge></Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    {
                                                        ts.assigned.length ? (
                                                            ts.assigned.map((student, index) => {
                                                                return (
                                                                    <Badge 
                                                                        pill variant={style}
                                                                        key={index}
                                                                    >{this.props.students[student].name}
                                                                    </Badge>
                                                                )}
                                                            )
                                                        ) :
                                                        (
                                                            <Badge 
                                                                pill variant={style}
                                                                key={index}
                                                            >No students assigned!
                                                            </Badge>
                                                        )
                                                    }
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer 
                                                style = {cardFooterStyle}
                                                className={remainingCapacity == 0 ? "hidden" : "text-muted"}>
                                                remaining capacity: {remainingCapacity}
                                            </Card.Footer>
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
    padding: "5px",
    fontSize: "20px"
}

const cardFooterStyle: React.CSSProperties = {
    background: "none",
    fontSize: "0.5em"
}