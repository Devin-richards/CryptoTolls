class TollPricer {
    constructor(baseRate) {
        this.baseRate = baseRate;
    }

    calculateToll(trafficData) {
        // This is a simple example of a dynamic toll pricing algorithm.
        // In a real application, you would use a more sophisticated algorithm
        // that takes into account a variety of factors, such as the time of day,
        // the day of the week, and the current traffic conditions.
        const demandFactor = trafficData.congestion > 0.7 ? 1.5 : 1;
        return this.baseRate * demandFactor;
    }
}

module.exports = TollPricer;
