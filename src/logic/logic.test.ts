import construct_demo_graph from "./logic";
var jsgraphs = require('js-graph-algorithms');

test('Demo graph is as expected', () => {
    let expected_graph = new jsgraphs.FlowNetwork(10);
    //source to students
    expected_graph.addEdge(new jsgraphs.FlowEdge(0, 1, 100));
    expected_graph.addEdge(new jsgraphs.FlowEdge(0, 2, 100));
    expected_graph.addEdge(new jsgraphs.FlowEdge(0, 3, 100));
    expected_graph.addEdge(new jsgraphs.FlowEdge(0, 4, 100));
    expected_graph.addEdge(new jsgraphs.FlowEdge(0, 5, 100));
    //students to timeslots
    expected_graph.addEdge(new jsgraphs.FlowEdge(1, 6, 1));
    expected_graph.addEdge(new jsgraphs.FlowEdge(1, 7, 1));
    expected_graph.addEdge(new jsgraphs.FlowEdge(1, 8, 1));
    expected_graph.addEdge(new jsgraphs.FlowEdge(2, 6, 1));
    expected_graph.addEdge(new jsgraphs.FlowEdge(3, 7, 1));
    expected_graph.addEdge(new jsgraphs.FlowEdge(4, 8, 1));
    // timeslots to sink
    expected_graph.addEdge(new jsgraphs.FlowEdge(6, 9, 2));
    expected_graph.addEdge(new jsgraphs.FlowEdge(7, 9, 1));
    expected_graph.addEdge(new jsgraphs.FlowEdge(8, 9, 1));
    // test
    expect(construct_demo_graph()).toEqual(expected_graph);
});