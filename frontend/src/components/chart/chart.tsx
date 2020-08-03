import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { connect } from 'react-redux';
import { Action } from 'redux';

import { iRootState, Dispatch } from 'resources/store/store';
import { BarChartData } from 'resources/store/models/metrics';

interface MovingChartProps {
    data: BarChartData[];
    updateData(): Action;
}

class MovingChart extends Component<MovingChartProps> {
    private timerID: NodeJS.Timeout;

    componentDidMount() {
        this.timerID = setInterval(() => this.props.updateData(), 500);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <BarChart width={450} height={340} data={this.props.data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip />
                <Legend />
                <Bar dataKey="freq" fill="#8884d8" />
                <Bar dataKey="freq2" fill="#8214d8" />
            </BarChart>
        );
    }
}

const mapState = (state: iRootState) => ({
    data: state.metrics.barchart.data,
});

const mapDispatch = (dispatch: Dispatch) => {
    return {
        updateData: () => {
            return dispatch.metrics.updateData();
        },
    };
};

export default connect(mapState, mapDispatch)(MovingChart);