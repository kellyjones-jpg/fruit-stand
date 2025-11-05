(function() {
    'use strict';

    const categories = ['Orange', 'Apple', 'Banana', 'Grape'];
    const values = [30, 10, 7, 1];
    const colors = ['#FF6500', '#FF0000', '#DAA520', '#6F2DA8'];
    const xPositions = [1, 4, 7, 10];
    const barHalfWidth = 0.6;
    const barDepth = 1.2;

    function createBarMesh(xPos, height, color, index) {
        const vertices = {
            x: [
                xPos - barHalfWidth, xPos + barHalfWidth, xPos + barHalfWidth, xPos - barHalfWidth,
                xPos - barHalfWidth, xPos + barHalfWidth, xPos + barHalfWidth, xPos - barHalfWidth
            ],
            y: [0, 0, barDepth, barDepth, 0, 0, barDepth, barDepth],
            z: [0, 0, 0, 0, height, height, height, height]
        };

        const i = [0, 0, 0, 1, 1, 2, 4, 4, 5, 6, 6, 7];
        const j = [1, 2, 4, 2, 3, 3, 5, 6, 1, 7, 5, 3];
        const k = [2, 4, 5, 3, 7, 7, 6, 1, 0, 5, 3, 6];

        return {
            type: 'mesh3d',
            x: vertices.x,
            y: vertices.y,
            z: vertices.z,
            i: i,
            j: j,
            k: k,
            color: color,
            opacity: 0.8,
            flatshading: true,
            name: categories[index],
            hoverinfo: 'name+z'
        };
    }

    // Calculate responsive text size based on screen width
    function getResponsiveTextSize() {
        const width = window.innerWidth;
        if (width < 480) return 16;
        if (width < 768) return 24;
        return 32;
    }

    // Calculate responsive camera position
    function getResponsiveCameraEye() {
        const width = window.innerWidth;
        if (width < 480) {
            return { x: 1.3, y: 2.0, z: 0.3 };
        }
        if (width < 768) {
            return { x: 1.2, y: 1.9, z: 0.25 };
        }
        return { x: 1.1, y: 1.8, z: 0.2 };
    }

    // Create label trace
    function createLabels() {
        return {
            type: 'scatter3d',
            mode: 'text',
            x: xPositions,
            y: new Array(values.length).fill(barDepth * 0.15),
            z: values,
            text: values.map(String),
            textposition: 'top center',
            textfont: {
                size: getResponsiveTextSize(),
                color: '#000',
                weight: 'bold'
            },
            hoverinfo: 'none'
        };
    }

    // Create layout configuration
    function createLayout() {
        return {
            autosize: true,
            margin: { l: 0, r: 0, b: 0, t: 0 },
            scene: {
                xaxis: {
                    title: '',
                    tickvals: xPositions,
                    ticktext: categories,
                    showgrid: false,
                    zeroline: false,
                    showline: false
                },
                yaxis: {
                    visible: false,
                    showgrid: false,
                    zeroline: false,
                    showline: false
                },
                zaxis: {
                    title: '',
                    showgrid: false,
                    zeroline: false,
                    showline: false
                },
                camera: {
                    eye: getResponsiveCameraEye()
                }
            }
        };
    }

    // Plotly configuration
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage'] // Remove on mobile
    };

    // Generate bar meshes
    const bars = values.map((val, idx) => createBarMesh(xPositions[idx], val, colors[idx], idx));

    // Initial plot rendering
    function plotChart() {
        const labels = createLabels();
        const layout = createLayout();
        Plotly.newPlot('container3d', [...bars, labels], layout, config);
    }

    // Debounced resize handler
    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const labels = createLabels();
            const layout = createLayout();
            Plotly.react('container3d', [...bars, labels], layout, config);
        }, 250);
    }

    // Initialize chart when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', plotChart);
    } else {
        plotChart();
    }

    // Event listeners for responsiveness
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            const labels = createLabels();
            const layout = createLayout();
            Plotly.react('container3d', [...bars, labels], layout, config);
        }, 100);
    });

})();
