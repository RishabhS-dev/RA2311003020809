function knapsack(tasks, maxHours) {
    const n = tasks.length;

    const dp = Array.from({ length: n + 1 }, () =>
        Array(maxHours + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
        let duration = tasks[i - 1].Duration;
        let impact = tasks[i - 1].Impact;

        for (let w = 0; w <= maxHours; w++) {
            if (duration <= w) {
                dp[i][w] = Math.max(
                    impact + dp[i - 1][w - duration],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let w = maxHours;
    const selected = [];

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(tasks[i - 1]);
            w -= tasks[i - 1].Duration;
        }
    }

    return {
        maxImpact: dp[n][maxHours],
        selectedTasks: selected
    };
}

module.exports = knapsack;