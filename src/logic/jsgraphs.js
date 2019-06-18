/* This function is taken from https://github.com/chen0040/js-graph-algorithms and modified slightly */

var jsgraphs = jsgraphs || {};

(function(jss){
    // jss.less = function(a1, a2, compare) {
    //     return compare(a1, a2) < 0;
    // };

    // jss.exchange = function(a, i, j) {
    //     var temp = a[i];
    //     a[i] = a[j];
    //     a[j] = temp;
    // };

    // var MinPQ = function(compare) {
    //     this.s = [];
    //     this.N = 0;
    //     if(!compare) {
    //         compare = function(a1, a2) {
    //             return a1 - a2;
    //         };
    //     }
    //     this.compare = compare;
    // };
    
    // MinPQ.prototype.enqueue = function(item) {
    //     while(this.s.lengh <= this.N+1) {
    //         this.s.push(0);
    //     }   
    //     this.s[++this.N] = item;
    //     this.swim(this.N);
    // };
    
    // MinPQ.prototype.swim = function(k) {
    //     while (k > 1){
    //         var parent = Math.floor(k / 2);
    //         if(jss.less(this.s[k], this.s[parent], this.compare)){
    //             jss.exchange(this.s, k, parent);
    //             k = parent;
    //         } else {
    //             break;
    //         }
    //     }
    // };
    
    // MinPQ.prototype.delMin = function() {
    //     if(this.N == 0) {
    //         return undefined;
    //     }  
        
    //     var item = this.s[1];
    //     jss.exchange(this.s, 1, this.N--);
    //     this.sink(1);
    //     return item;
    // };
    
    // MinPQ.prototype.sink = function(k) {
    //     while(k * 2 <= this.N) {
    //         var child = 2 * k;
    //         if(child < this.N && jss.less(this.s[child+1], this.s[child], this.compare)){
    //             child++;
    //         }
    //         if(jss.less(this.s[child], this.s[k], this.compare)){
    //             jss.exchange(this.s, child, k);
    //             k = child;
    //         } else {
    //             break;
    //         }
    //     }  
    // };
    
    // MinPQ.prototype.size = function(){
    //     return this.N;
    // };
    
    // MinPQ.prototype.isEmpty = function() {
    //     return this.N == 0;
    // };
    
    // jss.MinPQ = MinPQ;
    
    var FlowEdge = function(v, w, capacity) {
        this.v = v;
        this.w = w;
        this.capacity = capacity;
        this.flow = 0;
        this.cost = 0;
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

    // FlowEdge.prototype.addCost = function(newCost) {
    //     this.cost = newCost;
    // }
    
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
    
    var FordFulkerson = function(G) {
        this.value = 0;
        var V = G.V;
        var bottle = Number.MAX_VALUE;
        this.marked = null;
        this.edgeTo = null;
        // assuming that s is always 0 and t is always vertex number length - 1
        this.s = 0;
        this.t = G.V - 1;
        while(this.hasAugmentedPathRandom(G)){
            for(var x = this.t; x != this.s; x = this.edgeTo[x].other(x)) {
                bottle = Math.min(bottle, this.edgeTo[x].residualCapacityTo(x));
            }
            
            for(var x = this.t; x != this.s; x = this.edgeTo[x].other(x)) {
                //The inside of this it statement is to dynamically add a cost to flownetwork
                if(G.node(this.edgeTo[x].v).type == "student") {
                    let studentNode = G.node(this.edgeTo[x].v);
                    let adjList = G.adj(this.edgeTo[x].v);
                    //filter edges so we only have outgoing and only to the same day.
                    //these are the ones we want to update costs on.
                    adjList = adjList.filter((e) => {
                        return this.edgeTo[x].v == e.v && G.node(this.edgeTo[x].w).day == G.node(e.w).day;
                    });

                    // Trying to add cost:
                    // ---------------------
                    //find index of current edge in adjacency list.
                    // let edgeIndex = adjList.indexOf(this.edgeTo[x]);
                    // for(let i = 0; i<adjList.length; i++) {
                    //     //bottom numbers
                    //     var cost = 0;
                    //     if(i < edgeIndex) {
                    //         cost = edgeIndex-1-i;
                    //     } else if(i > edgeIndex) {
                    //         cost = Math.abs(edgeIndex+1-i);
                    //     } else {} //ignore the current element
                    //     adjList[i].addCost(cost);
                    // }
                }
                this.edgeTo[x].addResidualFlowTo(x, bottle);
            }
            this.value += bottle;
        }
    };
    
    FordFulkerson.prototype.hasAugmentedPathRandom = function(G) {
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
    
    // FordFulkerson.prototype.hasAugmentedPathPQ = function(G) {
    //     var V = G.V;
    //     this.marked = [];
    //     this.edgeTo = [];
    //     for(var v = 0; v < V; ++v) {
    //         this.marked.push(false);
    //         this.edgeTo.push(null);
    //     }
        
    //     var queue = new jss.MinPQ((a1,a2) => {
    //         console.log(a1);
    //         console.log(a2);
    //         return a1-a2;
    //     });
    //     queue.enqueue(this.s);
        
    //     this.marked[this.s] = true;
    //     while(!queue.isEmpty()){
    //         var v = queue.delMin();
    //         var adj_v = G.adj(v);
            
    //         for (var i = 0; i < adj_v.length; ++i) {
    //             var e = adj_v[i];
    //             var w = e.other(v);
    //             if(!this.marked[w] && e.residualCapacityTo(w) > 0){
    //                 this.edgeTo[w] = e;
    //                 this.marked[w] = true;
    //                 if(w == this.t){
    //                     return true;
    //                 }
                    
    //                 queue.enqueue(w);
    //             }
    //         }
    //     }
    //     return false;
    // };

    jss.FordFulkerson = FordFulkerson;
})(jsgraphs);

var module = module || {};
if(module) {
	module.exports = jsgraphs;
}