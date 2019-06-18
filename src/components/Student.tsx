import * as React from 'react';
import {Badge} from 'react-bootstrap';

export default class Student extends React.Component<any,any> {
    render() {
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{this.props.name}</td>
                <td>
                    {this.props.preferences.map((preference, index) => {
                        return (
                            <Badge pill variant="primary" key={index}>[{preference[0]},{preference[1]}]</Badge>
                        )
                    })}
                </td>
            </tr>
        )
    }
}