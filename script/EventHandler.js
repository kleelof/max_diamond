class EventHandler {

    constructor() {
        this.eventDict = {};
    }

    add = (event_name, func) => {
        if (!this.eventDict[event_name]) this.eventDict[event_name] = [];
        this.eventDict[event_name].push(func)
    };

    trigger = (event_name, data) => {
        this.eventDict[event_name].forEach(func => func(data));
    }
}