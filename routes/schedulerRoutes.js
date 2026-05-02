const express = require("express");
const router = express.Router();
const axios = require("axios");
const knapsack = require("../vehicle_maintanence_scheduler/scheduler.js");

const DEPOT_API = "http://20.207.122.201/evaluation-service/depots";
const VEHICLE_API = "http://20.207.122.201/evaluation-service/vehicles";

const headers = {
    Authorization: "Bearer QkbpxH"
};

router.get("/schedule", async (req, res) => {
    const start = Date.now();

    try {
        const depotRes = await axios.get(DEPOT_API, { headers });
        const vehicleRes = await axios.get(VEHICLE_API, { headers });

        const depots = depotRes.data.depots;
        const vehicles = vehicleRes.data.vehicles;

        const result = depots.map(d => ({
            depotId: d.ID,
            maxImpact: knapsack(vehicles, d.MechanicHours).maxImpact
        }));

        const end = Date.now();

        return res.json({
            success: true,
            source: "api",
            data: result,
            responseTime: `${end - start} ms`
        });

    } catch (err) {
        const end = Date.now();

        const fallbackVehicles = [
            { Duration: 1, Impact: 5 },
            { Duration: 6, Impact: 2 },
            { Duration: 5, Impact: 5 },
            { Duration: 7, Impact: 3 }
        ];

        const fallbackResult = [
            {
                depotId: 1,
                maxImpact: knapsack(fallbackVehicles, 10).maxImpact
            }
        ];

        return res.json({
            success: true,
            source: "fallback",
            data: fallbackResult,
            responseTime: `${end - start} ms`
        });
    }
});

module.exports = router;