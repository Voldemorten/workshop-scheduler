/* This function is taken from https://github.com/chen0040/js-graph-algorithms and modified slightly */

var jsgraphs = jsgraphs || {};

(function(jss){    
    var FlowEdge = function(v, w, capacity) {
        this.v = v;
        this.w = w;
        this.capacity = capacity;
        this.flow = 0;
    };
    
    FlowEdge.prototype.residualCapacityTo = function (x) {
        if(x == this.v) {
            return this.flow;
        } else {
            return this.capacity - this.flow;
        }
    };
    
    FlowEdge.prototype.addResidualFlowTo = function (x, deltaFlow) {
        if(x == this.v) {
            this.flow -= deltaFlow;
        } else if(x == this.w) {
            this.flow += deltaFlow;
        }
    };
    
    FlowEdge.prototype.from = function() {
        return this.v;
    };
    
    FlowEdge.prototype.to = function() {
        return this.w;
    };
    
    FlowEdge.prototype.other = function(x) {
        return x == this.v ? this.w : this.v;
    }
    
    
    jss.FlowEdge = FlowEdge;
    
    var FlowNetwork = function(V) {
        this.V = V;
        this.adjList = [];
        this.nodeInfo = [];
        for(var v = 0; v < V; ++v) {
            this.adjList.push([]);
            this.nodeInfo.push({});
        }
    };
    
    FlowNetwork.prototype.node = function(v) {
        return this.nodeInfo[v];
    };
    
    FlowNetwork.prototype.edge = function(v, w) {
        var adj_v = this.adjList[v];
        for(var i=0; i < adj_v.length; ++i) {
            var x = adj_v[i].other(v);
            if(x == w) {
                return adj_v[i];
            }
        }
        return null;
    };
    
    FlowNetwork.prototype.addEdge = function(e) {
        var v = e.from();
        this.adjList[v].push(e);
        var w = e.other(v);
        this.adjList[w].push(e);
    };
    
    FlowNetwork.prototype.adj = function(v) {
        return this.adjList[v];  
    };
    
    jss.FlowNetwork = FlowNetwork;
    
    var FordFulkerson = function(G, s, t) {
        this.value = 0;
        var V = G.V;
        var bottle = Number.MAX_VALUE;
        this.marked = null;
        this.edgeTo = null;
        this.s = s;
        this.t = t;
        while(this.hasAugmentedPath(G)){
            for(var x = this.t; x != this.s; x = this.edgeTo[x].other(x)) {
                bottle = Math.min(bottle, this.edgeTo[x].residualCapacityTo(x));
            }
            
            for(var x = this.t; x != this.s; x = this.edgeTo[x].other(x)) {
                this.edgeTo[x].addResidualFlowTo(x, bottle);
            }

            this.value += bottle;
        }
    };
    
    FordFulkerson.prototype.hasAugmentedPath = function(G) {
        var V = G.V;
        this.marked = [];
        this.edgeTo = [];
        for(var v = 0; v < V; ++v) {
            this.marked.push(false);
            this.edgeTo.push(null);
        }
 
        var vector = [];
        vector[vector.length] = this.s;
        
        this.marked[this.s] = true;
        while(vector.length > 0){
            let r = Math.floor(Math.random() * (vector.length));
            //swap element r with last element
            let tmp = vector[vector.length-1];
            vector[vector.length-1] = vector[r];
            vector[r] = tmp;
            v = vector.pop();
            var adj_v = G.adj(v);
            
            for (var i = 0; i < adj_v.length; ++i) {
                var e = adj_v[i];
                var w = e.other(v);
                if(!this.marked[w] && e.residualCapacityTo(w) > 0){
                    this.edgeTo[w] = e;
                    this.marked[w] = true;
                    if(w == this.t){
                        return true;
                    }
                    vector.push(w);
                }
            }
        }
        
        return false;
    };
    
    FordFulkerson.prototype.minCut = function(G) {
        var cuts = [];
        var V = G.V;
        for(var v = 0; v < V; ++v){
            var adj_v = G.adj(v);
            for(var i = 0; i < adj_v.length; ++i) {
                var e = adj_v[i];
                if(e.from() == v && e.residualCapacityTo(e.other(v)) == 0) {
                    cuts.push(e);
                }
            }
        }
        
        return cuts;
    };

    jss.FordFulkerson = FordFulkerson;
})(jsgraphs);

var module = module || {};
if(module) {
	module.exports = jsgraphs;
}