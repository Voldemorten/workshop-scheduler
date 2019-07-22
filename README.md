# workshop-scheduler

This is a workshop scheduler planner build during a seminar on Information Systems and Technology 

The problem is as follows:

## The problem

The task at hand is to schedule a multiday workshop, where each day is divided into timeslots and students has to be assigned to these timeslots. Each timeslot has a fixed capacity, and each student has a preference list of when they can work. We want to find a schedule where all students are assigned or all timeslots are filled, while minimizing each students overhead. 

**Objective function**: Find a schedule $S^*$ where either all students $s$ are assigned or all timeslots $t$ are filled, while minimizing each student's overhead $o_s$ (time between assigned timeslots).

$S^*$ is a solution consisting of a set of students $s$ and a set of timeslots $t$, $S^* = \{s, t\}$

$s$ is a set of students, whom have a preference $p_s$ of when they can work where $p_s \subset t$ and some overhead time $o_s$, where $o \in \real$

$t$ is a set of timeslots, where each timeslot has a capacity $c_t$ where $c_t \in \real$, and a set of assigned students $a$ where $a \subset s$ 

*Notes*:

Hard constraint: 

1. A solution only exists if all timeslots has been filled or all students have been assigned. 

Soft constraints:

1. A student should have as little overhead (time between timeslots) as possible at the same day.

## Requirements

* Node and NPM



## To run

* Navigate to folder
* Run "npm install" in terminal
* Run "npm start" in terminal
* Navigate to localhost:8080
* Enjoy



To build production environment (assuming the above steps have already been followed)

* Run "npm run build" 