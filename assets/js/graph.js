export class Graph {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.graph;
    }

    generate(input) {
        if (typeof this.graph == "object") {
            this.graph.destroy();
        }
        this.graph = new Chart(this.canvas, {
            type: 'line',
            data: {
                labels: this.generateTimeline(input.data.length),
                datasets: [{
                    label: input.name,
                    backgroundColor: 'rgb(0, 0, 0, 0)',
                    borderColor: 'rgb(89, 153, 219)',
                    data: input.data,
                    lineTension: 0,
                    pointRadius: 0,
                    steppedLine: false
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        });
    }

    generateTimeline(n) {
        var last_week = new Date();
        const seven_days = 7 * 60 * 60 * 24 * 1000;
        last_week.setTime(last_week.getTime() - seven_days);
        var timeline = [last_week.toLocaleString()]
        for (var i = 1; i < n; i++) {
            last_week.setTime(last_week.getTime() + ((seven_days / n)));
            timeline.push(last_week.toLocaleString())
        }
        return timeline;
    }

    normalize(data) {
        let normalized_data = [];
        let n = data.length;
        let point_gap = this.width / n;
        let data_min = Math.min(...data);
        let range = Math.max(...data) - data_min;
        for (var j = 0; j < n; j++) {
            let normalized = (data[j] - data_min) / range;
            normalized_data.push([point_gap * j, this.height - (normalized * this.height)])
        }
        return normalized_data;
    }
}