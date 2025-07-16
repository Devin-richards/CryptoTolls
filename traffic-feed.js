class TrafficFeed {
    constructor(callback) {
        this.callback = callback;
    }

    start() {
        setInterval(() => {
            const trafficData = {
                congestion: Math.random()
            };
            this.callback(trafficData);
        }, 5000); // Generate new data every 5 seconds
    }
}

module.exports = TrafficFeed;
