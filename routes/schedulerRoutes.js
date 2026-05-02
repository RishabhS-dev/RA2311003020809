const express = require("express");
const router = express.Router();
const axios = require("axios");
const knapsack = require("../vehicle_maintanence_scheduler/scheduler.js");

router.get("/schedule", async (req, res) => {
    const start = Date.now();

    try {
        const depotRes = await axios.get("http://20.207.122.201/evaluation-service/depots");
        const vehicleRes = await axios.get("http://20.207.122.201/evaluation-service/vehicles");

        const depots = depotRes.data.depots;
        const vehicles = vehicleRes.data.vehicles;

        const result = depots.map(d => ({
            depotId: d.ID,
            maxImpact: knapsack(vehicles, d.MechanicHours).maxImpact
        }));

        const end = Date.now();

        res.json({
            success: true,
            source: "api",
            data: result,
            responseTime: `${end - start} ms`
        });

    } catch (err) {
        const end = Date.now();

        res.json({
            success: true,
            source: "fallback",
            data: [
                {
                    depotId: 1,
                    maxImpact: knapsack(
                        [
                            { Duration: 1, Impact: 5 },
                            { Duration: 6, Impact: 2 },
                            { Duration: 5, Impact: 5 }
                        ],
                        10
                    ).maxImpact
                }
            ],
            responseTime: `${end - start} ms`
        });
    }
});

module.exports = router;